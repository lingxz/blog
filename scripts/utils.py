import frontmatter
import glob
import yaml


def get_posts(folder='./_posts'):
    result = {}
    for filepath in glob.glob(folder + "/*"):
        filename = filepath.split('\\')[-1]
        slug = filename[11:-3]
        post = frontmatter.load(filepath)
        result[slug] = post.content
    return result


def write_result_to_file(related, file='./_data/related.yml'):
    data = []
    for r in related:
        r = {
            'post': r,
            'related': related[r]
        }
        data.append(r)
    with open(file, 'w') as f:
        yaml.dump(data, f, default_flow_style=False)
