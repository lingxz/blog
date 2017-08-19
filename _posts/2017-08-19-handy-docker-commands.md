---
title: A few handy docker commands to setting up a server with Nginx and Let's Encrypt
excerpt: Recently I set up my server on DigitalOcean with Docker and Nginx as a reverse proxy. This is a brief documentation of how I did it and a few Docker commands I found most useful. 
---

* TOC
{:toc}

## Setting up a server

This is roughly similar to [this article on Google Cloud](https://cloud.google.com/community/tutorials/nginx-reverse-proxy-docker), just a stripped and slightly reorganized version. 

#### Creating certs directory

To enable HTTPS, we need certificates. So first we need to create a directory to hold the certs.

```sh
cd
mkdir certs
```

We use the [Docker Let's Encrypt nginx-proxy companion](https://github.com/JrCs/docker-letsencrypt-nginx-proxy-companion) to automatically issue and use signed certificates. To do this, we declare volumes when running the reverse-proxy so the `nginx-letsencrypt` companion can populate them with certificates. 

However, in order for `nginx-proxy` to proxy other containers, they have to be on the same Docker network.

#### Running all the containers

So we first create a network:

```sh
docker network create --driver bridge reverse-proxy
```

And we run the nginx reverse proxy and the letsencrypt companion on this network, using the `--net reverse-proxy` command. 

Running the nginx reverse proxy:

```sh
docker run -d -p 80:80 -p 443:443 --name nginx-proxy --net reverse-proxy -v $HOME/certs:/etc/nginx/certs:ro -v /etc/nginx/vhost.d -v /usr/share/nginx/html -v /var/run/docker.sock:/tmp/docker.sock:ro --label com.github.jrcs.letsencrypt_nginx_proxy_companion.nginx_proxy=true jwilder/nginx-proxy
```

Running the `nginx-letsencrypt` companion:

```sh
docker run -d --name nginx-letsencrypt --net reverse-proxy --volumes-from nginx-proxy -v $HOME/certs:/etc/nginx/certs:rw -v /var/run/docker.sock:/var/run/docker.sock:ro jrcs/letsencrypt-nginx-proxy-companion
```

#### docker-compose

We can then start all our website or other app containers using a `docker-compose.yml` file. For example, my docker-compose file looks something like this:

```yaml
version: '2'
services:
  blog:
    restart: always
    image: nginx
    container_name: blog
    volumes:
      - "/etc/nginx/nginx.conf:/etc/nginx/nginx.conf"
      - "/var/www/blog:/etc/nginx/html"
    networks:
      - reverse-proxy
    environment:
      - VIRTUAL_PORT=1234
      - VIRTUAL_HOST=theconfused.me
      - LETSENCRYPT_HOST=theconfused.me
      - LETSENCRYPT_EMAIL=lingyihuu@gmail.com

  draggymail:
    restart: always
    build: "/var/www/draggymail"
    container_name: draggymail
    networks:
      - reverse-proxy
    environment:
      - VIRTUAL_PORT=1234
      - VIRTUAL_HOST=draggymail.theconfused.me
      - LETSENCRYPT_HOST=draggymail.theconfused.me
      - LETSENCRYPT_EMAIL=lingyihuu@gmail.com
networks:
  reverse-proxy:
    external:
      name: reverse-proxy
```
The blog service serves up my blog, which is what you're looking at right now. It just uses the `nginx` container. You can insert the nginx configuration by mounting the appropriate configuration file. The format for mounting volumes is 

```sh
/path/on/host:/path/in/docker/container:options
``` 

The `options` field is optional, it is where you can specify what docker is allowed to do with the mounted volume. `ro` stands for readonly, and `rw` gives the docker container permission to (yup, you guessed it) read and write. 

The draggymail service builds and runs my NodeJS app. The filepath in `build` tells docker to look for the `Dockerfile` inside the folder, build the image, and run the container. This is so that I don't have to build the image separately every time. 

Then just run `docker-compose up -d` to run your containers.


## Handy Docker commands

A few docker commands I found myself repeatedly searching up. 

#### Building an image with a dockerfile in the current directory

```sh
docker build -t image_name:tag_name .
```

#### Running a docker container

Simple command: 

```sh
docker run image_name:tag_name
```

A more complicated command: 

```sh
docker run -d --name container_name -p 80:80 -p 443:443 --net network_name -v /path/of/file/in/host:/path/of/file/in/container image_name:tag_name
```

- `-d` detached mode
- `--name` specify the name you want to call this container
- `-p` ports mapping
- `--net` network to put it on
- `-v` volumes to mount

#### Creating a network

```sh
docker network create --driver bridge network_name
```
`--driver` driver to manage the network


#### Start and go into interactive mode of last created container 

(thanks to [this stackoverflow answer](https://stackoverflow.com/a/37886136/3881923))

```sh
docker start -a -i `docker ps -q -l` 
```

- `docker start` start a container (requires name or ID)
- `-a` attach to container
- `-i` interactive mode
- `docker ps` List containers 
- `-q` list only container IDs
- `-l` list only last created container

#### Start and go into interactive mode of a specific container

```sh
docker exec -it container_name_or_id /bin/bash
```

#### Remove dangling images

```sh
docker rmi $(docker images -qa -f 'dangling=true')
```

List all containers (running and exited):

```sh
docker ps -a
```