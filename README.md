# TeamPulse – Bug Hunt Assignment

## 📌 Overview

This project was completed as part of the Aspora Frontend Intern assignment.  
The objective was to identify and fix bugs across the application and implement the "Search Comments" feature from scratch.

## Search comments

🔍 Search Comments Feature (Built from Scratch)

The "Search Comments" feature was fully implemented using the JSONPlaceholder API:

https://jsonplaceholder.typicode.com/comments

✅ Implementation Details

Fetches 500 comments on overlay open

Uses AbortController to prevent stale state updates

Implements 300ms debounced search (custom implementation using setTimeout)

Performs client-side filtering on the body field

Highlights matching query text without using dangerouslySetInnerHTML

Supports full keyboard navigation:

Arrow Up / Arrow Down (with wrap-around)

Enter to expand a result

Escape to close overlay

Handles loading and error states properly

Fully responsive (tested from 360px to desktop widths)

---

## 🐞 Bug Fix Highlight

### Header – Infinite Re-render Issue

**Problem:**  
The application was crashing on load with the error:
"Too many re-renders. React limits the number of renders to prevent an infinite loop."

**Root Cause:**  
The `setGreeting()` state update was being called directly inside the component body.  
Since state updates trigger re-renders, this created an infinite render loop.

**Fix:**  
Moved the greeting computation inside a `useEffect` with an empty dependency array:

```tsx
useEffect(() => {
  setGreeting(computeGreeting());
}, []);

## 🐞 Sidebar Radio Selection Delay Fix

### Issue
When selecting a status filter (Active, On Leave, Offline), the radio button did not visually update immediately.  
Although filtering logic worked correctly, the radio selection UI appeared delayed.

### Root Cause
The radio inputs were fully controlled using:

```tsx
checked={filters.status === s.value}

defaultChecked={filters.status === s.value}