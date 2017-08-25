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


def get_similarity(num_best=5):
    vectorizer = TfidfVectorizer(tokenizer=tokenize, stop_words='english')
    posts = utils.get_posts()
    cleaned_posts = {slug: post.lower().translate(str.maketrans('', '', string.punctuation)) for slug, post in posts.items()}

    result = {}
    for slug1, text1 in cleaned_posts.items():
        similarity = {}
        for slug2, text2 in posts.items():
            if slug2 == slug1:
                continue
            score = cosine_sim(text1, text2, vectorizer)
            similarity[slug2] = score
        # print("===========")
        # print(slug1)
        # print(similarity)
        relevant = {slug: score for slug, score in similarity.items() if score > 0.02}
        best = sorted(relevant, key=relevant.get, reverse=True)
        if len(best) > num_best:
            result[slug1] = best[:num_best]
        else:
            result[slug1] = best
    utils.write_result_to_file(result)


get_similarity()
