import pytest
from playwright.sync_api import sync_playwright, expect
import time
import os

BASE_URL = os.environ.get("BASE_URL", "http://localhost:8081")

class TestFlows:
    @pytest.fixture(scope="class")
    def page(self):
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context()
            page = context.new_page()
            page.goto(f"{BASE_URL}/index.html")
            yield page
            browser.close()

    def test_navigation(self, page):
        """Test that all sidebar links navigate to the correct sections."""

        # Helper to check visibility
        def check_section_visible(section_id):
            expect(page.locator(f"#{section_id}")).to_be_visible()

        # Home is default
        check_section_visible("page-home")

        # Click Journal
        page.click("a[data-page='journal']")
        check_section_visible("page-journal")

        # Click Manual Analysis
        page.click("a[data-page='analyzer-manual']")
        check_section_visible("page-analyzer-manual")

        # Click Quick Analysis
        page.click("a[data-page='analyzer-quick']")
        check_section_visible("page-analyzer-quick")

        # Click AI Analysis
        page.click("a[data-page='analyzer-ai']")
        check_section_visible("page-analyzer-ai")

        # Click Guide
        page.click("a[data-page='guide']")
        check_section_visible("page-guide")

        # Return to home
        page.click("a[data-page='home']")
        check_section_visible("page-home")

    def test_quick_analysis_flow(self, page):
        """Test the quick analysis flow."""
        page.click("a[data-page='analyzer-quick']")

        # Fill input
        page.fill("#quick-input", "Mon collègue m'a coupé la parole.")

        # Click analyze
        page.click("#quick-analyze-btn")

        # Wait for results (should be fast as it falls back to heuristic if AI not configured)
        expect(page.locator("#quick-results")).to_be_visible()
        expect(page.locator("#quick-results")).to_contain_text("Insights clés")

        # Attempt to copy
        page.click("#quick-copy-btn")

        # In headless, copy might fail or succeed. We just want to ensure A toast appears (error or success)
        # The class is 'toast toast-success' or 'toast toast-error'
        # We look for any element with class 'toast'
        expect(page.locator(".toast")).to_be_visible()

    def test_manual_journal_flow(self, page):
        """Test creating a manual entry, saving it, seeing it in journal, and deleting it."""

        # 1. Navigate to Manual Analysis
        page.click("a[data-page='analyzer-manual']")

        # 2. Fill Step 1
        page.fill("textarea[name='context']", "Dispute about dishes.")
        page.fill("textarea[name='partnerSignal']", "Sighing loudly.")
        page.click("button[data-action='next']")

        # 3. Fill Step 2
        page.select_option("select[name='egoFocus']", "Le Martyr")
        page.fill("textarea[name='triggerNeed']", "Recognition.")
        page.click("button[data-action='next']")

        # 4. Fill Step 3
        page.fill("textarea[name='alternativeResponse']", "I can do dishes later.")
        page.fill("textarea[name='validation']", "I hear you are tired.")
        page.click("button[data-action='next']")

        # 5. Fill Step 4
        page.fill("textarea[name='actionPlan']", "Make a schedule.")
        page.click("button[data-action='save']")

        # 6. Verify Toast and Redirection
        expect(page.locator(".toast-success")).to_be_visible()

        # 7. Go to Journal
        page.click("a[data-page='journal']")

        # 8. Verify Entry is present
        expect(page.locator("text=Dispute about dishes")).to_be_visible()
        expect(page.locator("span[data-ego='Le Martyr']")).to_be_visible()

        # 9. Delete Entry
        # Handle confirm dialog
        page.on("dialog", lambda dialog: dialog.accept())
        page.click("button[data-action='delete']")

        # 10. Verify deletion
        expect(page.locator("text=Dispute about dishes")).not_to_be_visible()

if __name__ == "__main__":
    pass
