import os


def integration_test_config():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    faq_data = os.path.join(base_dir, "data", "faqs.json")
    return {"FAQ_DATA_PATH": faq_data}
