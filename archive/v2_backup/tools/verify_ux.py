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

        # Click analyze and capture screenshot immediately to see loading state
        # We mock the API call by ensuring it takes a bit of time or just capturing quickly
        # Since we don't control API speed, we can inspect the DOM modification directly
        # But visually, we want to see the spinner.

        page.click("#quick-analyze-btn")
        time.sleep(0.1) # Short wait to allow DOM update

        page.screenshot(path="verification_loading.png")
        print("Screenshot of Loading State taken")

        # Verify spinner exists in DOM
        spinner = page.query_selector(".animate-spin")
        if spinner:
            print("Spinner found in DOM")
        else:
            print("Spinner NOT found in DOM")

        # 2. Verify Modal Dark Mode
        # Open notifications modal
        page.click("button[title='Notifications']")
        time.sleep(1)

        # Take screenshot of modal
        page.screenshot(path="verification_modal.png")
        print("Screenshot of Modal taken")

        # Check if dark mode toggle works and affects modal
        # Enable dark mode if not enabled (it is enabled by default in index.html script)
        # Let's just check the modal class and computed style
        modal_panel = page.query_selector(".modal-panel")
        if modal_panel:
            bg_color = page.eval_on_selector(".modal-panel", "el => window.getComputedStyle(el).backgroundColor")
            print(f"Modal background color: {bg_color}")
            # In dark mode (slate-950 is #020617, slate-900 is #0f172a)
            # rgb(15, 23, 42) matches slate-900

        browser.close()

if __name__ == "__main__":
    verify_ux()
