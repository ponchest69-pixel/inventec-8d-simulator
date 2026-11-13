# D6 Specification — Implement and Validate Permanent Corrective Actions

## 1. Governance & Status

- **Discipline**: D6 — Implement and Validate
- **Allocated Time**: 30 minutes
- **Specification Status**: `CONCEPTUAL, PENDING_APPROVAL`
- **NotebookLM Presentation Status**: `PENDING_APPROVAL`
- **Implementation Gate**: **BLOCKED** — Pending detailed approval of validation interactions, historical inventory disposition rules, and feedback.

---

## 2. Pedagogical Objectives

- Validate Permanent Corrective Actions using objective, pre-defined acceptance criteria on a controlled post-correction pilot run.
- Maintain strict separation between the **500 NEW pilot units** and the **500 historical contained units**.
- Distinguish between the minimum **acceptance threshold (`>= 98.0%` FPY)** and the **achieved pilot performance (`98.4%` FPY)**.
- Recognize that pilot validation success proves the corrective action on new production but **does not automatically release historical contained inventory** without proper inspection/repair disposition.

---

## 3. Conceptual Post-Correction Pilot Dataset (`PENDING_APPROVAL`)

Source: [`CASE_DATA.json`](../CASE_DATA.json) (`conceptual_d6_pilot_validation`)

### 3.1 Proposed Acceptance Criteria
- **First Pass Yield (FPY)**: At least `98.0%`
- **Thermal Profile**: Conforming thermal profile required
- **J12 Solder Inspection**: `0` J12 anomalies in the specified `30`-unit sample
- **Retest / Release Governance**: `0` unauthorized releases

### 3.2 Achieved Pilot Results (500 NEW Units)
- **Pilot Population**: `500` **NEW** units (distinct from the 500 historical contained units)
- **Initial FAIL**: `8` units (`492` initial PASS)
- **Achieved FPY**: `98.4%` *(Do not confuse the achieved `98.4%` FPY with the `98.0%` acceptance threshold)*
- **J12 Inspection Sample**: `0` J12 anomalies in `30` inspected units
- **Thermal Profile**: Validated thermal profile
- **Release Compliance**: `0` unauthorized releases

---

## 4. Historical Contained Inventory Boundary

- **CRITICAL RULE**: Pilot success validates the restored process for new builds, but **does not automatically release the 500 historical contained units** (`398` WIP, `87` Finished Goods, `15` Diagnostics).

---

## 5. Interactions, Expected Decisions & Feedback (`PENDING_APPROVAL`)

- **Management Challenge**: `PENDING_APPROVAL`
- **Acceptance Criteria vs. Pilot Result Evaluation Mechanics**: `PENDING_APPROVAL`
- **Historical Contained Inventory Disposition Verification**: `PENDING_APPROVAL`
- **Deterministic Feedback Rules**: `PENDING_APPROVAL`
- **Management Review & Transition to D7**: `PENDING_APPROVAL`

