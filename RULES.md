# Business Rules & Grading Logic Specification (`RULES.md`)

## 1. Overview & Rule Taxonomy

This document is the single authoritative specification for all grading, calculation, evaluation, and verification logic used in the School Result Processing and GPA Engine. Every rule is assigned a permanent identifier (`R-xx`) and a corresponding audit trace rule code (`RULE_*`).

---

## 2. Core Rule Definitions

```mermaid
flowchart TD
    Start([Raw Student Marks Ingested]) --> CheckComp{For Each Subject}
    CheckComp -->|Practical Subject| EvalPrac[Check Theory >= 25 & Practical >= 8]
    CheckComp -->|Non-Practical| EvalNonPrac[Check Mark >= 33]
    CheckComp -->|Mark == 'AB'| EvalAbsent[Assign GP 0.00, Grade F]
    
    EvalPrac -->|Either Part Fails| SubFail[Subject GP = 0.00, Grade = F]
    EvalPrac -->|Both Pass| SubTotal[Total = Theory + Practical]
    EvalNonPrac -->|Mark < 33| SubFail
    EvalNonPrac -->|Mark >= 33| SubTotal
    
    SubTotal --> MapGP[Map Total Mark to Subject GP via R-21 Scale]
    
    SubFail --> CheckCompulsory{Is Subject Compulsory?}
    MapGP --> CheckCompulsory
    EvalAbsent --> CheckCompulsory
    
    CheckCompulsory -->|Compulsory Failed / AB| FlagCompFail[Mark Has Compulsory Failure = TRUE]
    CheckCompulsory -->|Optional Subject| CalcOptBonus[Calculate Optional Bonus: max(0, GP - 2.0)]
    
    FlagCompFail --> CalcGPA[Calculate Raw GPA: Sum Compulsory GP + Bonus / 6.0]
    CalcOptBonus --> CalcGPA
    
    CalcGPA --> CheckOverride{Has Compulsory Failure?}
    CheckOverride -->|YES| FinalFail[Final GPA = 0.00, Final Grade = F<br/>Keep Raw GPA in Trace]
    CheckOverride -->|NO| CapGPA[Capped GPA = min 5.00, Raw GPA]
    CapGPA --> MapFinalGrade[Map Final GPA to Letter Grade via R-10]
    
    FinalFail --> GenTrace[Generate Audit Trace & Flag Checking Lists R-29]
    MapFinalGrade --> GenTrace
    GenTrace --> End([Publish Verified Results])
```

---

### Rule `R-11`: Component Pass Constraint (Practical Subjects)

- **Applies to**: Subjects with a practical component (`PHY`, `CHE`, `BIO`, `HMT`, `AGR`).
- **Structure**: Mark is a composite pair `{"theory": 0..75, "practical": 0..25}`.
- **Pass Thresholds**:
  - Minimum Theory Pass Mark = $25$ (out of 75).
  - Minimum Practical Pass Mark = $8$ (out of 25).
- **Rule Logic**:
  $$\text{Pass}_{\text{subject}} = (\text{Mark}_{\text{theory}} \ge 25) \land (\text{Mark}_{\text{practical}} \ge 8)$$
- **Failure Consequence**:
  - If $\text{Mark}_{\text{theory}} < 25 \lor \text{Mark}_{\text{practical}} < 8$:
    - $\text{Subject GP} = 0.00$
    - $\text{Subject Letter Grade} = \text{"F"}$
    - Trace Rule Code: `RULE_PRAC_COMPONENT_FAIL` (or `RULE_THEORY_COMPONENT_FAIL`)
  - Note: This failure occurs **regardless of whether the combined total ($\text{theory} + \text{practical}$) meets or exceeds $33$**.
- **Passing Condition**:
  - If $\text{Mark}_{\text{theory}} \ge 25 \land \text{Mark}_{\text{practical}} \ge 8$:
    - $\text{Total Mark} = \text{Mark}_{\text{theory}} + \text{Mark}_{\text{practical}}$ (Range: $33..100$)
    - Subject GP and Letter Grade are evaluated using Rule `R-21`.
    - Trace Rule Code: `RULE_PRAC_COMPONENT_PASS`

---

### Rule `R-12`: Subject Absence Handling

- **Indicator**: Mark value equals `"AB"` (string).
- **Compulsory Subject Absence**:
  - $\text{Subject GP} = 0.00$
  - $\text{Subject Letter Grade} = \text{"F"}$
  - $\text{Displayed Mark} = \text{"AB"}$ (must **never** be rendered as numeric $0$)
  - Triggers **Compulsory Failure Override** (`R-13`): Student Overall GPA = $0.00$, Letter Grade = `"F"`.
  - Flags student onto the **Absentee Checking List** (`R-29`).
  - Trace Rule Code: `RULE_ABSENT_COMPULSORY`
- **Optional Subject Absence**:
  - $\text{Subject GP} = 0.00$
  - $\text{Subject Letter Grade} = \text{"F"}$
  - $\text{Displayed Mark} = \text{"AB"}$
  - Contributes $0.00$ bonus points ($\max(0, 0.00 - 2.00) = 0.00$).
  - Does **not** cause overall student failure if all 6 compulsory subjects pass.
  - Flags student onto both the **Absentee Checking List** and the **Optional $\le 2.0$ Checking List** (`R-29`).
  - Trace Rule Code: `RULE_ABSENT_OPTIONAL`

---

### Rule `R-21`: Subject Mark to Grade Point (GP) Scale

When a subject is passed (or for non-practical subjects $\ge 33$), the total score maps to Grade Point and Letter Grade:

| Mark Range (Integer) | Grade Point (GP) | Subject Letter Grade | Description | Trace Rule Code |
| :--- | :--- | :--- | :--- | :--- |
| **$80 \le \text{Mark} \le 100$** | **$5.00$** | **A+** | Outstanding | `RULE_SUB_GRADE_A_PLUS` |
| **$70 \le \text{Mark} \le 79$** | **$4.00$** | **A** | Excellent | `RULE_SUB_GRADE_A` |
| **$60 \le \text{Mark} \le 69$** | **$3.50$** | **A-** | Very Good | `RULE_SUB_GRADE_A_MINUS` |
| **$50 \le \text{Mark} \le 59$** | **$3.00$** | **B** | Good | `RULE_SUB_GRADE_B` |
| **$40 \le \text{Mark} \le 49$** | **$2.00$** | **C** | Satisfactory | `RULE_SUB_GRADE_C` |
| **$33 \le \text{Mark} \le 39$** | **$1.00$** | **D** | Passing / Marginal | `RULE_SUB_GRADE_D` |
| **$0 \le \text{Mark} < 33$** | **$0.00$** | **F** | Fail | `RULE_SUB_GRADE_F` |

---

### Rule `R-20`: Optional Fourth Subject Bonus Rule

- **Purpose**: Calculate additional grade points contributed by the elective 4th subject.
- **Formula**:
  $$\text{GP}_{\text{bonus}} = \max(0.00, \text{GP}_{\text{optional}} - 2.00)$$
- **Behavior Matrix**:
  - $\text{GP}_{\text{optional}} = 5.00 \implies \text{Bonus} = 5.00 - 2.00 = \mathbf{3.00}$ (Adds $+0.50$ to GPA)
  - $\text{GP}_{\text{optional}} = 4.00 \implies \text{Bonus} = 4.00 - 2.00 = \mathbf{2.00}$ (Adds $+0.33$ to GPA)
  - $\text{GP}_{\text{optional}} = 3.50 \implies \text{Bonus} = 3.50 - 2.00 = \mathbf{1.50}$ (Adds $+0.25$ to GPA)
  - $\text{GP}_{\text{optional}} = 3.00 \implies \text{Bonus} = 3.00 - 2.00 = \mathbf{1.00}$ (Adds $+0.17$ to GPA)
  - $\text{GP}_{\text{optional}} = 2.00 \implies \text{Bonus} = \max(0, 2.00 - 2.00) = \mathbf{0.00}$ (No bonus)
  - $\text{GP}_{\text{optional}} = 1.00 \implies \text{Bonus} = \max(0, 1.00 - 2.00) = \mathbf{0.00}$ (No bonus)
  - $\text{GP}_{\text{optional}} = 0.00 \text{ or "AB"} \implies \text{Bonus} = \mathbf{0.00}$ (No bonus)
- **Divisor Invariance**: The divisor in the GPA equation remains strictly $6.0$ regardless of optional subject participation or performance.
- **Trace Rule Codes**: `RULE_OPT_BONUS_ACTIVE`, `RULE_OPT_BONUS_ZERO`

---

### Rule `R-13`: GPA Engine Formula & Compulsory Fail Override

1. **Sum of Compulsory Grade Points**:
   $$S_{\text{comp}} = \sum_{i=1}^{6} \text{GP}_{\text{compulsory}, i}$$
2. **Raw Uncapped GPA**:
   $$\text{GPA}_{\text{raw}} = \frac{S_{\text{comp}} + \text{GP}_{\text{bonus}}}{6.0}$$
3. **Capped GPA**:
   $$\text{GPA}_{\text{capped}} = \min(5.00, \text{GPA}_{\text{raw}})$$
4. **Compulsory Failure Override**:
   $$\text{HasCompulsoryFail} = \exists i \in \{1..6\} \text{ where } \text{GP}_{\text{compulsory}, i} = 0.00$$
   $$\text{Final GPA} = \begin{cases} 
      0.00 & \text{if } \text{HasCompulsoryFail} = \text{TRUE} \\
      \text{round}(\text{GPA}_{\text{capped}}, 2) & \text{if } \text{HasCompulsoryFail} = \text{FALSE}
   \end{cases}$$
5. **Traceability Guarantee**: When $\text{HasCompulsoryFail} = \text{TRUE}$, the trace record must store both $\text{GPA}_{\text{raw}}$ and $\text{Final GPA} = 0.00$ along with the explicit list of failed subjects.
- **Trace Rule Codes**: `RULE_GPA_CALCULATED`, `RULE_GPA_CAPPED_MAX5`, `RULE_COMPULSORY_FAIL_OVERRIDE`

---

### Rule `R-10`: Final GPA to Final Letter Grade Scale

The student's final calculated GPA maps to the overall letter grade according to the following contiguous, non-overlapping intervals:

| GPA Range | Final Letter Grade | Standing |
| :--- | :--- | :--- |
| **$\text{GPA} = 5.00$** | **A+** | Outstanding |
| **$4.00 \le \text{GPA} < 5.00$** | **A** | Excellent |
| **$3.50 \le \text{GPA} < 4.00$** | **A-** | Very Good |
| **$3.00 \le \text{GPA} < 3.50$** | **B** | Good |
| **$2.00 \le \text{GPA} < 3.00$** | **C** | Satisfactory |
| **$1.00 \le \text{GPA} < 2.00$** | **D** | Passing |
| **$\text{GPA} = 0.00 \lor \text{Compulsory Fail}$** | **F** | Failed |

---

### Rule `R-29`: Pre-Publication Office Checking Lists

Prior to final result publication, the system generates 3 targeted verification lists:

| Checking List | Qualification Condition | Purpose / Teacher Action |
| :--- | :--- | :--- |
| **1. Optional Subject Review List** | $\text{GP}_{\text{optional}} \le 2.00$ (including `"AB"` where GP = $0.00$) | Verify whether the student failed or received zero bonus on their 4th subject, ensuring no marks were omitted. |
| **2. Practical Fail Review List** | Any subject (compulsory or optional) with practical mark $< 8$ | Double-check practical exam sheets for data entry typos (e.g. entered 7 instead of 17). |
| **3. Absentee Review List** | Any subject (compulsory or optional) with mark = `"AB"` | Confirm student was genuinely absent from the examination hall and signature sheet. |
| **Multi-Flag Summary** | Student matches 2 or more of the above lists | High-priority manual audit case for Headmaster / Examination Controller. |

---

## 3. Mathematical Pseudocode

```typescript
interface SubjectMark {
  code: string;
  isPractical: boolean;
  isCompulsory: boolean;
  rawMark: number | { theory: number; practical: number } | 'AB';
}

interface SubjectEvaluation {
  code: string;
  totalMark: number | 'AB';
  gradePoint: number;
  letterGrade: string;
  isPassed: boolean;
  ruleCode: string;
  failureReason?: string;
}

interface StudentCalculationResult {
  studentId: string;
  subjectEvaluations: SubjectEvaluation[];
  compulsoryGPsSum: number;
  optionalBonusGP: number;
  rawGPA: number;
  cappedGPA: number;
  hasCompulsoryFail: boolean;
  failingCompulsorySubjects: string[];
  finalGPA: number;
  finalLetterGrade: string;
  checkingFlags: ('OPTIONAL_LOW' | 'PRACTICAL_FAIL' | 'ABSENT')[];
  traceSteps: string[];
}

function evaluateSubject(sub: SubjectMark): SubjectEvaluation {
  if (sub.rawMark === 'AB') {
    return {
      code: sub.code,
      totalMark: 'AB',
      gradePoint: 0.0,
      letterGrade: 'F',
      isPassed: false,
      ruleCode: sub.isCompulsory ? 'RULE_ABSENT_COMPULSORY' : 'RULE_ABSENT_OPTIONAL',
      failureReason: 'Student was marked Absent (AB)'
    };
  }

  if (sub.isPractical) {
    const { theory, practical } = sub.rawMark as { theory: number; practical: number };
    
    if (theory < 25) {
      return {
        code: sub.code,
        totalMark: theory + practical,
        gradePoint: 0.0,
        letterGrade: 'F',
        isPassed: false,
        ruleCode: 'RULE_THEORY_COMPONENT_FAIL',
        failureReason: `Theory mark ${theory} is below passing threshold 25/75`
      };
    }
    
    if (practical < 8) {
      return {
        code: sub.code,
        totalMark: theory + practical,
        gradePoint: 0.0,
        letterGrade: 'F',
        isPassed: false,
        ruleCode: 'RULE_PRAC_COMPONENT_FAIL',
        failureReason: `Practical mark ${practical} is below passing threshold 8/25`
      };
    }

    const total = theory + practical;
    const { gp, grade, rule } = mapTotalToGP(total);
    return {
      code: sub.code,
      totalMark: total,
      gradePoint: gp,
      letterGrade: grade,
      isPassed: gp > 0,
      ruleCode: rule
    };
  } else {
    const total = sub.rawMark as number;
    const { gp, grade, rule } = mapTotalToGP(total);
    return {
      code: sub.code,
      totalMark: total,
      gradePoint: gp,
      letterGrade: grade,
      isPassed: gp > 0,
      ruleCode: rule,
      failureReason: total < 33 ? `Total mark ${total} is below passing threshold 33/100` : undefined
    };
  }
}

function mapTotalToGP(mark: number): { gp: number; grade: string; rule: string } {
  if (mark >= 80) return { gp: 5.0, grade: 'A+', rule: 'RULE_SUB_GRADE_A_PLUS' };
  if (mark >= 70) return { gp: 4.0, grade: 'A', rule: 'RULE_SUB_GRADE_A' };
  if (mark >= 60) return { gp: 3.5, grade: 'A-', rule: 'RULE_SUB_GRADE_A_MINUS' };
  if (mark >= 50) return { gp: 3.0, grade: 'B', rule: 'RULE_SUB_GRADE_B' };
  if (mark >= 40) return { gp: 2.0, grade: 'C', rule: 'RULE_SUB_GRADE_C' };
  if (mark >= 33) return { gp: 1.0, grade: 'D', rule: 'RULE_SUB_GRADE_D' };
  return { gp: 0.0, grade: 'F', rule: 'RULE_SUB_GRADE_F' };
}

function mapGPAToLetterGrade(gpa: number): string {
  if (gpa >= 5.0) return 'A+';
  if (gpa >= 4.0) return 'A';
  if (gpa >= 3.5) return 'A-';
  if (gpa >= 3.0) return 'B';
  if (gpa >= 2.0) return 'C';
  if (gpa >= 1.0) return 'D';
  return 'F';
}
```
