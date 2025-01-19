import re


# Function to format the soap notes into json
def format_soap_note(soap_text):
    sections = {
        "subjective": "",
        "objective": "",
        "assessment": "",
        "plan": ""
    }
    patterns = {
        "subjective": r"subjective(.*?)objective",
        "objective": r"objective(.*?)assessment",
        "assessment": r"assessment(.*?)plan",
        "plan": r"plan(.*)"
    }
    for section, pattern in patterns.items():
        match = re.search(pattern, soap_text,
                          re.IGNORECASE | re.DOTALL)
        if match:
            section_text = match.group(1).strip()
            # Assign the formatted section text
            sections[section] = section_text

    return sections
