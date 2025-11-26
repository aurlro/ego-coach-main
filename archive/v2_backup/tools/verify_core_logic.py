import pytest
from playwright.sync_api import sync_playwright, expect
import json
import os

BASE_URL = os.environ.get("BASE_URL", "http://localhost:8081")

class TestCoreLogic:
    @pytest.fixture(scope="class")
    def page(self):
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()
            page.goto(f"{BASE_URL}/index.html")
            yield page
            browser.close()

    def test_run_local_heuristics(self, page):
        """Test the local heuristic analysis logic."""

        # Test High Tension
        result = page.evaluate("""
            runLocalHeuristics("Tu ne fais jamais rien ! Pourquoi c'est toujours moi ?")
        """)
        assert "Chaleur élevée" in result["meta"]
        assert len(result["takeaways"]) == 3
        assert len(result["options"]) == 3

        # Test Boundaries Need
        result = page.evaluate("""
            runLocalHeuristics("Je veux que tu arrêtes de me parler comme ça. Stop.")
        """)
        assert any("limite" in opt["objective"].lower() for opt in result["options"])

        # Test Low Tension / Validation Need
        result = page.evaluate("""
            runLocalHeuristics("J'ai besoin que tu m'écoutes, merci.")
        """)
        assert "Tension faible" in result["meta"] or "Tension modérée" in result["meta"]
        assert any("validation" in t.lower() for t in result["takeaways"])

    def test_calculate_journal_stats(self, page):
        """Test the journal statistics calculation."""

        stats = page.evaluate("""
            calculateJournalStats([
                { egoFocus: "La Défensive", createdAt: new Date().toISOString() },
                { egoFocus: "La Défensive", createdAt: new Date(Date.now() - 86400000).toISOString() },
                { egoFocus: "Le Sauveur", createdAt: new Date().toISOString() }
            ])
        """)

        assert stats["totalEntries"] == 3
        assert stats["topEgo"] == "La Défensive"
        assert stats["daysSinceDefensive"] == 0

    def test_format_relative_time(self, page):
        """Test date formatting helpers."""

        results = page.evaluate("""
            [
                formatRelativeTime(new Date()),
                formatRelativeTime(new Date(Date.now() - 86400000)),
                formatRelativeTime(new Date(Date.now() - 86400000 * 5))
            ]
        """)

        assert results[0] == "Aujourd'hui"
        assert results[1] == "Hier"
        assert "Il y a 5 jours" in results[2]

    def test_data_store_persistence(self, page):
        """Test that data store correctly saves and retrieves data."""

        # We can test via window.app.dataStore
        page.evaluate("""
            window.app.dataStore.saveData('test-key', { foo: 'bar' });
        """)

        data = page.evaluate("""
            window.app.dataStore.getData('test-key')
        """)

        assert data["foo"] == "bar"

        # Test namespacing (default user is 'default')
        # LocalStorage key should be 'ego-coach-data::default::test-key'
        ls_content = page.evaluate("""
            localStorage.getItem('ego-coach-data::default::test-key')
        """)

        assert ls_content is not None
        parsed = json.loads(ls_content)
        assert parsed["foo"] == "bar"

if __name__ == "__main__":
    pass
