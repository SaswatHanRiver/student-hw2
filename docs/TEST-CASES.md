# Test cases — Students feature (WM QA Template style)

Format follows WM | QA Template: each case starts with **"Verify that…"** and is marked Positive or Negative.
Columns follow the training: ID, precondition, steps, expected result.
**Auto** = covered by a Playwright test (file › test name). Roles: **not applicable**, since this app has no login.

Common precondition (P0): API running with the seed data (24 students); frontend open at `/students/list`.

## 1. Page opens
| ID | Scenario | Type | Precondition | Steps | Expected result | Auto |
|---|---|---|---|---|---|---|
| TC-01 | Verify that the list page opens with title and rows | Positive | P0 | Open `/students/list` | Tab title "Students \| Riverside Academy Admin", heading "Students", "24 enrolled", 10 rows, "Showing 1-10 of 24" | students › opens with title… |
| TC-02 | Verify that `/` sends the user to the list | Positive | P0 | Open `/` | URL becomes `/students/list` | — |
| TC-03 | Verify that dates use the WM format | Positive | P0 | Look at "Joined on" | Dates look like "April 2, 2024" (no leading zero) | students › dates use the WM format |
| TC-04 | Verify that the details page opens from the list | Positive | P0 | Click a student's name | Details page with the name as heading and all fields | students › clicking a name… |

## 2. Main flow
| ID | Scenario | Type | Precondition | Steps | Expected result | Auto |
|---|---|---|---|---|---|---|
| TC-05 | Verify that a new student can be added | Positive | P0 | Add student, fill all fields with valid values, click Add student | Toast "<name> was added.", back on the list, count +1 | mutation › create… |
| TC-06 | Verify that the new student shows in the list | Positive | TC-05 done | Search the new student ID | One row with the new values | mutation › create… |
| TC-07 | Verify that the edit form is filled with saved values | Positive | TC-05 done | Open the student, click Edit | Every field shows the saved value | mutation › create… |
| TC-08 | Verify that an edit is saved and shows in the list | Positive | TC-07 | Change name and attendance, Save changes | Toast "Changes to <name> were saved.", list shows the new name and % | mutation › create… |
| TC-09 | Verify that delete asks for confirmation | Positive | P0 | Details, click Delete | Dialog "Delete <name>?" with Cancel and Delete student | mutation › create… |
| TC-10 | Verify that Cancel in the dialog keeps the student | Negative | TC-09 | Click Cancel (or press Esc) | Dialog closes, student still there | — |
| TC-11 | Verify that a deleted student is gone | Positive | TC-09 | Click Delete student | Toast "<name> was deleted.", back on the list, search finds nothing | mutation › create… |
| TC-12 | Verify that Cancel on the form saves nothing | Negative | P0 | Add student, type a name, click Cancel | Back on the list, nothing added | students › Cancel goes back… |

## 3. Validation (rules match the backend `StudentRequest`)
| ID | Scenario | Type | Precondition | Steps | Expected result | Auto |
|---|---|---|---|---|---|---|
| TC-13 | Verify that an empty form can't be submitted | Negative | Create page | Click Add student with nothing filled | Required message under every field, focus on Student ID, no request sent | students › empty submit… |
| TC-14 | Verify that a wrong student ID format is rejected | Negative | Create page | Student ID "S-1" | "Student ID must look like STU-2026-001." | students › wrong formats… |
| TC-15 | Verify that a too-short or too-long name is rejected | Negative | Create page | Name "A", then a 51-character name | "Name must be 2 to 50 characters." | students › wrong formats… |
| TC-16 | Verify that an invalid email is rejected | Negative | Create page | Email "not-an-email" | "Enter a valid email address, like name@example.com." | students › wrong formats… |
| TC-17 | Verify that attendance outside 0 to 100 is rejected | Negative | Create page | Attendance "101", then "-1", then "8.5" | "Attendance must be between 0 and 100." | students › wrong formats… |
| TC-18 | Verify that a future joined-on date is rejected | Negative | Create page | Type tomorrow's date | "Joined on date can't be in the future." | — |
| TC-19 | Verify that fixing a field clears its message | Positive | TC-13 | Type a valid name | Name message disappears | students › fixing a field… |
| TC-20 | Verify that a duplicate email from the server shows on the field | Negative | P0 | Create with email ananya.ghosh@example.com | Banner + message under Email "This email is already used by another student.", typed values kept | mutation › duplicate email… |
| TC-21 | Verify that a duplicate student ID from the server shows on the field | Negative | P0 | Create with ID STU-2026-001 | Message under Student ID "This student ID is already used by another student." | — |
| TC-22 | Verify that the form can't be submitted twice | Negative | Create page, valid values | Click Add student twice quickly | Button shows "Saving..." and is disabled; one request only | mutation › submit button is disabled… |
| TC-23 | Verify that the API rejects bad data even without the UI | Negative | API running | `POST /api/v1/students` with `{}` | 400, `VALIDATION_FAILED`, 7 field errors | backend StudentControllerTest |

## 4. List behaviour
| ID | Scenario | Type | Precondition | Steps | Expected result | Auto |
|---|---|---|---|---|---|---|
| TC-24 | Verify that search by name, email or ID works | Positive | P0 | Type "ishita" | 1 result: Ishita Chatterjee | students › search by name… |
| TC-25 | Verify that a search with no match shows no results | Negative | P0 | Type "zzzz-no-such-student" | "No students match these filters" + Clear filters, which restores the list | students › search with no match… |
| TC-26 | Verify that grade and status filters work together | Positive | P0 | Status Graduated, Grade 10 | Only graduated grade-10 students; Reset clears both | students › status and grade… |
| TC-27 | Verify that sort by name is A to Z | Positive | P0 | Sort by "Name (A to Z)" | Names in alphabetical order | students › sort by name… |
| TC-28 | Verify that paging works | Positive | P0 | Click Next | "Showing 11-20 of 24", Previous enabled | students › next page… |
| TC-29 | Verify that the list refreshes after create/edit/delete | Positive | P0 | Do TC-05 / TC-08 / TC-11 | List shows the change without a page reload | mutation › create… |

## 5. Roles
| ID | Scenario | Type | Expected result |
|---|---|---|---|
| TC-30 | Roles and permissions | — | **Not applicable**: the homework app has no login |

## 6. States
| ID | Scenario | Type | Precondition | Steps | Expected result | Auto |
|---|---|---|---|---|---|---|
| TC-31 | Verify that loading shows skeleton rows | Positive | Slow API | Open the list | Grey skeleton rows until data arrives | students › loading shows… |
| TC-32 | Verify that "API down" shows an error and recovers | Negative | Stop the API | Open the list, start the API, click Try again | "Couldn't load students" + "We couldn't reach the server…", then the list after Try again | students › API down… |
| TC-33 | Verify that a server error shows the API's own message | Negative | API returns 500 | Open the list | "Something went wrong on our side. Please try again in a moment." | students › server error… |
| TC-34 | Verify that an empty database shows the empty state | Positive | No students | Open the list | "No students yet" + Add student | students › empty list… |
| TC-35 | Verify that an unknown id shows not found | Negative | P0 | Open `/students/details/999999` | "Student not found" + Back to students | students › unknown student id… |

## 7. Screen sizes
| ID | Scenario | Type | Steps | Expected result | Auto |
|---|---|---|---|---|---|
| TC-36 | Verify that list, create and details work from 1920 to 375 | Positive | Open each page at 1920, 1600, 1366, 1280, 1024, 991, 768, 640, 480, 375 | No sideways scroll; every control at least 24x24 px; table becomes cards at 768 and below; form is one column at 640 and below | responsive-screenshots (30 tests) |
| TC-37 | Verify that the delete dialog fits a phone | Positive | 375 px, open Delete | Dialog fits, buttons tappable | — |
