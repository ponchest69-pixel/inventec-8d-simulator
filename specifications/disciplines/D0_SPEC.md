# D0 Specification — Prepare for the 8D

## 1. Governance & Status

- **Discipline**: D0 — Prepare for the 8D
- **Allocated Time**: 5 minutes total:
  - **2 minutes**: Instructor teaching & NotebookLM Management Challenge framing
  - **2 minutes**: Interactive team investigation & decision submission
  - **1 minute**: Management Review & transition framing
- **Specification Status**: **APPROVED FOR SPECIFICATION AND INITIAL IMPLEMENTATION**
- **Architecture & Operating Model**: **APPROVED** (React + Vite static web app; free static hosting; 5 teams using 1 shared device per team; 6 participants collaborate verbally; 1 spokesperson operates the device; browser `localStorage` persistence; downloadable cumulative 8D report; verbal instructor progression control; no backend, database, or instructor dashboard)
- **NotebookLM Presentation Status**: **V2 APPROVED** (5-slide structure)
- **Implementation Gate**: Specification and architecture approved; **ready for D0 implementation upon user command**.

---

## 2. Pedagogical Objectives

Participants must:
1. **Recognize an abnormal condition**: Identify that an 8.0% initial functional test failure rate (80 of 1,000 units) is a significant deviation from the ~2.0% historical baseline.
2. **Understand the difference between retest PASS and verified resolution**: Recognize the *Retest Paradox*—that 60 boards passing on retest without root-cause investigation indicate a potential intermittent failure rather than a resolved defect.
3. **Identify potential risk**: Recognize the operational and quality risk if unverified retest-PASS units are treated as conforming without investigation (distinguishing the 60 retest-PASS units from confirmed unauthorized releases, which are not yet known in D0).
4. **Decide whether a formal 8D investigation is justified**: Conclude that symptom severity, unknown cause, and intermittent behavior require opening a formal 8D rather than normal monitoring or relying on retesting.

---

## 3. NotebookLM Presentation Reference (D0 V2)

The approved NotebookLM D0 V2 presentation consists of five slides that frame the transition into the simulator:
1. **Slide 1 — Management Challenge**: Executive problem framing.
2. **Slide 2 — Abnormality: 2% versus 8%**: Baseline comparison against current initial failure rate.
3. **Slide 3 — Retest Paradox**: 60 of 80 failing boards pass on retest; 20 remain persistent failures.
4. **Slide 4 — Management Decision**: Criteria for escalating to a formal 8D investigation.
5. **Slide 5 — Simulator Access**: Single QR/URL onboarding into the interactive D0 module.

*(Note: Referenced from approved course design metadata; no external presentation file has been inspected in the workspace.)*

---

## 4. Management Challenge

> “Our production line is experiencing an unusual number of functional test failures. Some boards pass when retested. Should we open a formal 8D investigation? What immediate risks concern you?”

---

## 5. Participant-Visible Evidence & Information Gating

### 5.1 Authorized Visible Information in D0
Source: [`CASE_DATA.json`](../CASE_DATA.json) (`d0_public_summary`)
- **Total units tested**: `1,000` PCBAs
- **Initial functional test FAIL**: `80` units (`8.0%`)
- **Retest PASS**: `60` units (out of the 80 initial failures; **distinguished from confirmed unauthorized releases**, as their downstream disposition is unknown in D0)
- **Persistent FAIL**: `20` units
- **Historical initial FAIL reference**: approximately `2.0%`
- **Customer exposure**: No confirmed customer shipments or customer escapes.

### 5.2 Strictly Excluded / Gated Information in D0
D0 must **NOT** reveal:
- The detailed disposition of the 60 retest-PASS units (`48 released into WIP` vs. `12 held in WIP`, or treated as confirmed unauthorized releases).
- The reflow recipe comparison (Original Recipe 500 units vs. Modified Recipe 500 units).
- Physical inventory breakdown by recipe or detailed containment solution.
- The J12 terminal 4 insufficient solder defect.
- Any occurrence, escape, or systemic root causes.

---

## 6. Interactions, Expected Decisions & Deterministic Feedback

### 6.1 Shared-Device Team Operating Model (**APPROVED**)
- Each of the five teams accesses the static web application via a **single URL/QR code** on **one shared computer or tablet**.
- Six participants collaborate verbally around the shared device; **one designated spokesperson** operates the device and submits the team's decisions.
- All teams receive the exact same initial information.
- Team selection (`Team 1`–`Team 5`), risk selections, decision history, and verified D0 conclusions persist independently in the browser's `localStorage` on each device.
- There is no Instructor Dashboard, backend database, or real-time synchronization; the instructor guides classroom pacing and discipline transitions verbally.

### 6.2 Selectable Risk Indicators
Before or alongside submitting their executive decision, the team selects which immediate risks concern them from the following structured indicators:

| ID | Risk Indicator Option | Classification | Pedagogical Role |
|---|---|---|---|
| **R1** | **Abnormal failure spike (`8.0%` initial FAIL vs. `~2.0%` historical baseline)** | **Required Risk** | Confirms recognition of a 4x statistical abnormality over the historical reference. |
| **R2** | **Intermittent failure / unverified retest risk (`60` initial FAIL units passed on retest without known cause)** | **Required Risk** | Confirms understanding of the Retest Paradox (retest PASS does not equal defect resolution, creating potential downstream risk if released unverified). |
| **R3** | **Unknown failure mechanism across `20` persistent FAIL and `60` retest-PASS units** | **Required Risk** | Confirms recognition that root cause is unknown, warranting formal 8D methodology. |
| **R4** | **Normal process variation within historical baseline (no significant risk)** | **Incorrect Distractor** | Contradicts the 8.0% vs. 2.0% evidence. |
| **R5** | **Confirmed customer line-down / field returns already in progress** | **Incorrect Distractor** | Contradicts the D0 evidence (there are zero confirmed customer shipments or escapes). |

### 6.3 Structured Decision Options & Deterministic Feedback

The team selects one of three structured executive decisions:

| Option ID | Decision Choice | Evaluation | Deterministic English Feedback |
|---|---|---|---|
| **DEC-D0-1** | **Open a formal 8D** | **Expected / Approved Decision** *(when paired with Required Risks `R1`–`R3` and no incorrect distractors)* | **If `R1`, `R2`, and `R3` are selected (and `R4`/`R5` are not selected)**: *"Approved. An 8.0% initial failure rate is four times the ~2.0% historical baseline, and 60 boards passing on retest without a verified cause indicate a potential intermittent failure mode rather than a resolved issue. Opening a formal 8D investigation is fully justified."* (Records verified D0 conclusion in the Cumulative 8D Report and unlocks Management Review.)<br><br>**If `DEC-D0-1` is chosen but required risks (`R1`–`R3`) are incomplete or distractors (`R4`/`R5`) are checked**: *"Opening a formal 8D is the right call, but review your risk assessment: ensure you account for the 8.0% vs. ~2.0% abnormality, the intermittent risk of the 60 retest-PASS units, and note that no customer shipments/escapes are confirmed."* (Allows immediate revision.) |
| **DEC-D0-2** | **Continue normal monitoring** | **Suboptimal / Reversible** | *"Insufficient response. An 8.0% initial failure rate (80 of 1,000 units) is four times the ~2.0% historical reference. Passive monitoring leaves an abnormal, unexplained failure trend active on the line. Review the baseline comparison and revise your decision."* (Allows team to revise decision.) |
| **DEC-D0-3** | **Rely on retesting** | **Suboptimal / Reversible** | *"High-risk practice (The Retest Paradox). Passing functional test on a second attempt does not explain or eliminate why 60 boards failed their initial test—it indicates a potential intermittent defect that could fail downstream if treated as good product. A formal 8D investigation is required to find the cause. Please revise your decision."* (Allows team to revise decision.) |

---

## 7. Management Review & Transition to D1

Upon completing D0, Management Review presents the transition prompt to D1:

> “I approve opening an 8D investigation. Who should be involved, and who will be accountable for delivering results?”

The instructor controls classroom progression to D1 verbally. (In the initial D0 prototype, D1–D8 remain locked/placeholder stages in the UI until their specifications are approved and implemented.)

---

## 8. Minimum D0 Prototype Scope

1. **Static React + Vite Shell**: Premium English industrial UI (light background, navy typography, teal accents, restrained red risk indicators) aligned with NotebookLM D0 V2.
2. **Team Identification & `localStorage` State**: Simple team selector (`Team 1`–`Team 5`) and session reset control persisted in browser `localStorage`.
3. **D0 Evidence Dashboard**: Displays the Management Challenge and authorized D0 KPI cards (`1,000` tested, `80` initial FAIL [`8.0%` vs. `~2.0%` baseline], `60` retest PASS, `20` persistent FAIL, `0` confirmed customer shipments/escapes) with visual comparison and Retest Paradox framing.
4. **Interactive Decision & Feedback Module**: Selectable risk indicators (`R1`–`R5`), structured decision options (`DEC-D0-1` to `DEC-D0-3`), deterministic feedback banner, and unlimited revision capability until verified.
5. **Management Review & Downloadable Cumulative 8D Report**: Unlocks the D0 Management Review card upon verified completion and populates the D0 section of the downloadable Cumulative 8D Report.

