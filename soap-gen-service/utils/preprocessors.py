import re


# Function to remove \n and punctuations from input text
def preprocess_text(text):
    text = re.sub(r'\n', ' ', text)
    text = re.sub(r'[^\w\s]', '', text)
    return text
