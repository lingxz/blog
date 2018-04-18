---
title: Getting better related posts in Jekyll using tf-idf
excerpt: It's no secret that Jekyll's built in related posts functionality doesn't return related posts--it only gives you the most recent posts. So I decided to use some NLP techniques to calculate document correlation and retrieve related posts instead. 
math: true
---
<p class="flex items-center justify-center pa3 bg-lightest-blue navy">Update: in my latest minimalistic revamp of my blog, I did away with related posts altogether. </p>

It's no secret that Jekyll's built in related posts functionality doesn't  return related posts--it only gives you the most recent posts. So I looked around for better solutions. 

One [popular solution](https://github.com/jumanji27/related-posts-jekyll-plugin) is to calculate related posts based on a post's tags. However, this requires one to conscientiously tag every post accurately, which seems unlikely. I wanted a much lazier solution--to calculate how related two posts are only based on their content. 

## Calculating document correlation

The aim is simple: to have some way of calculating similarity score between two posts, then we can rank and take the top 5 posts as the related posts. 

The common way of measuring document similarity is by transforming the set of documents into a [tf-idf](https://en.wikipedia.org/wiki/Tf–idf) matrix, then computing the [cosine similarity](https://en.wikipedia.org/wiki/Cosine_similarity) to get the similarity score of each document with all other documents. Tf-idf stands for term frequency-inverse document frequency, and it is composed of two parts:

- **term frequency**: proportional to how often a word appears in a document. This accords importance to words that appear frequently in a document.
- **inverse document frequency**: indicates how often a word appears in all documents. If it appears many times in all documents, then it is given less importance. These are the words that are going to appear frequently no matter what the post is truly about. 

The tf-idf matrix is a matrix where each column represents a document and each row represents a word, and each cell represents the tf-idf value of the word within the document. [Other people](http://www.tfidf.com/) have explained this better than me. 

But before doing this, some tokenization and stemming is needed, since I wouldn't want words like "taken" and "taking" to be identified as two separate words. I also want to remove stop words, which are commonly-used words like "the", "a", "of". 

## The code

Optimally, I would use Ruby to do this since Jekyll is based on Ruby, but unfortunately my Ruby knowledge is zero and I decided to use Python for this. For people who just want to see code, the scripts can be found on my [GitHub repo](https://github.com/lingxz/lingxz.github.io/tree/0827ae2b850c3ba7288d099ea41e41becfa138e5/scripts). 

First I wrote a function that processes the markdown files containing the posts: 

```python
import frontmatter
import glob

def get_posts(folder='./_posts'):
    result = {}
    for filepath in glob.glob(folder + "/*"):
        filename = filepath.split('\\')[-1]
        slug = filename[11:-3]
        post = frontmatter.load(filepath)
        if "slug" in post.keys():
            slug = post["slug"]
        result[slug] = post.content
    return result
```

This just gets all the files from the `_posts/` folder, gets the post slug and content, and stores the information in a dictionary. I used the `python-frontmatter` module to deal with the yaml frontmatter. 

Then I use the `nltk` and `scikit-learn` libraries to do the text processing. `nltk` has the capabilities to do all the natural language processing shenanigans I need while `scikit-learn` has the `TfidVectorizer` to turn documents into a tf-idf vector.  

First, some standard stemming and tokenizing (where `nltk` does most of the work):

```python
import nltk
import string
from sklearn.feature_extraction.text import TfidfVectorizer

stemmer = nltk.stem.porter.PorterStemmer()
nltk.download('punkt')  # download the needed data for tokenizing

def stem_tokens(tokens, stemmer):
    stemmed = []
    for item in tokens:
        stemmed.append(stemmer.stem(item))
    return stemmed

def tokenize(text):
    tokens = nltk.word_tokenize(text)
    stems = stem_tokens(tokens, stemmer)
    return stems 
```

Then I create the vectorizer with the `tokenize` function, and clean the data by lowercasing everything and removing punctuation, and put the data into the vectorizer.

```python
vectorizer = TfidfVectorizer(tokenizer=tokenize, stop_words='english')
posts = get_posts()

# lowercase and remove punctuation from post data
cleaned_posts = {slug: post.lower().translate(str.maketrans('', '', string.punctuation)) for slug, post in posts.items()}
slugs = list(cleaned_posts.keys())

tfidf = vectorizer.fit_transform(list(cleaned_posts.values()))
matrix = (tfidf * tfidf.T).A  # calculate cosine similarity

# example matrix:
# [[ 1.          0.12274921  0.08471414  0.0465803   0.04871383  0.00808005
#   0.0196523 ]
# [ 0.12274921  1.          0.10744334  0.20886152  0.07531169  0.0452097
#   0.04654832]
# [ 0.08471414  0.10744334  1.          0.05036088  0.0453141   0.02618316
#   0.04787127]
# [ 0.0465803   0.20886152  0.05036088  1.          0.16894053  0.03408972
#   0.03633891]
# [ 0.04871383  0.07531169  0.0453141   0.16894053  1.          0.03106121
#   0.03287819]
# [ 0.00808005  0.0452097   0.02618316  0.03408972  0.03106121  1.
#   0.02760873]
# [ 0.0196523   0.04654832  0.04787127  0.03633891  0.03287819  0.02760873
#   1.        ]]
```

The last calculation returns a symmetric matrix $$M$$ where the $$M_{ij}$$ is the similarity between document $$i$$ and document $$j$$. As a check, we can see that the elements on the diagonal are unity since a document's similarity with itself should be 1. 

Then we just need to sort through the matrix to get the top $$n$$ most related posts. In this case, I took $$n = 3$$.

```python
num_best = 3
result = {}
for i, row in enumerate(matrix):
    indices = row.argsort()[-num_best-1:-1][::-1]
    current_slug = slugs[i]
    result[current_slug] = [slugs[index] for index in indices]
# related posts are now stored in the result variable
```

## Putting it back into Jekyll

Now, we have to find some way of inserting this result back into Jekyll. To do this, I decided to make use of [data files](https://jekyllrb.com/docs/datafiles/) to be accessed by my layouts:

```python
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

# then we just have to put the previously calculated result into this function
write_result_to_file(result)
```

This function does some processing with the dictionary it receives and dumps it into `_data/related.yml`. The resulting file should look something like this:

```yaml
- post: setting-up-jekyll
  related:
  - drifter-writing-interactive-fiction-with-ink
  - getting-better-related-posts-in-jekyll-using-tf-idf
  - git-for-noobs
- post: drifter-writing-interactive-fiction-with-ink
  related:
  - solving-the-24-game
  - setting-up-jekyll
  - git-for-noobs
```

Inserting this data into my `post` layout was more difficult than I thought, because I could find no way of getting the post object from the post slug. So, I ended up with this ugly code in my `_layouts/post.html`:

{% raw %}
```liquid
{% for item in site.data.related %}
  {% if page.slug == item.post %}
    <nav class="read-next">
      <h3 class="read-next-label">Other posts you might enjoy</h3>
      <ul>
        {% for pslug in item.related %}
          {% for p in site.posts %}
            {% if p.slug == pslug %}
            <li><a class="read-next-title" href="{{ p.url | prepend: site.baseurl }}" title="{{ p.title | xml_escape }}">{{ p.title | xml_escape }}</a></li>
            {% endif %}
          {% endfor %}
        {% endfor %}
      </ul>
    </nav>
  {% endif %}
{% endfor %}
```
{% endraw %}

Ew, 3 nested for loops. But I couldn't find a way out of it--the first loop is to find the relevant element in the list that the post corresponds to, by checking the slugs. The second to loop through the slugs, so that I can render them, however, to get the post object from the slug, the third loop is needed to loop through all the posts to see which post has a slug that matches. 

Fortunately, this is only run when building the site, and doesn't slow down things on the client side. I only have a handful of posts on my blog, so it really makes no difference. The inconvenience it may bring to some people is that you would have to do the extra step of running the python file to generate `_data/related.yml` before building the site. But I use [gulp](https://gulpjs.com/) to build my site, so I just had to add an extra line in my [gulpfile](https://github.com/lingxz/lingxz.github.io/blob/source/gulpfile.js):

```js
shell.exec('python scripts/similarity.py')
```