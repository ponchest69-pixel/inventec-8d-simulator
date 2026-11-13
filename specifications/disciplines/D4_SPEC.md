# D4 Specification — Root Cause Analysis (RCA)

## 1. Governance & Status

- **Discipline**: D4 — Root Cause Analysis
- **Allocated Time**: 65 minutes (`25 min` instructor teaching + `40 min` interactive investigation)
- **Specification Status**: `CONCEPTUAL, PENDING_APPROVAL`
- **NotebookLM Presentation Status**: `PENDING_APPROVAL`
- **Implementation Gate**: **BLOCKED** — Do not treat conceptual screen layouts or evidence interactions as approved implementation specifications.

---

## 2. Pedagogical Objectives

- Formulate, test, falsify, and verify hypotheses using empirical evidence rather than assumptions.
- Distinguish between physical failure mechanism, occurrence cause, potential escape path (noting that the initial functional test *did* detect the failures, whereas retest-PASS release created the escape risk), and systemic causes.
- Progressively unlock and correlate evidence before submitting the Root Cause Report.

---

## 3. Conceptual Screen Architecture (`PENDING_APPROVAL`)

1. **Management Challenge**
2. **Hypothesis Board**
3. **Evidence Center**
4. **Verification Lab**
5. **Root Cause Report**
6. **Management Review**

---

## 4. Conceptual Evidence Candidates (`PENDING_APPROVAL`)

Source: [`CASE_DATA.json`](../CASE_DATA.json) (`conceptual_d4_evidence_candidates`). Evidence must be progressively disclosed:

| ID | Candidate Evidence Summary |
|---|---|
| **E01** | Five intermittent boards fail on both verified fixtures. |
| **E02** | Common component lots across periods; no clear lot correlation. |
| **E03** | Firmware FW-3.2.1 unchanged across all 1,000 units. |
| **E04** | Anomalous J12 solder in 17/20 intermittent FAIL samples versus 1/20 initial PASS samples. |
| **E05** | Reflow recipe change before the second 500 without documented thermal profile validation. |
| **E06** | Ten J12-anomalous boards reproduce the failure; all ten pass after solder repair. |
| **E06-B** | 8 J12 defects in 30 modified-recipe units versus 0 in 30 with the validated restored recipe. |
| **E07** | 48 retest-PASS units released without investigation; 12 held. |
| **E08** | Insufficient retest disposition instructions and independent change validation. |

---

## 5. Reserved Causal Information (Target Conclusions)

Source: [`CASE_DATA.json`](../CASE_DATA.json) (`reserved_causal_information`). Must not be exposed to participants before authorized evidence discovery:

- **Physical Cause**: Insufficient solder at J12 terminal 4 causing intermittent electrical contact.
- **Occurrence Cause**: Unvalidated thermal reflow recipe change.
- **Potential Escape Cause**: Release after retest PASS without investigating the original FAIL *(Note: The initial functional test did detect the failures)*.
- **Systemic Cause**: Insufficient change control, independent validation, and retest disposition instructions.

---

## 6. Interactions, Expected Decisions & Feedback (`PENDING_APPROVAL`)

- **Progressive Disclosure Rules & Prerequisites**: `PENDING_APPROVAL`
- **Hypothesis-to-Evidence Linking Mechanics**: `PENDING_APPROVAL`
- **Verification Lab Experiment Flow**: `PENDING_APPROVAL`
- **Deterministic Feedback Rules**: `PENDING_APPROVAL`
- **Management Review & Transition to D5**: `PENDING_APPROVAL`

