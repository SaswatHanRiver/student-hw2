# Design and design check (Step 2, Part A)

## The design
I designed the screen myself (no Figma frame was given for the homework).
The spec below is the design; `screenshots/filled/filled-1920.png` and
`screenshots/filled/filled-375.png` are the reference renders.

- Container: max width 1280px, centred, same on every page.
- One font family (system UI stack). Sizes: h1 28 / section 20 / body 16 / table 14 / caption 12.
- Spacing scale: 4, 8, 12, 16, 24, 32, 40, 48.
- Colours (light / dark pairs, WM names): navy-b1 headings, grey-b1..b4 text and surfaces,
  blue-b1/b2 primary, green / amber / violet for status tags, red-b1/b2 for errors and low attendance.
- Attendance: % + small bar. Green at 90%+, amber 75-89%, red below 75%.
- Buttons get their width from padding. Inputs are 40px tall (44px on phones).

## WM checklist results
| # | Check | Result |
|---|---|---|
| 1 | Container size the same on all pages | Yes: 1280 max, one page so far |
| 2 | Same spacing for the same element | Yes: all spacing from the scale |
| 3 | Repeated parts look the same | Yes: state block, tag, pagination are shared components |
| 4 | One font family, clear sizes | Yes |
| 5 | Long text on small screens | Long names/emails wrap inside the card at 768 and below (tested with a 31-character name) |
| 6 | Font and colour library from the designer | Defined in `_variables.scss` / `_theme.scss` |
| 7 | Empty / loading / no image states designed | Empty, no results, loading, error designed. No images on this screen |
| 8 | Button width from padding | Yes |
| 9 | Images fit their box | No images; `img, svg { max-width: 100% }` in reset |
| 10 | Browser support | Asked below |

## Questions I would send to a designer / PM
1. Is a 10-row page right, or should staff be able to pick 10 / 25 / 50?
2. Should search also match guardian name or phone number?
3. Attendance colour thresholds (90 / 75): are these the school's real rules?
4. At 768px and below the table becomes cards. Is that OK, or do you want a sideways-scrolling table?
5. Should "Graduated" students be hidden by default?
6. Is there a sort order requirement (by name, by student ID, newest first)?
7. Which browsers must be supported (Chrome only, or Safari / iOS too)?
8. Dark mode follows the system setting. Do you also want a manual toggle?
9. Date format: WM allows "May 1, 2016" or YYYY-MM-DD. I used "May 1, 2016". Confirm?
