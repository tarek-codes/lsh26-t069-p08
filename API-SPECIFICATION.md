# REST API & Server Action Specification (`API-SPECIFICATION.md`)

## 1. Global API Conventions

- **Base URL**: `/api/v1`
- **Content-Type**: `application/json; charset=utf-8`
- **Response Structure**:
  - Success: `{ "success": true, "data": { ... }, "meta": { ... } }`
  - Error: `{ "success": false, "error": { "code": "ERROR_CODE", "message": "Human readable message", "details": [ ... ] } }`
- **HTTP Status Codes**:
  - `200 OK`: Request succeeded.
  - `201 Created`: Resource successfully created.
  - `400 Bad Request`: Validation error or out-of-bounds mark entry.
  - `404 Not Found`: Student, Class, or Calculation Run not found.
  - `500 Internal Server Error`: Unhandled database or server exception.

---

## 2. API Endpoints

### 1. `GET /api/v1/classes`
Fetch all registered classes with student summary statistics.

#### Response `200 OK`:
```json
{
  "success": true,
  "data": [
    {
      "id": "c1010000-0000-0000-0000-000000000001",
      "code": "CLASS-9",
      "name": "Class 9",
      "academic_year": "2026",
      "student_count": 30,
      "last_calculated_at": "2026-08-30T10:15:00.000Z"
    },
    {
      "id": "c1010000-0000-0000-0000-000000000002",
      "code": "CLASS-10",
      "name": "Class 10",
      "academic_year": "2026",
      "student_count": 30,
      "last_calculated_at": "2026-08-30T10:15:00.000Z"
    }
  ]
}
```

---

### 2. `GET /api/v1/students`
Query students with optional filtering by class, search term, or optional subject.

#### Query Parameters:
- `classId` (optional, UUID): Filter by class ID.
- `search` (optional, string): Search by student name or roll number.
- `optionalSubject` (optional, string): Filter by `HMT`, `AGR`, or `REL`.

#### Response `200 OK`:
```json
{
  "success": true,
  "data": [
    {
      "id": "s1010000-0000-0000-0000-000000000001",
      "student_code": "S001",
      "name": "Kamal Begum",
      "class_id": "c1010000-0000-0000-0000-000000000001",
      "class_name": "Class 9",
      "roll_number": 1,
      "optional_subject_code": "AGR",
      "marks_entered_count": 7
    }
  ],
  "meta": {
    "total": 60,
    "page": 1,
    "limit": 50
  }
}
```

---

### 3. `POST /api/v1/students/:id/marks`
Update or insert marks for a specific student across one or multiple subjects.

#### Request Body:
```json
{
  "marks": {
    "BAN": 75,
    "ENG": 69,
    "MAT": 84,
    "PHY": { "theory": 52, "practical": 19 },
    "CHE": { "theory": 54, "practical": 19 },
    "BIO": { "theory": 64, "practical": 19 },
    "AGR": { "theory": 56, "practical": 18 }
  }
}
```

#### Validation Rules:
- Non-practical marks (`BAN`, `ENG`, `MAT`, `REL`): Integer `0..100` or `"AB"`.
- Practical marks (`PHY`, `CHE`, `BIO`, `HMT`, `AGR`): Object `{"theory": 0..75, "practical": 0..25}` or `"AB"`.

#### Response `200 OK`:
```json
{
  "success": true,
  "data": {
    "student_id": "s1010000-0000-0000-0000-000000000001",
    "updated_subjects": ["BAN", "ENG", "MAT", "PHY", "CHE", "BIO", "AGR"],
    "updated_at": "2026-08-30T10:30:00.000Z"
  }
}
```

---

### 4. `POST /api/v1/engine/calculate`
Execute the GPA engine for an entire class or a specific list of students.

#### Request Body:
```json
{
  "classId": "c1010000-0000-0000-0000-000000000001",
  "runCode": "RUN-2026-C9-FINAL"
}
```

#### Response `200 OK`:
```json
{
  "success": true,
  "data": {
    "calculation_run_id": "r1010000-0000-0000-0000-000000000001",
    "class_id": "c1010000-0000-0000-0000-000000000001",
    "run_code": "RUN-2026-C9-FINAL",
    "total_students": 30,
    "passed_students": 24,
    "failed_students": 6,
    "average_gpa": 3.82,
    "grade_distribution": {
      "A+": 8,
      "A": 10,
      "A-": 4,
      "B": 2,
      "C": 0,
      "D": 0,
      "F": 6
    },
    "flagged_cases_count": {
      "optional_low": 5,
      "practical_fail": 3,
      "absent": 2,
      "multi_flag": 2
    },
    "calculated_at": "2026-08-30T10:35:00.000Z"
  }
}
```

---

### 5. `GET /api/v1/results/:studentId/trace`
Retrieve the complete, verifiable audit trace for a student's calculated GPA.

#### Response `200 OK`:
```json
{
  "success": true,
  "data": {
    "student": {
      "id": "s1010000-0000-0000-0000-000000000004",
      "student_code": "S004",
      "name": "Imran Sultana",
      "class": "Class 9",
      "roll": 4,
      "optional_subject": "HMT"
    },
    "subjects": [
      {
        "code": "BAN",
        "name": "Bangla",
        "is_compulsory": true,
        "raw_mark": 83,
        "total_mark": 83,
        "grade_point": 5.0,
        "letter_grade": "A+",
        "is_passed": true,
        "rule_code": "RULE_SUB_GRADE_A_PLUS",
        "explanation": "Score 83 in range [80..100] -> GP 5.0 (A+)"
      },
      {
        "code": "ENG",
        "name": "English",
        "is_compulsory": true,
        "raw_mark": 100,
        "total_mark": 100,
        "grade_point": 5.0,
        "letter_grade": "A+",
        "is_passed": true,
        "rule_code": "RULE_SUB_GRADE_A_PLUS",
        "explanation": "Score 100 in range [80..100] -> GP 5.0 (A+)"
      },
      {
        "code": "MAT",
        "name": "Mathematics",
        "is_compulsory": true,
        "raw_mark": 32,
        "total_mark": 32,
        "grade_point": 0.0,
        "letter_grade": "F",
        "is_passed": false,
        "rule_code": "RULE_SUB_GRADE_F",
        "explanation": "Score 32 is below passing mark 33/100 -> GP 0.0 (F)"
      },
      {
        "code": "PHY",
        "name": "Physics",
        "is_compulsory": true,
        "raw_mark": { "theory": 75, "practical": 25 },
        "total_mark": 100,
        "grade_point": 5.0,
        "letter_grade": "A+",
        "is_passed": true,
        "rule_code": "RULE_PRAC_COMPONENT_PASS",
        "explanation": "Theory 75 >= 25, Practical 25 >= 8; Total 100 -> GP 5.0 (A+)"
      },
      {
        "code": "CHE",
        "name": "Chemistry",
        "is_compulsory": true,
        "raw_mark": { "theory": 70, "practical": 19 },
        "total_mark": 89,
        "grade_point": 5.0,
        "letter_grade": "A+",
        "is_passed": true,
        "rule_code": "RULE_PRAC_COMPONENT_PASS",
        "explanation": "Theory 70 >= 25, Practical 19 >= 8; Total 89 -> GP 5.0 (A+)"
      },
      {
        "code": "BIO",
        "name": "Biology",
        "is_compulsory": true,
        "raw_mark": { "theory": 63, "practical": 25 },
        "total_mark": 88,
        "grade_point": 5.0,
        "letter_grade": "A+",
        "is_passed": true,
        "rule_code": "RULE_PRAC_COMPONENT_PASS",
        "explanation": "Theory 63 >= 25, Practical 25 >= 8; Total 88 -> GP 5.0 (A+)"
      },
      {
        "code": "HMT",
        "name": "Higher Mathematics",
        "is_compulsory": false,
        "raw_mark": { "theory": 65, "practical": 21 },
        "total_mark": 86,
        "grade_point": 5.0,
        "letter_grade": "A+",
        "is_passed": true,
        "rule_code": "RULE_OPT_BONUS_ACTIVE",
        "explanation": "Optional GP 5.0 produces bonus max(0, 5.0 - 2.0) = 3.0"
      }
    ],
    "gpa_calculation": {
      "compulsory_gp_sum": 25.0,
      "optional_gp": 5.0,
      "optional_bonus_gp": 3.0,
      "raw_gpa": 4.6667,
      "capped_gpa": 4.67,
      "has_compulsory_fail": true,
      "failing_subjects": ["MAT"],
      "final_gpa": 0.0,
      "final_letter_grade": "F",
      "trace_narrative": "Student achieved high scores across 6 subjects (uncancelled raw GPA 4.67, Grade A), but failed compulsory subject MAT (32 < 33). Per Rule R-13, compulsory subject failure overrides overall average to Final GPA 0.00 and Letter Grade F."
    }
  }
}
```

---

### 6. `GET /api/v1/checking-lists`
Fetch students flagged for pre-publication administrative review.

#### Query Parameters:
- `listType` (required, string): `OPTIONAL_LOW`, `PRACTICAL_FAIL`, `ABSENT`, or `ALL`.
- `classId` (optional, UUID): Filter by class.

#### Response `200 OK`:
```json
{
  "success": true,
  "data": [
    {
      "flag_id": "f1010000-0000-0000-0000-000000000001",
      "student_id": "s1010000-0000-0000-0000-000000000002",
      "student_code": "S002",
      "name": "Lamia Islam",
      "class_name": "Class 9",
      "flag_type": "PRACTICAL_FAIL",
      "subject_code": "PHY",
      "trigger_reason": "Practical mark 6 is below pass mark 8/25 (Theory: 21, Total: 27)",
      "severity": "HIGH",
      "verification_status": "PENDING",
      "verified_by": null,
      "notes": null
    }
  ],
  "meta": {
    "total_flagged": 12,
    "pending_verification": 10,
    "verified": 2
  }
}
```

---

### 7. `PATCH /api/v1/checking-lists/:flagId/verify`
Update the verification status of a pre-publication checking item.

#### Request Body:
```json
{
  "verification_status": "VERIFIED",
  "verified_by_user": "Headmaster A. Rahman",
  "notes": "Verified against original physical answer script. Student practical mark 6 is accurate."
}
```

#### Response `200 OK`:
```json
{
  "success": true,
  "data": {
    "flag_id": "f1010000-0000-0000-0000-000000000001",
    "verification_status": "VERIFIED",
    "verified_by": "Headmaster A. Rahman",
    "verified_at": "2026-08-30T10:45:00.000Z"
  }
}
```

---

### 8. `POST /api/v1/seed`
Seed or reset the database with the verified 60-student dataset (including all 8 hard-edge test cases).

#### Response `200 OK`:
```json
{
  "success": true,
  "data": {
    "seeded_classes": ["Class 9", "Class 10"],
    "total_students_seeded": 60,
    "hard_edge_cases_seeded": 8,
    "default_run_generated": "RUN-2026-SEEDED",
    "timestamp": "2026-08-30T10:50:00.000Z"
  }
}
```
