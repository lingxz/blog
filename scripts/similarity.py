import nltk
import string
from sklearn.feature_extraction.text import TfidfVectorizer
import utils

stemmer = nltk.stem.porter.PorterStemmer()
nltk.download('punkt')


def stem_tokens(tokens, stemmer):
    stemmed = []
    for item in tokens:
        stemmed.append(stemmer.stem(item))
    return stemmed


def tokenize(text):
    tokens = nltk.word_tokenize(text)
    stems = stem_tokens(tokens, stemmer)
    return stems


def cosine_sim(text1, text2, vectorizer):
    tfidf = vectorizer.fit_transform([text1, text2])
    return ((tfidf * tfidf.T).A)[0, 1]


def get_similarity(num_best=3):
    vectorizer = TfidfVectorizer(tokenizer=tokenize, stop_words='english')
    posts = utils.get_posts()
    cleaned_posts = {slug: post.lower().translate(str.maketrans('', '', string.punctuation)) for slug, post in posts.items()}
    slugs = list(cleaned_posts.keys())

    tfidf = vectorizer.fit_transform(list(cleaned_posts.values()))
    matrix = (tfidf * tfidf.T).A

    result = {}
    for i, row in enumerate(matrix):
        indices = row.argsort()[-num_best-1:-1][::-1]
        current_slug = slugs[i]
        result[current_slug] = [slugs[index] for index in indices]
    utils.write_result_to_file(result)


if __name__ == "__main__":
    get_similarity()
