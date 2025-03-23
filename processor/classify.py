import warnings
from sklearn.exceptions import InconsistentVersionWarning
import os

# Suppress the scikit-learn version warning
warnings.filterwarnings("ignore", category=InconsistentVersionWarning)

try:
    # When imported as a module from Server.py
    from processor.processor_regex import classify_with_regex
    from processor.processor_bert import classify_with_bert
    from processor.processor_llm import classify_with_llm
except ImportError:
    # When run directly
    from processor_regex import classify_with_regex
    from processor_bert import classify_with_bert
    from processor_llm import classify_with_llm

import pandas as pd

def classify(logs):
    labels = []
    for source, log_msg in logs:
        label = classify_log(source,log_msg)
        labels.append(label)
    return labels


def classify_log(source, log_message):
    if source == "LegacyCRM":
        label = classify_with_llm(log_message)
    else:
        label = classify_with_regex(log_message)
        if not label:
            label = classify_with_bert(log_message)
    return label

def classify_csv(input_file):
    # No need to import pandas again
    df = pd.read_csv(input_file)

    # Perform classification
    df["target_label"] = classify(list(zip(df["source"], df["log_message"])))

    # Save the modified file
    output_file = r"C:\Users\yasiru\Desktop\Log Classification\Sources\output.csv"
    
    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    df.to_csv(output_file, index=False)
    
    # Add confirmation message
    print(f"CSV file created successfully at: {output_file}")
    print(f"File contains {len(df)} classified log entries")
    
    return output_file


if __name__ == "__main__":
    # Fix the path by using raw string or proper escaping
    output_path = classify_csv(r"C:\Users\yasiru\Desktop\Log Classification\Sources\test.csv")
    print(f"Classification process complete!")
    print(f"Output saved to: {output_path}")
    
    # Check if file exists after creation
    if os.path.exists(output_path):
        file_size = os.path.getsize(output_path) / 1024  # Size in KB
        print(f"File verification: SUCCESS (Size: {file_size:.2f} KB)")
    else:
        print("File verification: FAILED - File does not exist")