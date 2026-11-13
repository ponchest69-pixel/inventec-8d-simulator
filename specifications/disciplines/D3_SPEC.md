# D3 Specification — Interim Containment Actions (ICA)

## 1. Governance & Status

- **Discipline**: D3 — Interim Containment
- **Allocated Time**: 25 minutes
- **Specification Status**: `PENDING_APPROVAL`
- **NotebookLM Presentation Status**: `PENDING_APPROVAL`
- **Implementation Gate**: **BLOCKED** — Pending approval of detailed interaction, evidence release, and feedback specifications.

---

## 2. Pedagogical Objectives

- Protect internal downstream operations and the customer while root cause analysis is still pending.
- Use authorized evidence from D2/D3 to identify and isolate the suspect production interval rather than guessing or over/under-containing without justification.
- Account for retest-PASS units that were released into WIP without investigation.

---

## 3. Conceptual Containment Target & Inventory Data

Source: [`CASE_DATA.json`](../CASE_DATA.json) (`physical_inventory` and `historical_production`)

### 3.1 Conceptual Containment Target (Suspect Production Interval: 500 Units)
- **WIP**: `398` units
- **Finished Goods**: `87` units
- **Diagnostics**: `15` units
- **Total Suspect Interval Units**: `500` units (`398 + 87 + 15 = 500`)

### 3.2 Overall Physical Inventory Context (1,000 Units Total)
| Location | First Interval (Original) | Suspect Interval (Modified) | Total |
|---|---:|---:|---:|
| **WIP** | 350 | 398 | **748** |
| **Finished Goods** | 145 | 87 | **232** |
| **Diagnostics** | 5 | 15 | **20** |
| **Total** | **500** | **500** | **1,000** |

- **Retest-PASS Units Included in WIP**: Among the 60 retest-PASS units (`5` first interval, `55` suspect interval), `48` were released into WIP (`3` first interval, `45` suspect interval) and `12` remained held in WIP (`2` first interval, `10` suspect interval).
- **Customer Exposure**: Zero confirmed customer shipments or customer escapes.

---

## 4. Information Gating Rules

- Participants must discover the suspect 500-unit production interval using authorized evidence from D2/D3.
- **CRITICAL GATING RULE**: Do **not** reveal the modified reflow recipe as the root cause during D3 containment, and do not expose the J12 terminal 4 solder defect before D4 evidence discovery.

---

## 5. Interactions, Expected Decisions & Feedback (`PENDING_APPROVAL`)

- **Management Challenge**: `PENDING_APPROVAL`
- **Authorized Evidence Discovery Flow**: `PENDING_APPROVAL`
- **Containment Selection & Disposition Mechanics**: `PENDING_APPROVAL`
- **Deterministic Feedback Rules**: `PENDING_APPROVAL`
- **Management Review & Transition to D4**: `PENDING_APPROVAL`

