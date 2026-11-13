# Interactive 8D Problem Solving Simulator — Inventec: Master Specification

## 1. Purpose & Scope

This document defines the project-wide rules, pedagogical framework, system architecture, visual design system, and development governance for the **Interactive 8D Problem Solving Simulator — Inventec**.

This application is a **lightweight, one-day interactive training aid** for Inventec—potentially gifted to participants for future self-paced practice. It is **not** a commercial enterprise software product. All simulation data and scenarios are fictional educational materials created for industrial quality engineering training.

---

## 2. Course & Simulation Context

- **Workshop Format**: 8-hour instructor-led workshop (including a 1-hour lunch break).
- **Participants**: 30 participants organized into **5 teams of 6**.
- **Separate Instructor Demonstration**: The workshop includes a separate 60-minute instructor demonstration using a **screw-torque case**. That demonstration case must **never** be merged with the PCBA simulation dataset or logic.
- **Session Continuity**: Teams access the simulator through a single QR code or URL during initial setup and maintain independent progress in browser `localStorage` on their shared device throughout D0–D8.
- **Progression Control**: The instructor controls progression across disciplines **verbally** in the classroom (no backend lock/unlock or real-time device synchronization).

### 2.1 Pedagogical Learning Sequence

Every discipline follows a five-stage classroom loop:

1. **Instructor Teaching** — Conceptual instruction on the discipline's methodology and quality tools.
2. **NotebookLM Management Challenge** — Executive framing and scenario challenge presented via NotebookLM slides.
3. **Interactive APP Investigation** — Evidence-based team investigation, analysis, and decision submission in the simulator.
4. **Management Review** — Deterministic executive critique, feedback, and transition framing.
5. **Verbal Instructor-Controlled Progression** — Classroom debrief and verbal instructor direction to advance to the next discipline.

### 2.2 Simulation Timing (225 Minutes Total)

| Discipline | Title | Duration |
|---|---|---:|
| **D0** | Prepare for the 8D | 5 min |
| **D1** | Establish the Team | 5 min |
| **D2** | Describe the Problem | 25 min |
| **D3** | Interim Containment | 25 min |
| **D4** | Root Cause Analysis | 65 min |
| **D5** | Permanent Corrective Actions | 30 min |
| **D6** | Implement and Validate | 30 min |
| **D7** | Prevent Recurrence | 25 min |
| **D8** | Recognize and Close | 15 min |
| **Total** | **D0–D8 Simulation** | **225 min** |

---

## 3. Approved Application Architecture (**APPROVED**)

### 3.1 Technical Stack & Hosting
- **Application Type**: **React + Vite static web application** (100% client-side execution).
- **Hosting**: Free static hosting, completely independent of Inprocessa's VPS.
- **Zero Backend / Zero Infrastructure**: No backend server, no database, no Supabase, no authentication, and no paid cloud services.
- **Removed Enterprise Components**: No Instructor Dashboard, no real-time multi-device synchronization, and no complex weighted scoring engine.

### 3.2 Shared-Device Classroom & Self-Practice Operating Model
- **5 teams**, each using **one shared computer or tablet** accessed via a **single URL/QR code**.
- **6 participants collaborate verbally** per team; **one designated spokesperson** operates the shared device and submits the team's decisions.
- **Same Initial Information**: All teams receive the exact same initial scenario and data.
- **Client-Side Persistence (`localStorage`)**: Each team's device independently saves its team identifier (e.g., `Team 1`–`Team 5` or practice mode), active discipline, inspected evidence, decision history, and verified conclusions in browser `localStorage` so page refreshes never lose progress (with a simple "Reset Session" option for future practice).

### 3.3 Core Functional Modules
1. **Participant Investigation & Decision Workspace**:
   - Displays active discipline context, Management Challenge, and progressively disclosed evidence through normal UI navigation.
   - Provides structured decision inputs, educational hints, and immediate opportunities to revise suboptimal choices.
2. **Client-Side Deterministic Decision Engine**:
   - Reproducible, rule-based evaluation of evidence inspection, risk selection, and decisions—with zero generative AI / LLM calls at runtime.
   - Delivers constructive English feedback and unlocks the discipline's Management Review and transition step once the expected decision is achieved.
3. **Downloadable Cumulative 8D Report**:
   - Automatically records verified conclusions, containment boundaries, root causes, corrective actions, validation results, and systemic controls as the team progresses through D0–D8.
   - Can be viewed at any point and downloaded directly from the browser (e.g., formatted printable/exportable report) for classroom debrief or future reference.

### 3.4 Minimum D0 Prototype Scope
The initial implementation target is a clean, self-contained **D0 Prototype** in the React + Vite static app:
1. **Single-URL Onboarding / Team Header**: Lightweight team selector (`Team 1`–`Team 5`) persisted in `localStorage`, plus a session reset option.
2. **D0 Management Challenge & KPI Summary**: Displays the approved D0 executive challenge and the authorized D0 metrics from [`CASE_DATA.json`](./CASE_DATA.json) (`1,000` tested, `80` initial FAIL [`8.0%` vs. `~2.0%` baseline], `60` retest PASS, `20` persistent FAIL, `0` customer shipments/escapes), without revealing recipe splits, J12 defects, or the detailed disposition of the 60 retest-PASS units.
3. **Structured Risk & Decision Workspace**: Selectable risk indicators (`R1`–`R5`) and structured decision choices (`DEC-D0-1` to `DEC-D0-3`) with deterministic English feedback and immediate revision capability.
4. **D0 Management Review & Verbal Progression Gate**: Displays the D0 Management Review approval and D1 transition prompt upon completing D0, instructing the team to wait for the instructor's verbal cue before advancing to D1 (while D1–D8 remain placeholder/locked views until their specifications are approved).
5. **Cumulative 8D Report Preview / Download**: Populates the verified D0 entry in the Cumulative 8D Report with client-side download/print support.

---

## 4. Visual Design System

All application views must adhere to the following visual design principles:

1. **Aesthetic Direction**: Premium, visually engaging industrial consulting aesthetic tailored for electronics manufacturing (PCBA/SMT).
2. **Color Palette**:
   - Light backgrounds for high classroom readability.
   - Deep navy typography for hierarchy and contrast.
   - Teal highlights for interactive elements and analytical focus.
   - Restrained red indicators reserved strictly for genuine risk, defects, and abnormal metrics.
3. **Imagery & Diagrams**: Realistic PCBA/SMT industrial imagery (when authorized) alongside large, legible KPI indicators and technically credible engineering diagrams.
4. **Typography & Copy Density**:
   - Minimal unnecessary text on executive and decision views.
   - Additional explanatory depth permitted on structured teaching-tool screens (e.g., 5W2H, IS/IS NOT, Hypothesis Board).
   - All interfaces and feedback in clear, professional English.
5. **Presentation Alignment**: Visual hierarchy and terminology must maintain strict consistency with the approved **NotebookLM D0 V2** presentation reference.
6. **Usability & Performance**: Responsive, accessible interface for laptops and tablets with zero decorative visual effects that compromise clarity or performance.

---

## 5. Mandatory Development Gates

No discipline (`D0`–`D8`) may be implemented in code until all six gates below are satisfied and recorded in [`PROJECT_STATUS.md`](./PROJECT_STATUS.md):

1. **Approved pedagogical specification**
2. **Approved participant-visible data and evidence**
3. **Defined interaction and decision rules**
4. **Defined deterministic feedback**
5. **Confirmed presentation-to-APP transition**
6. **Explicit implementation authorization**

> **Governance Rule**: Conceptual descriptions in discipline specification files (`PENDING_APPROVAL`) must never be interpreted as authorization to implement. Even when a discipline's specification is approved (such as D0), code implementation requires explicit user authorization.

---

## 6. Technical & Data Integrity Rules

1. **Single Authoritative Dataset**: [`CASE_DATA.json`](./CASE_DATA.json) is the sole source of truth for all numerical and case parameters.
2. **UI Progressive Disclosure & Evidence Gating**:
   - Do not reveal future evidence, reserved causal solutions, or ununlocked discipline details prematurely through normal application navigation.
   - Accept that in a pure client-side static web application, browser DevTools / source inspection cannot guarantee cryptographic secrecy; focus on clean pedagogical gating within the normal user interface.
3. **Arithmetic Consistency**:
   - Historical production: `500 (Original Recipe) + 500 (Modified Recipe) = 1,000` units.
   - Initial functional test failures: `10 + 70 = 80` units (`8.0%` overall vs. `~2.0%` historical baseline).
   - Retest PASS: `5 + 55 = 60` units (`48` released to WIP, `12` held in WIP).
   - Persistent FAIL: `5 + 15 = 20` units (held in Diagnostics).
   - Physical inventory location totals: `748 WIP + 232 Finished Goods + 20 Diagnostics = 1,000` units.
   - Suspect (Modified Recipe) inventory: `398 WIP + 87 Finished Goods + 15 Diagnostics = 500` units.
   - Post-correction validation pilot (D6): `500` **NEW** units (separate from the 500 historical contained units).
4. **Client-Side Persistence & Reproducibility**:
   - Team decisions and verified conclusions must persist reliably in browser `localStorage` and export cleanly into the downloadable Cumulative 8D Report.
   - All feedback and evaluations must be 100% deterministic and reproducible.
5. **Engineering Discipline**:
   - Keep specifications independent of runtime code.
   - Maintain a minimal dependency footprint and avoid unrequested features or infrastructure.
   - Stop and report any specification gap rather than guessing.

