# 🧪 TEST GUIDE: AI Provider Test Button

**Date:** 2025-11-18
**Status:** ✅ READY FOR TESTING
**Server:** http://localhost:8080
**Ollama:** http://localhost:11434

---

## 🚀 Quick Start

### Prerequisites
- ✅ Python HTTP server running on port 8080
- ✅ Ollama service running on port 11434
- ✅ Browser (Chrome, Firefox, Safari)

### Available Models in Ollama
- `llama3:8b` (4.6 GB)
- `llama3:latest` (same as 8b)

---

## 📝 Test Scenarios

### Scenario 1: Test Heuristic (Local Analysis) ⚡
**Expected:** Always works (no external dependencies)

1. Open http://localhost:8080
2. Navigate to "Analyse IA" module
3. Ensure "🔍 Analyse locale (gratuit)" is selected
4. Click "🧪 Tester" button
5. Wait for response

**Expected Result:**
- Button shows: "⏳ Test en cours..."
- Toast shows: ✅ "Analyse locale (heuristique) fonctionne."
- Button returns to: "🧪 Tester"

---

### Scenario 2: Test Ollama ✅
**Expected:** Success (Ollama is running)

1. From AI Module, select "🤖 Ollama (LLM local)" from dropdown
2. Click "🧪 Tester" button
3. Wait for Ollama to respond

**Expected Result:**
- Button shows: "⏳ Test en cours..."
- Toast shows: ✅ "Ollama fonctionne ! Modèle: llama3:8b"
- Button returns to: "🧪 Tester"

---

### Scenario 3: Test Gemini (Without API Key) ❌
**Expected:** Error - Not configured

1. From AI Module, select "✨ Gemini API" from dropdown
2. Click "🧪 Tester" button

**Expected Result:**
- Toast shows: ❌ "Gemini non configuré. Configure-le d'abord."
- Button returns to: "🧪 Tester"
- User guidance: Configure Gemini API key

---

### Scenario 4: Test Gemini (With Invalid API Key) ❌
**Expected:** Error - Invalid key

1. Click ⚙️ "Config Gemini" button
2. Enter an invalid/fake API key (e.g., "AIza_INVALID_KEY_12345")
3. Click "Enregistrer la clé"
4. Click "🧪 Tester" button

**Expected Result:**
- Button shows: "⏳ Test en cours..."
- Toast shows: ❌ "Clé API invalide. Vérifie ta clé dans les paramètres."
- Button returns to: "🧪 Tester"
- User guidance: Check and update API key

---

### Scenario 5: Test Ollama (Simulate Offline) 🔌
**Expected:** Error - Connection failed

1. Stop Ollama service: `pkill -f "ollama serve"`
2. From AI Module, select "🤖 Ollama (LLM local)"
3. Click "🧪 Tester" button
4. Wait for timeout

**Expected Result:**
- Button shows: "⏳ Test en cours..."
- Toast shows: ❌ "Ollama ne répond pas sur http://localhost:11434. Lance Ollama en local."
- Button returns to: "🧪 Tester"
- User guidance: Start Ollama service

---

### Scenario 6: Test Button Multiple Times ⚡
**Expected:** Button works repeatedly

1. Click "🧪 Tester" for Heuristic
2. Wait for response
3. Click "🧪 Tester" again immediately
4. Click "🧪 Tester" again while in progress

**Expected Result:**
- First click works normally
- Subsequent clicks work normally
- Button properly re-enabled each time
- No duplicate requests

---

## 🎯 What to Verify

### UI/UX
- [ ] Button is visible in AI Module header
- [ ] Button appears next to config buttons
- [ ] Button has "🧪 Tester" text
- [ ] Button is styled consistently (secondary-button)
- [ ] Button disables during test
- [ ] Button text changes to "⏳ Test en cours..."
- [ ] Button re-enables after test
- [ ] Button text returns to "🧪 Tester"

### Functionality
- [ ] Heuristic test always works
- [ ] Ollama test works when server running
- [ ] Ollama test fails with clear message when offline
- [ ] Gemini test fails when not configured
- [ ] Gemini test fails with clear message for invalid key
- [ ] Toast notifications appear (success and error)
- [ ] Messages are specific to error type
- [ ] User guidance is actionable

### Error Messages
- [ ] ✅ Success: "Analyse locale fonctionne."
- [ ] ✅ Success: "Ollama fonctionne ! Modèle: ..."
- [ ] ✅ Success: "Gemini fonctionne ! Prêt à l'utiliser."
- [ ] ❌ Error: "Gemini non configuré"
- [ ] ❌ Error: "Clé API invalide"
- [ ] ❌ Error: "Ollama ne répond pas sur ..."
- [ ] ❌ Error: "Pas de connexion Internet"

### Performance
- [ ] Test responds within 10 seconds
- [ ] No page freezing during test
- [ ] No console errors (F12 developer tools)
- [ ] Button state properly restored

---

## 📊 Test Matrix

| Provider | Configured | Status | Expected | Actual | Pass |
|----------|-----------|--------|----------|--------|------|
| Heuristic | N/A | Always works | ✅ | [ ] | [ ] |
| Ollama | Yes (running) | OK | ✅ | [ ] | [ ] |
| Ollama | No (offline) | Error | ❌ | [ ] | [ ] |
| Gemini | No | Error | ❌ | [ ] | [ ] |
| Gemini | Yes (invalid) | Error | ❌ | [ ] | [ ] |
| Gemini | Yes (valid) | OK | ✅ | [ ] | [ ] |

---

## 🔍 Developer Console Check (F12)

Open Developer Tools and look for:

✅ **Should see:**
- Normal fetch requests to API endpoints
- Success/error responses in Network tab
- Toast messages in Console (info/success/error)

❌ **Should NOT see:**
- JavaScript errors
- Failed fetch requests (except intentional errors)
- Sensitive data (API keys) in console logs
- CORS errors
- Network timeouts (except when testing offline)

---

## 🎬 Complete Test Flow

```
1. Open http://localhost:8080
   ↓
2. Navigate to "Analyse IA"
   ↓
3. Test Heuristic (should work)
   ↓
4. Switch to Ollama, Test (should work)
   ↓
5. Switch to Gemini (not configured)
   ↓
6. Click Test Gemini (should fail with "non configuré")
   ↓
7. Configure invalid Gemini key
   ↓
8. Click Test Gemini (should fail with "clé invalide")
   ↓
9. Stop Ollama service
   ↓
10. Switch to Ollama, Click Test (should fail with "ne répond pas")
   ↓
11. Start Ollama service again
   ↓
12. Switch to Ollama, Click Test (should work again)
   ↓
✅ ALL TESTS COMPLETE
```

---

## 📝 Test Notes

Use this section to record your testing:

### Heuristic Test
- Time tested: _______________
- Result: ✅ / ❌
- Message: _____________________
- Notes: _________________________

### Ollama Test (Online)
- Time tested: _______________
- Result: ✅ / ❌
- Message: _____________________
- Notes: _________________________

### Ollama Test (Offline)
- Time tested: _______________
- Result: ✅ / ❌
- Message: _____________________
- Notes: _________________________

### Gemini Test (Not Configured)
- Time tested: _______________
- Result: ✅ / ❌
- Message: _____________________
- Notes: _________________________

### Gemini Test (Invalid Key)
- Time tested: _______________
- Result: ✅ / ❌
- Message: _____________________
- Notes: _________________________

---

## ✅ Sign-Off

When all tests pass:

```
Tested by: ____________________
Date: ____________________
All tests passed: [ ]
Issues found: [ ] (describe below)

Issues:
_________________________________
_________________________________

Approved for deployment: [ ] YES [ ] NO
```

---

## 🆘 Troubleshooting

### Button doesn't appear
- [ ] Refresh page
- [ ] Check browser console for errors
- [ ] Make sure AI Module loads

### Test hangs (stays at "⏳ Test en cours...")
- [ ] Check internet connection
- [ ] Check if API endpoints are responding
- [ ] Open browser console (F12) to see errors
- [ ] Try different provider

### Toast doesn't appear
- [ ] Check browser console
- [ ] Verify toast container exists in DOM
- [ ] Try different provider

### Button doesn't re-enable
- [ ] Close and reopen browser
- [ ] Refresh page
- [ ] Check console for errors

### Ollama test fails even though server running
- [ ] Check Ollama is listening on port 11434: `curl http://localhost:11434/api/tags`
- [ ] Check Ollama has models: `ollama list`
- [ ] Restart Ollama: `pkill -f "ollama serve" && ollama serve`

---

## 📞 Support

If you encounter issues:
1. Check browser console (F12) for errors
2. Check Ollama logs: `cat /tmp/ollama.log`
3. Verify services are running:
   - Web server: `curl http://localhost:8080`
   - Ollama: `curl http://localhost:11434/api/tags`
4. Review FEATURE_AI_PROVIDER_TEST.md for implementation details

---

*Test Guide Created: 2025-11-18*
*Ready for testing*
