# 🧪 TEST GUIDE: Header Search & Notifications Buttons

**Date:** 2025-11-18
**Status:** ✅ READY FOR TESTING
**Server:** http://localhost:8080
**Commit:** 19d630e

---

## 🚀 Quick Start

### Prerequisites
- ✅ Python HTTP server running on port 8080
- ✅ Browser (Chrome, Firefox, Safari)

### Available Services
- **Web Server:** http://localhost:8080 (running)
- **Ollama:** http://localhost:11434 (running)

---

## 📝 Test Scenarios

### Scenario 1: Test Search Button (🔍)

**Expected:** Opens Command Palette with list of commands

1. Open http://localhost:8080
2. Look at page header (right side of breadcrumb)
3. Click the 🔍 search icon button

**Expected Result:**
- Command Palette overlay appears
- Shows search input field with placeholder text
- Displays list of available commands
- Button provides immediate visual feedback

**Verification Checklist:**
- [ ] Command Palette opens
- [ ] Search input is focused
- [ ] Command list is visible
- [ ] Can type to filter commands
- [ ] ⌘K shortcut still works
- [ ] ESC key closes palette

---

### Scenario 2: Test Notifications Button (🔔)

**Expected:** Shows notification count in toast message

1. From home page header
2. Locate the 🔔 bell icon button (right of search)
3. Click the notifications button

**Expected Result:**
- Toast notification appears at top-right
- Shows "🔔 Vous avez 2 notifications." (if badge shows 2)
- Toast disappears after 3-5 seconds
- Button provides immediate visual feedback

**Verification Checklist:**
- [ ] Toast message appears
- [ ] Message shows correct count
- [ ] Message includes bell emoji
- [ ] Proper pluralization (notification vs notifications)
- [ ] Toast auto-dismisses
- [ ] Multiple clicks work

---

### Scenario 3: Test Notifications Button (No Notifications)

**Expected:** Shows "no notifications" message

1. Modify badge count (if possible via DevTools)
2. Set badge text to "0"
3. Click notifications button

**Expected Result:**
- Toast shows: "📬 Aucune notification pour le moment."
- Different emoji (mailbox) to indicate empty state
- Button remains functional

**Verification Checklist:**
- [ ] Empty state message displays
- [ ] Correct emoji shown
- [ ] Message is different from notification count message
- [ ] Toast appears normally

---

### Scenario 4: Test Command Palette Search

**Expected:** Commands filter as you type

1. Open Command Palette (click 🔍 or press ⌘K)
2. Type "Tableau" in search box
3. Observe results filter

**Expected Result:**
- List narrows to commands matching "Tableau"
- "Tableau de bord" command appears
- Clear filtering happens in real-time

**Verification Checklist:**
- [ ] Search filters commands
- [ ] Relevant results shown
- [ ] Can click to navigate
- [ ] Keyboard navigation works (↑↓ Enter)

---

### Scenario 5: Test Command Execution

**Expected:** Clicking command navigates and closes palette

1. Open Command Palette
2. Search for "Analyse"
3. Click "Analyse Rapide" command

**Expected Result:**
- Command Palette closes
- Page navigates to "Analyse Rapide"
- Breadcrumb updates
- New page renders

**Verification Checklist:**
- [ ] Command executes
- [ ] Palette closes
- [ ] Navigation works
- [ ] No console errors

---

### Scenario 6: Test Multiple Clicks

**Expected:** Buttons work repeatedly

1. Click 🔍 button, close palette (ESC)
2. Click 🔍 button again
3. Repeat notifications button clicks

**Expected Result:**
- Buttons work each time
- No duplicate events
- State properly resets
- No memory leaks

**Verification Checklist:**
- [ ] First click works
- [ ] Second click works
- [ ] Multiple clicks succeed
- [ ] No lag or slowdown

---

## 🎯 What to Verify

### Search Button
- [ ] Button exists in page header (top right)
- [ ] Has magnifying glass icon
- [ ] Has title/tooltip "Rechercher (⌘K)"
- [ ] Opens Command Palette when clicked
- [ ] Command Palette closes with ESC
- [ ] Search functionality works
- [ ] Commands are executable

### Notifications Button
- [ ] Button exists next to search button
- [ ] Has bell icon with notification badge
- [ ] Badge shows notification count (currently "2")
- [ ] Shows toast on click
- [ ] Toast message is correct
- [ ] Toast includes count or "no notifications" message
- [ ] Works repeatedly

### Toast Messages
- [ ] Appears at top-right of screen
- [ ] Shows for 3-5 seconds
- [ ] Auto-dismisses
- [ ] Includes appropriate emoji
- [ ] Text is clear and readable

---

## 🔍 Developer Console Check (F12)

Open Developer Tools and look for:

✅ **Should see:**
- Normal click events in Events tab
- No JavaScript errors in Console
- Normal toast messages in Console logs
- Command Palette elements in DOM

❌ **Should NOT see:**
- JavaScript errors or exceptions
- Failed event listeners
- Undefined functions
- Memory warnings

---

## 📊 Test Matrix

| Component | Test | Expected | Actual | Pass |
|-----------|------|----------|--------|------|
| Search Button | Click opens palette | ✅ Palette opens | [ ] | [ ] |
| Search Button | Types filter commands | ✅ Commands filter | [ ] | [ ] |
| Search Button | Execute navigates | ✅ Page loads | [ ] | [ ] |
| Notifications Button | Shows count | ✅ Toast appears | [ ] | [ ] |
| Notifications Button | No notifications | ✅ Empty message | [ ] | [ ] |
| Notifications Button | Multiple clicks | ✅ All work | [ ] | [ ] |
| Toast | Visual feedback | ✅ Visible & timed | [ ] | [ ] |

---

## 🎬 Complete Test Flow

```
1. Open http://localhost:8080
   ↓
2. Verify page header exists
   ↓
3. Test Search Button (🔍)
   - Click button
   - Verify palette opens
   - Search for "Tableau"
   - Verify results filter
   - Press ESC to close
   ↓
4. Test Notifications Button (🔔)
   - Click button
   - Verify toast appears
   - Check message shows "2 notifications"
   - Wait for auto-dismiss
   ↓
5. Test Search Again
   - Click search button
   - Execute a command
   - Verify navigation works
   - Verify palette closed
   ↓
6. Test Notifications Again
   - Click notification button
   - Verify toast shows
   - Multiple times
   ↓
✅ ALL TESTS COMPLETE
```

---

## 📝 Test Notes

Use this section to record your testing:

### Search Button Test
- Time tested: _______________
- Result: ✅ / ❌
- Notes: _________________________

### Notifications Button Test (With Notifications)
- Time tested: _______________
- Result: ✅ / ❌
- Notes: _________________________

### Notifications Button Test (Empty)
- Time tested: _______________
- Result: ✅ / ❌
- Notes: _________________________

### Command Execution Test
- Time tested: _______________
- Result: ✅ / ❌
- Notes: _________________________

---

## ✅ Sign-Off

When all tests pass:

```
Tested by: ____________________
Date: ____________________
All tests passed: [ ] YES [ ] NO
Issues found: [ ] (describe below)

Issues:
_________________________________
_________________________________

Approved for deployment: [ ] YES [ ] NO
```

---

## 🆘 Troubleshooting

### Search button doesn't open palette
- [ ] Refresh page
- [ ] Check browser console for errors
- [ ] Make sure Command Palette script loaded
- [ ] Try ⌘K keyboard shortcut instead

### Notifications toast doesn't appear
- [ ] Check browser console (F12)
- [ ] Verify toast container exists in DOM
- [ ] Check for console errors
- [ ] Try clicking search button first (to verify toast works)

### Buttons don't respond
- [ ] Hard refresh browser (Cmd+Shift+R)
- [ ] Clear browser cache
- [ ] Check Network tab for failed script loads
- [ ] Open browser console for JavaScript errors

### Commands don't work from palette
- [ ] Check that navigation works elsewhere
- [ ] Verify Command Palette loaded
- [ ] Try keyboard navigation (↑↓ Enter)
- [ ] Check console for errors

---

## 📞 Support

If you encounter issues:
1. Check browser console (F12) for errors
2. Verify services are running:
   - Web server: `curl http://localhost:8080`
   - Ollama: `curl http://localhost:11434/api/tags`
3. Review implementation in `assets/js/app.js` (lines 120-142)
4. Check Command Palette module: `assets/js/modules/commandPalette.js`

---

## ✨ Summary

This test guide verifies that:
- ✅ Search button opens Command Palette
- ✅ Notifications button shows feedback
- ✅ Both provide immediate user feedback
- ✅ No console errors
- ✅ Ready for production deployment

*Test Guide Created: 2025-11-18*
*Implementation: 19d630e*
*Ready for testing*

