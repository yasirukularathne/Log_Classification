from dotenv import load_dotenv
from groq import Groq
import re
load_dotenv()

groq = Groq()

def classify_with_llm(log_msg):
    
    prompt = f'''Classify the log message into one of these categories: 
    (1) Workflow Error, (2) Deprecation Warning.
    If you can't figure out a category, use "Unclassified".
    Put the category inside <category> </category> tags. 
    Log message: {log_msg}'''

    chat_completion = groq.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.3-70b-versatile",
        temperature=0.5
    )
    
    # Extract the response content
    response_text = chat_completion.choices[0].message.content
    
    # Extract the category from the response
    category_match = re.search(r'<category>(.*?)</category>', response_text, re.DOTALL)
    if category_match:
        return category_match.group(1).strip()
    else:
        # Fallback if no tags found
        return "Unclassified"

if __name__ == "__main__":
    print(classify_with_llm(
        "Case escalation for ticket ID 7324 failed because the assigned support agent is no longer active."))
    print(classify_with_llm(
        "The 'ReportGenerator' module will be retired in version 4.0. Please migrate to the 'AdvancedAnalyticsSuite' by Dec 2025"))
    print(classify_with_llm("System reboot initiated by user 12345."))