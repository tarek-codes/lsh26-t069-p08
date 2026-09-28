# Requirements & Project Guide — School Result Processing & GPA Engine

## 1. Project Overview

### What is this project?
This web application is an automated, error-free **Result Processing and GPA Engine** built for secondary schools. It replaces traditional manual spreadsheets with a fast, reliable system that calculates student grades, explains every step of the calculation, and helps school administrators catch grading issues before report cards are published.

### Why was it needed?
Previously, teachers calculated results manually in Excel or on paper. This led to frequent mistakes because school grading involves tricky special rules:
1. **Practical subjects require two separate passes**: A student must pass theory ($\ge 25/75$) **and** practical ($\ge 8/25$) independently. Passing the combined total alone is not enough.
2. **The 4th (optional) subject has a special bonus rule**: Only points scored above 2.00 count as extra bonus points.
3. **Failing any compulsory subject fails the entire exam**: Even if a student has an A+ in 5 subjects, failing 1 compulsory subject brings their final GPA to 0.00 (Grade F).
4. **Absences must be handled properly**: Missing an exam (`AB`) is not the same as scoring zero—it must be tracked clearly for office review.
5. **No easy way to review edge cases**: Staff needed a way to spot students who barely missed a pass or were absent before publishing final results.

---

## 2. Core Grading Rules (Explained Simply)

### Rule 1: Passing Practical Subjects (`R-11`)
* **Subjects**: Physics (`PHY`), Chemistry (`CHE`), Biology (`BIO`), Higher Math (`HMT`), Agriculture (`AGR`).
* **Marks breakdown**: Theory is out of 75; Practical is out of 25 (Total: 100).
* **Pass requirements**:
  - Theory must be at least **25 out of 75**.
  - Practical must be at least **8 out of 25**.
* **Important**: If a student gets 65 in Theory but only 7 in Practical, they **fail the subject** (Grade F, GP 0.00), even though their total score (72) looks high.

### Rule 2: Passing General Subjects (`R-07`)
* **Subjects**: Bangla (`BAN`), English (`ENG`), Mathematics (`MAT`), Religion (`REL`).
* **Pass requirement**: The student must score at least **33 out of 100**. Scores below 33 result in Grade F (GP 0.00).

### Rule 3: Exam Absence (`AB`) (`R-12`)
* If a student is absent (`AB`) in a **compulsory subject**, they receive GP 0.00 and an overall result of **F**.
* If a student is absent (`AB`) in an **optional subject**, they get 0.00 bonus points, but it does **not** fail their entire exam.
* The system keeps the mark displayed as `"AB"` instead of converting it to 0, making it obvious for verification.

### Rule 4: Optional 4th Subject Bonus (`R-13`, `R-20`)
* Every student chooses 1 optional 4th subject (Higher Math, Agriculture, or Religion).
* Only grade points **above 2.00** count as bonus:
  $$\text{Bonus Points} = \max(0, \text{Optional GP} - 2.00)$$
* **Example A**: Optional GP = 5.0 $\implies$ Bonus = $5.0 - 2.0 = 3.0$ points.
* **Example B**: Optional GP = 2.0 or lower $\implies$ Bonus = $0.0$ points.
* The total divisor is always **6.0** (the number of compulsory subjects). The optional subject adds bonus points to the numerator without increasing the denominator!

### Rule 5: Compulsory Failure Override (`R-13`)
* If a student fails **any one** of the 6 compulsory subjects (whether by scoring $<33$, failing theory, failing practical, or being absent):
  - **Final GPA = 0.00**
  - **Final Letter Grade = F**
* Even though the final result is F, the system keeps and displays their **uncancelled raw GPA** in the audit trace so teachers can see what their average would have been.

### Rule 6: GPA Capping (`R-13`)
* The maximum possible final GPA is **5.00**.
* If compulsory grades plus bonus points add up to a raw GPA greater than 5.00 (e.g. 5.50), it is neatly capped at **5.00 (A+)**.

---

## 3. Grading Scale Reference

### Subject Marks to Grade Points (`R-21`)
| Marks Range | Letter Grade | Grade Point (GP) | Remarks |
| :---: | :---: | :---: | :--- |
| **80 – 100** | **A+** | **5.0** | Outstanding |
| **70 – 79** | **A** | **4.0** | Very Good |
| **60 – 69** | **A-** | **3.5** | Good |
| **50 – 59** | **B** | **3.0** | Satisfactory |
| **40 – 49** | **C** | **2.0** | Acceptable / Pass |
| **33 – 39** | **D** | **1.0** | Marginal Pass |
| **0 – 32** (or component fail / AB) | **F** | **0.0** | Fail |

### Final GPA to Overall Letter Grade (`R-10`)
| GPA Range | Final Letter Grade | Status |
| :---: | :---: | :--- |
| **5.00** | **A+** | Passed (Highest Distinction) |
| **4.00 – 4.99** | **A** | Passed |
| **3.50 – 3.99** | **A-** | Passed |
| **3.00 – 3.49** | **B** | Passed |
| **2.00 – 2.99** | **C** | Passed |
| **1.00 – 1.99** | **D** | Passed |
| **0.00** (or any compulsory fail) | **F** | Failed |

---

## 4. Subjects & Student Curriculum

Each student takes **7 subjects** in total:
* **6 Compulsory Subjects**:
  1. Bangla (`BAN`) — No practical (100 marks)
  2. English (`ENG`) — No practical (100 marks)
  3. Mathematics (`MAT`) — No practical (100 marks)
  4. Physics (`PHY`) — Theory 75 + Practical 25
  5. Chemistry (`CHE`) — Theory 75 + Practical 25
  6. Biology (`BIO`) — Theory 75 + Practical 25
* **1 Optional Subject** (chosen by the student):
  - Higher Mathematics (`HMT`) — Theory 75 + Practical 25
  - Agriculture Studies (`AGR`) — Theory 75 + Practical 25
  - Religion & Moral Education (`REL`) — No practical (100 marks)

---

## 5. Current System Features & What Is Built

The application is completely built and functional. Here is an overview of what the system currently does:

### 1. Executive Analytics Dashboard
* **Class Selector**: Switch between Class 9, Class 10, or view All Classes together.
* **Key Metrics**: Instantly see Total Students, Pass Rate (%), Average GPA, and Total Flagged items.
* **Interactive Visualizations**:
  - Bar chart showing letter grade distribution (A+, A, A-, B, C, D, F).
  - Pie chart showing pass vs fail proportions.
* **Action Shortcuts**: Quick links to verification lists, mark entry, transcripts, and dataset reset.

### 2. Class Results Matrix & Search
* Comprehensive table displaying all students, their roll numbers, marks per subject, raw GPA, final GPA, and final letter grade.
* Real-time search by student name, student ID, or roll number.
* Color-coded status badges for instant recognition of passes, failures, and flagged records.

### 3. Step-by-Step Audit Trace ("Explainable GPA")
* Clicking any student opens their complete calculation breakdown.
* Displays subject-by-subject scores, theory/practical evaluations, and applied rule codes.
* Clearly highlights the root cause if a student failed (e.g., *"Physics Practical 7 < 8 caused subject failure"*).
* Shows the exact math: sum of compulsory GPs + bonus points $\div$ 6.0 = Raw GPA $\rightarrow$ Capped Final GPA.

### 4. Pre-Publication Checking Lists (Verification Workflow)
Staff can inspect and verify edge cases across three dedicated lists before publishing results:
1. **Optional Subject Review**: Students with an optional subject GP $\le 2.00$ (giving zero bonus).
2. **Practical Fail Review**: Students who scored $< 8$ in practical for any subject.
3. **Absentee Review**: Students marked `"AB"` in any subject.
4. **Multi-Flag Review**: Students who triggered two or more flags at the same time.
* **Admin Actions**: Staff can update status (`Pending`, `Verified`, `Correction Required`) and write internal review notes.

### 5. Interactive Marks Entry & Live Recalculation
* Easy-to-use table to input or update marks directly in the browser.
* Separated theory and practical inputs for science/practical subjects.
* Any change immediately recalculates the student's GPA, letter grade, and status in real-time without page reload.

### 6. File Import (CSV & JSON)
* Bulk upload student marks via CSV or JSON files.
* Built-in validator checks marks ranges ($0..75$, $0..25$, $0..100$, `"AB"`) and reports row-by-row errors immediately.

### 7. Cohort Analytics
* Detailed breakdown of academic performance across subjects.
* Compares Theory vs Practical failure counts to identify subjects where students struggle the most.

### 8. Official Printable Transcripts & Report Cards
* Clean, single-page printable academic transcripts for individual students.
* Includes school header, student info, subject breakdown table, GPA calculation summary, and official sign-off lines.
* Print-ready CSS styled for clean standard paper printing.

### 9. Seed Dataset & Reset Controls
* Preloaded with **60 real student records** (30 in Class 9, 30 in Class 10).
* Contains all 8 official hard-edge test cases to demonstrate and verify every rule.
* One-click "Reset Seed Data" button to restore original data at any time.

---

## 6. The 8 Hard-Edge Test Cases

The application includes 8 specifically crafted student scenarios to prove that every rule works correctly:

| Case ID | Student Name | Tested Edge Case | What are their marks? | Expected Result | Why does this happen? |
| :--- | :--- | :--- | :--- | :---: | :--- |
| **`EDGE-01`** | **Arif Hossain** | Compulsory Fail with High Average | High marks in 5 subjects, but **30** in Math ($< 33$). | **GPA 0.00 (F)** *(Raw: 4.67 A)* | Failing any compulsory subject overrides the average and fails the student. |
| **`EDGE-02`** | **Tanvir Ahmed** | Practical Fail with High Theory | Physics Theory **65/75** (Pass), Practical **7/25** (Fail $< 8$). | **GPA 0.00 (F)** | Both components must pass. Practical mark 7 is below the minimum 8. |
| **`EDGE-03`** | **Nusrat Jahan** | Theory Fail with High Practical | Chemistry Theory **22/75** (Fail $< 25$), Practical **24/25**. Total = 46. | **GPA 0.00 (F)** | Theory 22 is below the minimum 25, failing Chemistry despite a high total. |
| **`EDGE-04`** | **Sakib Al Hasan** | Optional GP $\le 2.0$ (Zero Bonus) | Optional Agriculture GP is **2.00**; all compulsory are 5.0. | **GPA 5.00 (A+)** *(Bonus: 0.00)* | Bonus only applies above 2.0. Since GP is 2.0, bonus is 0.00. |
| **`EDGE-05`** | **Mehedi Hasan** | Optional GP $> 2.0$ (Active Bonus) | All compulsory GP = 4.0 (Sum = 24). Optional Higher Math = 5.0. | **GPA 4.50 (A)** *(Bonus: 3.00)* | Bonus is $5.0 - 2.0 = 3.0$. Formula: $(24 + 3) / 6 = 4.50$. |
| **`EDGE-06`** | **Farhana Akter** | GPA Capping at 5.00 | All compulsory GP = 5.0 (Sum = 30). Optional Agriculture = 5.0. | **GPA 5.00 (A+)** *(Raw: 5.50)* | Raw GPA is $(30 + 3) / 6 = 5.50$, which is capped at the maximum allowed 5.00. |
| **`EDGE-07`** | **Sadia Islam** | Absent in Compulsory Subject | Absent (`AB`) in Bangla. All other subjects are 80+ (A+). | **GPA 0.00 (F)** | Absent in a compulsory subject counts as an immediate failure. |
| **`EDGE-08`** | **Rashedul Karim** | Absent in Optional Subject | All compulsory passed with high marks. Absent (`AB`) in optional Higher Math. | **GPA 4.50 (A)** *(Bonus: 0.00)* | Absent in an optional subject yields 0.00 bonus, but does **not** fail the student. |