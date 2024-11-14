import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
from utils.preprocessors import preprocess_text

# Load Dataset
splits = {'train': 'my_dataset/train.json', 'test': 'my_dataset/test.json'}
train_df = pd.read_json(
    "hf://datasets/adesouza1/soap_notes/" + splits["train"])
test_df = pd.read_json("hf://datasets/adesouza1/soap_notes/" + splits["test"])

# Remove \n and punctuations
train_df['patient_convo'] = train_df['patient_convo'].apply(preprocess_text)
test_df['patient_convo'] = test_df['patient_convo'].apply(preprocess_text)
train_df['soap_notes'] = train_df['soap_notes'].apply(preprocess_text)
test_df['soap_notes'] = test_df['soap_notes'].apply(preprocess_text)

# Split into inputs and Outputs
X_train = train_df['patient_convo']
y_train = train_df['soap_notes']
X_test = test_df['patient_convo']
y_test = test_df['soap_notes']

# Vectorize using TF-IDF
vectorizer = TfidfVectorizer(max_features=5000)
X_train_vector = vectorizer.fit_transform(X_train)
X_test_vector = vectorizer.transform(X_test)

# Train the logistic regression model
model = LogisticRegression(max_iter=2000)
model.fit(X_train_vector, y_train)

# Evaluate and print the accuracy and classification
y_pred = model.predict(X_test_vector)
print(classification_report(y_test, y_pred))

# Export the model and vectorizer
joblib.dump(vectorizer, './models/logistic-regression/tfidf_vectorizer.pkl')
joblib.dump(model, './models/logistic-regression/logreg_model.pkl')
