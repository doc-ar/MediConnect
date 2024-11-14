import joblib
from flask import Flask, request, jsonify
from utils.preprocessors import preprocess_text
from utils.postprocessors import format_soap_note

app = Flask(__name__)

# import tf-idf vectorizer and logistic regression model
vectorizer = joblib.load('./models/logistic-regression/tfidf_vectorizer.pkl')
model = joblib.load('./models/logistic-regression/logreg_model.pkl')


@app.route('/process-transcript', methods=['GET'])
def process_transcript():
    # Check if input data is missing or not
    data = request.get_json()
    if not data or 'transcript' not in data:
        return jsonify({"error": "Transcript data is missing"}), 400

    # Preprocess and vectorize transcript
    transcript = data['transcript']
    processed_transcript = preprocess_text(transcript)
    vectorized_transcript = vectorizer.transform([processed_transcript])

    soap_note_prediction = model.predict(vectorized_transcript)
    formatted_soap_notes = format_soap_note(soap_note_prediction[0])

    result = {
        "transcript": transcript,
        "soap_notes": formatted_soap_notes
    }
    # Return the processed result as JSON
    return jsonify(result), 200


if __name__ == '__main__':
    app.run(debug=True)
