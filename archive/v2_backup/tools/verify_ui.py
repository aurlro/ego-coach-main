import time
from playwright.sync_api import sync_playwright

def verify_ui():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to home
        page.goto("http://localhost:8080/index.html")
        time.sleep(2) # Wait for initial render and icon refreshment

        # 1. Verify Lucide Icons in Sidebar
        # We check for elements with data-lucide attribute or svg class lucide
        # Since we use lucide.createIcons(), <i> tags become <svg> with class "lucide-icon" or similar
        # But let's check if ANY svg has class "lucide"

        # Take screenshot of Home
        page.screenshot(path="verification_home.png")
        print("Screenshot of Home taken")

        # 2. Verify Quick Analysis (Padding)
        # Navigate to Quick Analysis
        # We can click the link in sidebar
        page.click("a[data-page='analyzer-quick']")
        time.sleep(1)

        # Check if the padding class is applied
        # input section: .quick-input-section.p-6
        input_section = page.query_selector(".quick-input-section.p-6")
        if input_section:
            print("Padding p-6 found on quick-input-section")
        else:
            print("Padding p-6 NOT found on quick-input-section")

        page.screenshot(path="verification_quick.png")
        print("Screenshot of Quick Analysis taken")

        # 3. Trigger a Toast (Notification)
        # We can trigger a toast by trying to run analysis with empty input in quick analyzer
        page.click("#quick-analyze-btn")
        time.sleep(0.5)

        # Check toast container z-index
        toast_root = page.eval_on_selector("#toast-root", "el => window.getComputedStyle(el).zIndex")
        print(f"Toast root z-index: {toast_root}")

        page.screenshot(path="verification_toast.png")
        print("Screenshot of Toast taken")

        browser.close()

if __name__ == "__main__":
    verify_ui()
