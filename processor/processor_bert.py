import joblib
from sentence_transformers import SentenceTransformer
import numpy as np  # For argmax

# Load the models
model_embedding = SentenceTransformer('all-MiniLM-L6-v2')
model_classification = joblib.load(r"C:\Users\yasiru\Desktop\Log Classification\training\models\log_classifier.joblib")

def classify_with_bert(log_message):
    embeddings = model_embedding.encode([log_message])
    probabilities = model_classification.predict_proba(embeddings)[0]
    if max(probabilities) < 0.5:
        return "Unclassified"
    predicted_label = model_classification.predict(embeddings)[0]
    return predicted_label

if __name__ == "__main__":
    logs = [
        "alpha.osapi_compute.wsgi.server - 12.10.11.1 - API returned 404 not found error",
        "GET /v2/3454/servers/detail HTTP/1.1 RCODE   404 len: 1583 time: 0.1878400",
        "System crashed due to drivers errors when restarting the server",
        "Hey bro, chill ya!",
        "Multiple login failures occurred on user 6454 account",
        "Server A790 was restarted unexpectedly during the process of data transfer"
    ]

    # Process logs in batch for efficiency
    embeddings = model_embedding.encode(logs)
    
    for log, embedding in zip(logs, embeddings):
        probabilities = model_classification.predict_proba([embedding])[0]
        max_prob = max(probabilities)
        max_index = np.argmax(probabilities)
        
        print(f"Log: {log}")
        print(f"Max probability: {max_prob:.4f} for class: {model_classification.classes_[max_index]}")
        print(f"All probabilities: {probabilities}")
        
        label = classify_with_bert(log)
        print(f"Final classification: {log} -> {label}\n")
