# Design review — design vs build (HW2)

Design (Claude Design canvas): https://claude.ai/artifact/3HLonsdTHPwZ5hQEYgkmis (shared with Divii)

| Folder | What |
|---|---|
| `frames/` | PNG export of every design frame: list (1440, 768, 375), list empty (1440, 375), list loading (1440, 375), create, details, edit (1440, 768, 375) |
| `build/` | The built screens at the same sizes and states |
| `compare/` | Side by side: **design on the left, build on the right**, one image per screen and width |

## Where the build differs from the design, and why
1. **List at 768: design shows the table, build shows cards.** At 768 the six table columns get squeezed: "Grade 8", dates and Student IDs break across lines (see `compare/list-768.png`). The build switches to cards from 768 down so nothing wraps mid-word. This was the problem found in HW1.
2. **List at 375: design puts Grade and Status side by side; build stacks every filter.** At 375 the selects use a 16px font (stops iOS zooming into the field), and "All statuses" doesn't fit in half the width. Full-width fields also give 44px-tall tap targets.
3. **List at 375: design hides Reset; build shows it.** Reset is the only way to clear filters in one tap on a phone, so it stays visible.
4. **List cards at 375: design puts the status tag in the card's top row; build shows Status as its own labelled row.** The build turns each table row into a card with CSS only (each cell shows its label from `data-label`), so the same HTML works for desktop and phone. Moving one cell to the top row would need a second copy of it.
5. **List at 375: design shows 4 cards, build shows 10.** Both show one page of 10; the design frame is cut at 4 to keep it short.
6. **Loading state: same in both** (skeleton rows, count badge hidden). **Empty state: same** ("No students yet" + Add student).
7. **Create / edit / details: same layout.** Small differences: the date field shows the browser's own date picker, and the select arrows are the browser's own. Both depend on the browser and can't be styled the same everywhere.
