import time
from playwright.sync_api import sync_playwright

def verify_ux():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to home
        page.goto("http://localhost:8080/index.html")
        time.sleep(2)

        # 1. Verify Loading State on Quick Analyzer
        page.click("a[data-page='analyzer-quick']")
        time.sleep(1)

        # Type something
        page.fill("#quick-input", "Test message")

        page.click("#quick-analyze-btn")
        time.sleep(0.1) # Short wait to allow DOM update

        page.screenshot(path="verification_loading_retry.png")
        print("Screenshot of Loading State taken")

        # Verify spinner exists in DOM (check class animate-spin on ANY element)
        spinner = page.query_selector(".animate-spin")
        if spinner:
            print("Spinner found in DOM")
        else:
            print("Spinner NOT found in DOM")

        browser.close()

if __name__ == "__main__":
    verify_ux()
