import time
from playwright.sync_api import sync_playwright

def verify_ui():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Capture console logs
        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
        page.on("pageerror", lambda exc: print(f"PAGE ERROR: {exc}"))

        try:
            # Navigate to home
            print("Navigating to index.html...")
            page.goto("http://localhost:8000/index.html")
            time.sleep(2) # Wait for initial render

            # 1. Verify Lucide Icons in Sidebar
            page.screenshot(path="verification_home.png")
            print("Screenshot of Home taken")

            # 2. Verify Quick Analysis (Padding)
            print("Clicking Quick Analysis link...")
            page.click("a[data-page='analyzer-quick']")
            time.sleep(1)

            # Check if the padding class is applied
            input_section = page.query_selector(".quick-input-section.p-6")
            if input_section:
                print("Padding p-6 found on quick-input-section")
            else:
                print("Padding p-6 NOT found on quick-input-section")
                # Check if the section exists at all
                section = page.query_selector(".quick-input-section")
                if section:
                    print("Section found but missing p-6 class")
                else:
                    print("Section NOT found")

            page.screenshot(path="verification_quick.png")
            print("Screenshot of Quick Analysis taken")

            # 3. Trigger a Toast (Notification)
            print("Clicking Analyze button...")
            page.click("#quick-analyze-btn")
            time.sleep(0.5)

            # Check toast container z-index
            toast_root = page.eval_on_selector("#toast-root", "el => window.getComputedStyle(el).zIndex")
            print(f"Toast root z-index: {toast_root}")

            page.screenshot(path="verification_toast.png")
            print("Screenshot of Toast taken")

        except Exception as e:
            print(f"TEST FAILED: {e}")
            page.screenshot(path="verification_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_ui()
