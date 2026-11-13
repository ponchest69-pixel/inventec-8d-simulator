import caseData from '../../specifications/CASE_DATA.json';

export type DisciplineId = 'D0' | 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6' | 'D7' | 'D8';

export interface KPIItem {
  label: string;
  value: string;
  sublabel?: string;
  tone?: 'neutral' | 'risk' | 'teal' | 'warning';
}

export interface EvidenceCardItem {
  id: string;
  title: string;
  badge: string;
  summary: string;
  details: string[];
  progressiveLockedByDefault?: boolean;
}

export interface InteractiveTaskOption {
  value: string;
  label: string;
}

export interface InteractiveTaskField {
  id: string;
  label: string;
  prompt: string;
  options: InteractiveTaskOption[];
  expectedValue: string;
  hintIfIncorrect: string;
}

export interface CheckOption {
  id: string;
  label: string;
  isRequired: boolean;
  hintIfMissed?: string;
  hintIfSelectedWhenIncorrect?: string;
}

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  isExpected: boolean;
  feedbackWhenSelected: string;
}

export interface DisciplineConfig {
  id: DisciplineId;
  shortTitle: string;
  fullTitle: string;
  durationMinutes: number;
  managementChallenge: string;
  kpis: KPIItem[];
  evidenceSectionTitle: string;
  evidenceCards: EvidenceCardItem[];
  interactiveTaskTitle?: string;
  interactiveTaskSubtitle?: string;
  interactiveTasks?: InteractiveTaskField[];
  checkPromptTitle: string;
  checkPromptSubtitle: string;
  checkOptions: CheckOption[];
  decisionPromptTitle: string;
  decisionOptions: DecisionOption[];
  approvedHeadline?: string;
  approvedFeedback: string;
  incompleteChecksFeedbackPrefix: string;
  managementReviewQuote: string;
  reportEntrySummary: {
    caseFacts: string;
    keyFindings: string;
    verifiedDecision: string;
    pendingObligations: string;
    metricsSnapshot: string;
  };
}

const d0 = caseData.d0_public_summary;
const hist = caseData.historical_production;
const inv = caseData.physical_inventory;
const pilot = caseData.conceptual_d6_pilot_validation;

export const CASE_METADATA = caseData.metadata;

export const DISCIPLINES: DisciplineConfig[] = [
  {
    id: 'D0',
    shortTitle: 'Prepare for 8D',
    fullTitle: 'D0 — Prepare for the 8D',
    durationMinutes: CASE_METADATA.workshop.discipline_minutes.D0,
    managementChallenge:
      '“Our production line is experiencing an unusual number of functional test failures. Some boards pass when retested. Should we open a formal 8D investigation? What immediate risks concern you?”',
    kpis: [
      {
        label: 'Units Tested',
        value: d0.total_units_tested.toLocaleString(),
        sublabel: 'In-plant PCBA lot (920 Initial PASS)',
        tone: 'neutral'
      },
      {
        label: 'Initial FAIL',
        value: `${d0.initial_fail_units} (${d0.initial_fail_rate_percent.toFixed(1)}%)`,
        sublabel: `Historical reference: ~${d0.historical_reference_initial_fail_rate_percent.toFixed(1)}%`,
        tone: 'risk'
      },
      {
        label: 'Retest PASS',
        value: `${d0.retest_pass_units} units`,
        sublabel: 'Passed 2nd attempt • Disposition unverified',
        tone: 'warning'
      },
      {
        label: 'Persistent FAIL',
        value: `${d0.persistent_fail_units} units`,
        sublabel: 'Failed initial & retest • 0 shipped',
        tone: 'risk'
      }
    ],
    evidenceSectionTitle: 'Symptom Log Snapshot (Case Facts)',
    evidenceCards: [
      {
        id: 'D0-EV-1',
        title: 'End-of-Line Functional Test Log',
        badge: 'Case Fact',
        summary: '1,000 PCBAs tested: 920 Initial PASS (92.0% FPY) vs. 80 Initial FAIL (8.0%).',
        details: [
          'Historical reference initial failure rate is ~2.0% (~98.0% FPY).',
          'Confirmed customer shipments or external field escapes: 0.'
        ]
      },
      {
        id: 'D0-EV-2',
        title: 'Bench Retest Observation',
        badge: 'Case Fact',
        summary: 'All 80 initial-FAIL boards were retested: 60 Retest PASS, 20 Persistent FAIL.',
        details: [
          'Why 60 boards failed initially and passed on retest is currently unknown.',
          'Current shop-floor location and disposition of the 60 retest-PASS units have not yet been audited.'
        ]
      }
    ],
    checkPromptTitle: 'Step 1: Assess Immediate Symptom & Retest Risks',
    checkPromptSubtitle:
      'Evaluate the symptom data above. Select only the risk conclusions strictly supported by the D0 evidence.',
    checkOptions: [
      {
        id: 'R1',
        label: 'The 8.0% initial failure rate (80/1,000) is 4x the ~2.0% historical baseline, indicating a significant process shift rather than routine variation',
        isRequired: true,
        hintIfMissed: 'Compare the 8.0% initial failure rate (80/1,000) against the ~2.0% historical baseline.'
      },
      {
        id: 'R4',
        label: 'Because 60 boards passed retest, the true defect rate is only 2.0% (20/1,000), confirming the line still meets its ~2.0% historical baseline',
        isRequired: false,
        hintIfSelectedWhenIncorrect: 'Does passing a second test attempt prove the 60 boards had no defect on their first failed test, or does FPY measure initial test performance?'
      },
      {
        id: 'R2',
        label: '60 of the 80 initial-FAIL boards (75%) passed on retest, signaling a potential intermittent failure mode that retesting alone may mask',
        isRequired: true,
        hintIfMissed: 'Consider what 60 out of 80 failing boards passing on a second attempt implies about intermittent behavior.'
      },
      {
        id: 'R5',
        label: 'The 60 retest-PASS results prove the initial failures were false rejects caused by operator test-probe contact',
        isRequired: false,
        hintIfSelectedWhenIncorrect: 'At D0, has any fixture cross-check or physical inspection been performed to prove the 60 retest passes were tester false rejects?'
      },
      {
        id: 'R3',
        label: 'Both the physical failure mechanism and the current shop-floor disposition of the 60 retest-PASS units remain unverified',
        isRequired: true,
        hintIfMissed: 'Check whether the root cause or the downstream status of the 60 retest-PASS boards has been verified yet.'
      }
    ],
    decisionPromptTitle: 'Step 2: Management Gate Decision',
    decisionOptions: [
      {
        id: 'DEC-D0-2',
        label: 'Treat the 20 persistent failures (2.0%) as normal baseline fallout and assign a test technician to troubleshoot only those 20 boards locally',
        description: 'Handles only persistent failures via routine bench repair without opening a formal 8D.',
        isExpected: false,
        feedbackWhenSelected:
          'Hint: Focusing only on the 20 persistent failures ignores why initial failures quadrupled to 80 units (8.0%) and leaves the 60 retest-PASS boards uninvestigated.'
      },
      {
        id: 'DEC-D0-1',
        label: 'Open a formal cross-functional 8D investigation to bound the 8.0% initial failure spike and audit both persistent-FAIL and retest-PASS populations',
        description: 'Initiates structured 8D containment and root-cause analysis across assembly, test, and inventory.',
        isExpected: true,
        feedbackWhenSelected:
          'Approved. The 4x spike in initial failures (8.0% vs. ~2.0%) combined with 60 unverified retest-PASS boards requires a formal cross-functional 8D.'
      },
      {
        id: 'DEC-D0-3',
        label: 'Keep production running under standard shift monitoring and collect another 1,000-unit lot before deciding whether to open an 8D',
        description: 'Delays formal investigation until additional production lots are built.',
        isExpected: false,
        feedbackWhenSelected:
          'Hint: With an 8.0% initial failure rate (4x baseline) and 60 boards exhibiting intermittent pass/fail behavior, delaying action risks accumulating more suspect inventory.'
      }
    ],
    approvedFeedback:
      'D0 Verified. Formal 8D opened based on the 8.0% initial failure spike (vs. ~2.0% baseline), 60 unverified retest-PASS units, and 20 persistent failures.',
    incompleteChecksFeedbackPrefix:
      'Re-evaluate your Step 1 risk assessment against the End-of-Line Functional Test Log and Bench Retest Observation.',
    managementReviewQuote:
      '“I approve opening an 8D investigation. Who should be involved, and who will be accountable for delivering results?”',
    reportEntrySummary: {
      caseFacts:
        '1,000 PCBAs tested: 920 Initial PASS (92.0% FPY), 80 Initial FAIL (8.0% vs. ~2.0% historical baseline), 60 Retest PASS (disposition unverified), 20 Persistent FAIL, 0 customer shipments.',
      keyFindings:
        'Initial failure rate quadrupled (8.0% vs. ~2.0% baseline); 60/80 failing boards passed retest, indicating an intermittent risk whose downstream disposition is not yet audited.',
      verifiedDecision:
        'Opened formal cross-functional 8D investigation.',
      pendingObligations:
        'Charter cross-functional D1 team, stratify failure sequence in D2, and audit inventory/retest disposition in D3.',
      metricsSnapshot: '1,000 Tested | 80 Initial FAIL (8.0% vs ~2.0%) | 60 Retest PASS | 20 Persistent FAIL | 0 Shipped'
    }
  },
  {
    id: 'D1',
    shortTitle: 'Establish Team',
    fullTitle: 'D1 — Establish the Team',
    durationMinutes: CASE_METADATA.workshop.discipline_minutes.D1,
    managementChallenge:
      '“I approve opening an 8D investigation. Which functions must be on the core team to cover every operational touchpoint, and how will single-point accountability be structured?”',
    kpis: [
      {
        label: 'Operational Scope',
        value: '4 Plant Touchpoints',
        sublabel: 'Assembly • Test • Inventory • Governance',
        tone: 'neutral'
      },
      {
        label: 'Symptom Profile',
        value: 'Intermittent + Persistent',
        sublabel: '60 Retest PASS • 20 Persistent FAIL',
        tone: 'warning'
      },
      {
        label: 'Customer Exposure',
        value: '0 Units Shipped',
        sublabel: 'All 1,000 units remain in-plant',
        tone: 'teal'
      }
    ],
    evidenceSectionTitle: 'Operational Touchpoint Brief',
    evidenceCards: [
      {
        id: 'D1-EV-1',
        title: 'PCBA Value-Stream Touchpoints',
        badge: 'Operations',
        summary: 'The 1,000 boards moved through automated board assembly, end-of-line functional test/retest, and internal WIP/warehouse routing.',
        details: [
          'Touchpoint 1: Automated PCB surface-mount assembly and thermal soldering.',
          'Touchpoint 2: End-of-line functional test fixtures, diagnostic benches, and retest logs.',
          'Touchpoint 3: Shop-floor WIP routing, finished goods storage, and quarantine holds.',
          'Touchpoint 4: Plant quality standards, retest release rules, and 8D gate governance.'
        ]
      }
    ],
    interactiveTaskTitle: 'Step 1A: Define Team Accountability & Functional Coverage',
    interactiveTaskSubtitle: 'Complete the charter justification for leadership accountability and cross-functional scope.',
    interactiveTasks: [
      {
        id: 'D1-T1',
        label: '1. Single-Point Team Leadership',
        prompt: 'Who should hold primary accountability for coordinating the 8D deliverables and gate reviews?',
        options: [
          { value: '', label: '-- Select Leadership Structure --' },
          { value: 'LEAD-ROT', label: 'Rotating shift-by-shift committee leadership shared equally across all plant departments' },
          { value: 'LEAD-QE', label: 'Designated Quality Engineering 8D Leader with named owners from each technical/material function' },
          { value: 'LEAD-TECH', label: 'Functional test bench technician acting independently until tester hardware is cleared' }
        ],
        expectedValue: 'LEAD-QE',
        hintIfIncorrect: 'Effective 8D governance requires one designated Team Leader with cross-functional authority rather than rotating or siloed ownership.'
      },
      {
        id: 'D1-T2',
        label: '2. Justification of Functional Scope',
        prompt: 'Why must both manufacturing process and material-control functions join Quality and Test on the core team?',
        options: [
          { value: '', label: '-- Select Functional Coverage Justification --' },
          { value: 'COV-TEST', label: 'Only to witness functional test bench recalibration and sign off on tester software updates' },
          { value: 'COV-FULL', label: 'Because the physical cause may originate in board assembly AND 1,000 units (including 60 retest-PASS) must be traced and isolated across WIP/FG' },
          { value: 'COV-SHIP', label: 'To coordinate external customer field service recalls and freight carrier claims' }
        ],
        expectedValue: 'COV-FULL',
        hintIfIncorrect: 'Consider both the unknown assembly/test origin of the 80 failures and the need to locate/contain all 1,000 boards in plant inventory.'
      }
    ],
    checkPromptTitle: 'Step 1B: Select Core 8D Investigation Team Functions',
    checkPromptSubtitle: 'Select the four internal plant functions required for the core D1–D8 investigation team.',
    checkOptions: [
      {
        id: 'D1-C1',
        label: 'Quality Engineering',
        isRequired: true,
        hintIfMissed: 'Include the function responsible for quality governance, retest rules, and 8D gate verification.'
      },
      {
        id: 'D1-C5',
        label: 'R&D Bare-Board PCB Layout & Schematic Design Group',
        isRequired: false,
        hintIfSelectedWhenIncorrect: 'Is there any evidence of a bare-board schematic redesign, or should the core team focus first on the active plant assembly, test, and inventory functions?'
      },
      {
        id: 'D1-C2',
        label: 'SMT / Manufacturing Process Engineering',
        isRequired: true,
        hintIfMissed: 'Include the engineering function that owns the PCBA assembly line and soldering parameters.'
      },
      {
        id: 'D1-C6',
        label: 'Customer Field Warranty & External Return Logistics',
        isRequired: false,
        hintIfSelectedWhenIncorrect: 'Check D0 customer exposure (0 units shipped). External field warranty return logistics is not an active touchpoint.'
      },
      {
        id: 'D1-C3',
        label: 'Test & Diagnostics Engineering',
        isRequired: true,
        hintIfMissed: 'Include the engineering function that owns the functional test stations, fixtures, and retest logs.'
      },
      {
        id: 'D1-C7',
        label: 'Outbound Freight Forwarding & Customs Brokerage',
        isRequired: false,
        hintIfSelectedWhenIncorrect: 'All 1,000 units remain inside the plant; internal Production & Material Control manages in-plant WIP and warehouse holds.'
      },
      {
        id: 'D1-C4',
        label: 'Production & Material Control',
        isRequired: true,
        hintIfMissed: 'Include the operational function that controls WIP movement, Finished Goods inventory, and physical quarantine holds.'
      }
    ],
    decisionPromptTitle: 'Step 2: Authorize the D1 Team Charter',
    decisionOptions: [
      {
        id: 'DEC-D1-2',
        label: 'Assign the investigation to Test & Diagnostics and R&D Design Engineering first, adding Production and SMT only after root cause is proven',
        description: 'Defers manufacturing process and material control participation until later disciplines.',
        isExpected: false,
        feedbackWhenSelected:
          'Hint: Can D2 stratification and D3 in-plant inventory containment succeed if Production/Material Control and SMT Process Engineering are excluded until after D4?'
      },
      {
        id: 'DEC-D1-1',
        label: 'Charter a cross-functional core team (Quality, SMT Process, Test & Diagnostics, Production & Material Control) under one accountable 8D Team Leader with defined functional owners',
        description: 'Aligns single-point leadership with full technical and inventory coverage across all four plant touchpoints.',
        isExpected: true,
        feedbackWhenSelected:
          'Approved. One accountable 8D Team Leader coordinating Quality, SMT Process, Test & Diagnostics, and Production/Material Control covers assembly, test, inventory traceability, and governance.'
      },
      {
        id: 'DEC-D1-3',
        label: 'Include all plant departments under shared co-leadership so every manager has equal sign-off authority without a single Team Leader',
        description: 'Creates a broad committee with diffused accountability.',
        isExpected: false,
        feedbackWhenSelected:
          'Hint: Diffused co-leadership without a single accountable 8D Team Leader slows containment and blurs responsibility for deliverables.'
      }
    ],
    approvedFeedback:
      'D1 Verified. Cross-functional team chartered under one accountable 8D Team Leader with Quality, SMT Process, Test & Diagnostics, and Production & Material Control.',
    incompleteChecksFeedbackPrefix:
      'Review the PCBA Value-Stream Touchpoints and refine your functional team selections and charter justification.',
    managementReviewQuote:
      '“The team is in place. In D2, stratify the data and construct a factual 5W2H / IS–IS NOT problem statement based strictly on observed evidence.”',
    reportEntrySummary: {
      caseFacts:
        'All 1,000 PCBAs remain in-plant across four operational touchpoints: SMT assembly, functional test/retest, WIP/FG storage, and quality governance.',
      keyFindings:
        'Core cross-functional coverage requires Quality Engineering (Lead), SMT Process Engineering, Test & Diagnostics Engineering, and Production & Material Control.',
      verifiedDecision:
        'Chartered cross-functional 8D team under a single accountable Quality Engineering Team Leader with named functional owners.',
      pendingObligations:
        'Complete D2 production-interval stratification and 5W2H / IS–IS NOT problem definition.',
      metricsSnapshot: 'Core Functions: Quality (Lead) | SMT Process | Test & Diagnostics | Production & Material Control'
    }
  },
  {
    id: 'D2',
    shortTitle: 'Describe Problem',
    fullTitle: 'D2 — Describe the Problem',
    durationMinutes: CASE_METADATA.workshop.discipline_minutes.D2,
    managementChallenge:
      '“How is the 8% failure rate distributed across our 1,000 boards? Construct a factual 5W2H and IS / IS NOT problem description—without jumping to unverified root-cause assumptions.”',
    kpis: [
      {
        label: 'Interval 1 (001–500)',
        value: `${hist.by_recipe.original_recipe.initial_fail} FAIL (2.0%)`,
        sublabel: `${hist.by_recipe.original_recipe.fpy_percent.toFixed(1)}% FPY • 5 Retest PASS • 5 Persistent`,
        tone: 'teal'
      },
      {
        label: 'Interval 2 (501–1,000)',
        value: `${hist.by_recipe.modified_recipe.initial_fail} FAIL (14.0%)`,
        sublabel: `${hist.by_recipe.modified_recipe.fpy_percent.toFixed(1)}% FPY • 55 Retest PASS • 15 Persistent`,
        tone: 'risk'
      },
      {
        label: 'Failure Concentration',
        value: '70 / 80 (87.5%)',
        sublabel: 'Concentrated in Interval 2 (Units 501–1,000)',
        tone: 'warning'
      }
    ],
    evidenceSectionTitle: '5W2H & Boundary Inspection Records',
    evidenceCards: [
      {
        id: 'D2-EV-1',
        title: 'Production-Interval Stratification Log',
        badge: 'Sequence Data',
        summary: 'Units 001–500: 490 PASS, 10 FAIL (98.0% FPY) • Units 501–1,000: 430 PASS, 70 FAIL (86.0% FPY).',
        details: [
          'Interval 1 (Units 001–500): 10 initial FAIL (2.0%) = 5 retest PASS + 5 persistent FAIL (matches ~2.0% historical baseline).',
          'Interval 2 (Units 501–1,000): 70 initial FAIL (14.0%) = 55 retest PASS + 15 persistent FAIL (87.5% of all initial failures).'
        ]
      },
      {
        id: 'D2-EV-2',
        title: 'Boundary Check (5W2H / IS – IS NOT)',
        badge: '5W2H Log',
        progressiveLockedByDefault: true,
        summary: 'Abnormal failure surge is bounded to Interval 2 at in-plant functional test; 0 customer escapes.',
        details: [
          'IS Observed: Abnormal 14.0% initial FAIL surge (86.0% FPY) in Interval 2 (Units 501–1,000) at end-of-line functional test.',
          'IS NOT Observed: Abnormal surge in Interval 1 (Units 001–500 had 10 baseline failures [2.0%], NOT the 14.0% surge); Customer site failures (0 shipped).',
          'Methodological Boundary: Specific component, solder, fixture, or process causes remain untested hypotheses until D4.'
        ]
      }
    ],
    interactiveTaskTitle: 'Step 1A: Construct the 5W2H & IS / IS NOT Problem Definition',
    interactiveTaskSubtitle: 'Complete each factual boundary element using the inspected stratification and 5W2H records.',
    interactiveTasks: [
      {
        id: 'D2-T1',
        label: '1. WHAT (Observed Symptom & Retest Split)',
        prompt: 'What exact symptom and test outcome distribution are documented across the 1,000 PCBAs?',
        options: [
          { value: '', label: '-- Select WHAT Clause --' },
          { value: 'WHAT-20', label: '20 total functional test failures (2.0%) after clearing 60 passing boards as non-defective' },
          { value: 'WHAT-80', label: '80 initial functional test failures (8.0%): 60 retest PASS and 20 persistent FAIL (920 initial PASS)' },
          { value: 'WHAT-J12', label: '80 connector J12 solder joint fractures caused by thermal reflow profile drift' }
        ],
        expectedValue: 'WHAT-80',
        hintIfIncorrect: 'Keep initial FAIL (80), retest PASS (60), and persistent FAIL (20) distinct, and do not insert unverified physical causes in D2.'
      },
      {
        id: 'D2-T2',
        label: '2. WHEN & EXTENT (Production-Interval Concentration)',
        prompt: 'How did First Pass Yield and failure counts shift between the two 500-unit intervals?',
        options: [
          { value: '', label: '-- Select WHEN & EXTENT Clause --' },
          { value: 'EXT-SHIFT', label: 'Interval 1 (001–500): 10 FAIL (2.0%, 98.0% FPY; 5 retest PASS, 5 persistent) -> Interval 2 (501–1,000): 70 FAIL (14.0%, 86.0% FPY; 55 retest PASS, 15 persistent)' },
          { value: 'EXT-UNIF', label: 'Uniform 8.0% failure rate (~40 failures per 500-unit interval) across all 1,000 units' },
          { value: 'EXT-ZERO', label: '0 failures in Interval 1 (100% FPY) followed by 80 failures in Interval 2 (84.0% FPY)' }
        ],
        expectedValue: 'EXT-SHIFT',
        hintIfIncorrect: 'Check the Production-Interval Stratification Log for the exact counts in Units 001–500 (10 FAIL) vs. Units 501–1,000 (70 FAIL).'
      },
      {
        id: 'D2-T3',
        label: '3. IS vs. IS NOT (Interval 1 Boundary Comparison)',
        prompt: 'How should Interval 1 (Units 001–500) be stated in the IS / IS NOT comparison?',
        options: [
          { value: '', label: '-- Select IS NOT Boundary Interpretation --' },
          { value: 'ISNOT-ZERO', label: 'Failures are IS NOT observed in Interval 1 because Units 001–500 had zero defects' },
          { value: 'ISNOT-BASE', label: 'Interval 1 had 10 failures (2.0% baseline FPY 98.0%); what IS NOT observed in Interval 1 is the abnormal 14.0% surge (70 FAIL) seen in Interval 2' },
          { value: 'ISNOT-RETEST', label: 'Retest-PASS boards are IS NOT observed in Interval 1 (all 60 occurred in Interval 2)' }
        ],
        expectedValue: 'ISNOT-BASE',
        hintIfIncorrect: 'Note that Interval 1 had 10 initial failures (5 retest PASS, 5 persistent)—it matched the ~2.0% baseline, whereas the abnormal 14.0% surge occurred in Interval 2.'
      },
      {
        id: 'D2-T4',
        label: '4. WHERE (Detection vs. Customer Boundary)',
        prompt: 'Where is the problem observed versus NOT observed?',
        options: [
          { value: '', label: '-- Select WHERE Boundary --' },
          { value: 'WHERE-CUST', label: 'IS observed at both in-plant functional test and customer receiving inspection' },
          { value: 'WHERE-PLANT', label: 'IS observed at in-plant end-of-line functional test; IS NOT observed at customer sites (0 shipments / 0 escapes)' },
          { value: 'WHERE-ICT', label: 'IS observed at bare-board incoming inspection; IS NOT observed at functional test' }
        ],
        expectedValue: 'WHERE-PLANT',
        hintIfIncorrect: 'Check the Boundary Check record for where the failures were detected and whether any units were shipped.'
      }
    ],
    checkPromptTitle: 'Step 1B: Verify Factual Observations vs. Premature Assumptions',
    checkPromptSubtitle: 'Inspect all D2 records above, then select ONLY the verified factual statements.',
    checkOptions: [
      {
        id: 'D2-C1',
        label: 'Units 001–500 recorded 10 initial FAIL (98.0% FPY: 5 retest PASS, 5 persistent FAIL), matching the ~2.0% historical baseline',
        isRequired: true,
        hintIfMissed: 'Check the Interval 1 metrics in the Production-Interval Stratification Log.'
      },
      {
        id: 'D2-C4',
        label: 'The 14.0% failure surge in Units 501–1,000 was caused by an unvalidated SMT reflow profile change',
        isRequired: false,
        hintIfSelectedWhenIncorrect: 'In D2, process or physical causes have not yet been tested—keep causal hypotheses for D4.'
      },
      {
        id: 'D2-C2',
        label: 'Units 501–1,000 recorded 70 initial FAIL (86.0% FPY: 55 retest PASS, 15 persistent FAIL), representing 87.5% (70/80) of all initial failures',
        isRequired: true,
        hintIfMissed: 'Check the Interval 2 metrics and failure concentration share (70/80 = 87.5%).'
      },
      {
        id: 'D2-C5',
        label: 'Functional test fixture probe wear after Unit 500 caused the 55 retest-PASS results in Interval 2',
        isRequired: false,
        hintIfSelectedWhenIncorrect: 'Fixture drift is a candidate hypothesis for D4, not a verified D2 observation.'
      },
      {
        id: 'D2-C3',
        label: 'All 80 initial failures were detected at in-plant functional test with 0 confirmed customer shipments',
        isRequired: true,
        hintIfMissed: 'Verify the detection location and customer shipment count in the Boundary Check record.'
      }
    ],
    decisionPromptTitle: 'Step 2: Approve the Factual D2 Problem Statement',
    decisionOptions: [
      {
        id: 'DEC-D2-2',
        label: 'At in-plant functional test, Units 001–500 operated without abnormality while Units 501–1,000 experienced 15 confirmed failures (97.0% net yield after 55 boards passed retest).',
        description: 'Counts only persistent failures in Interval 2 and omits the 55 retest-PASS units from the problem scope.',
        isExpected: false,
        feedbackWhenSelected:
          'Hint: Omitting the 55 retest-PASS boards in Interval 2 hides the 86.0% FPY drop (70 initial FAIL) and ignores the intermittent failure population.'
      },
      {
        id: 'DEC-D2-1',
        label: 'At in-plant PCBA functional test across 1,000 units, initial failures rose from 10/500 (2.0%, 98.0% FPY; 5 retest PASS, 5 persistent FAIL) in Units 001–500 to 70/500 (14.0%, 86.0% FPY; 55 retest PASS, 15 persistent FAIL) in Units 501–1,000, with 0 customer shipments.',
        description: 'Quantifies What, Where, When, and Extent from observed data without embedding untested causes.',
        isExpected: true,
        feedbackWhenSelected:
          'Approved. This problem statement accurately bounds the shift between Interval 1 (98.0% FPY) and Interval 2 (86.0% FPY) and keeps initial FAIL, retest PASS, and persistent FAIL distinct.'
      },
      {
        id: 'DEC-D2-3',
        label: 'Across 1,000 PCBAs, 70 boards in Units 501–1,000 failed functional test (86.0% FPY) due to a process parameter change in SMT assembly after Unit 500.',
        description: 'Combines the Interval 2 failure count with an unverified process cause.',
        isExpected: false,
        feedbackWhenSelected:
          'Hint: A D2 problem statement must state observable facts (What, Where, When, Extent) without assuming why the surge happened before D4.'
      }
    ],
    approvedFeedback:
      'D2 Verified. Factual 5W2H and IS / IS NOT problem statement established: Interval 1 recorded 10 initial FAIL (98.0% FPY) while Interval 2 surged to 70 initial FAIL (86.0% FPY; 55 retest PASS, 15 persistent FAIL), with 0 customer escapes.',
    incompleteChecksFeedbackPrefix:
      'Complete all 5W2H / IS–IS NOT builder fields in Step 1A and verify your factual selections in Step 1B.',
    managementReviewQuote:
      '“We now see that 70 of the 80 initial failures occurred in the second 500-unit interval. In D3, audit where all 1,000 boards are located and define our Interim Containment Actions.”',
    reportEntrySummary: {
      caseFacts:
        'Interval 1 (001–500): 490 PASS, 10 initial FAIL (98.0% FPY; 5 retest PASS, 5 persistent FAIL). Interval 2 (501–1,000): 430 PASS, 70 initial FAIL (86.0% FPY; 55 retest PASS, 15 persistent FAIL). 0 customer shipments.',
      keyFindings:
        '87.5% of initial failures (70/80) and 91.7% of retest-PASS units (55/60) are concentrated in Interval 2 (Units 501–1,000). Interval 1 had baseline failures (10 FAIL = 2.0%), not the abnormal 14.0% surge.',
      verifiedDecision:
        'Approved factual 5W2H / IS–IS NOT problem statement bounding the abnormality to Interval 2 without causal assumptions.',
      pendingObligations:
        'Trace physical locations of all 1,000 units and isolate suspect populations in D3.',
      metricsSnapshot: 'Interval 1: 10 FAIL (98.0% FPY) | Interval 2: 70 FAIL (86.0% FPY; 55 Retest PASS, 15 Persistent)'
    }
  },
  {
    id: 'D3',
    shortTitle: 'Containment (ICA)',
    fullTitle: 'D3 — Interim Containment Actions',
    durationMinutes: CASE_METADATA.workshop.discipline_minutes.D3,
    managementChallenge:
      '“All 1,000 boards remain inside our facility across WIP, Finished Goods, and Diagnostics. Audit the warehouse and WIP trace records to determine which populations are at risk, how they must be isolated, and how physical containment execution will be verified.”',
    kpis: [
      {
        label: 'Total WIP Inventory',
        value: `${inv.totals.wip} units`,
        sublabel: '350 Interval 1 • 398 Interval 2',
        tone: 'neutral'
      },
      {
        label: 'Total Finished Goods',
        value: `${inv.totals.finished_goods} units`,
        sublabel: '145 Interval 1 • 87 Interval 2',
        tone: 'neutral'
      },
      {
        label: 'Total Diagnostics',
        value: `${inv.totals.diagnostics} units`,
        sublabel: '5 Interval 1 • 15 Interval 2',
        tone: 'risk'
      },
      {
        label: 'Retest-PASS Subset',
        value: '60 inside WIP',
        sublabel: 'Inspect WIP Audit record below',
        tone: 'warning'
      }
    ],
    evidenceSectionTitle: 'Inventory & Retest Disposition Trace',
    evidenceCards: [
      {
        id: 'D3-EV-1',
        title: 'Physical Inventory Trace by Production Interval (1,000 Units)',
        badge: 'Warehouse Trace',
        summary: '748 WIP + 232 Finished Goods + 20 Diagnostics = 1,000 units in plant (0 customer shipments).',
        details: [
          'Interval 1 (Units 001–500): 350 WIP + 145 Finished Goods + 5 Diagnostics = 500 units.',
          'Interval 2 (Units 501–1,000): 398 WIP + 87 Finished Goods + 15 Diagnostics = 500 units.'
        ]
      },
      {
        id: 'D3-EV-2',
        title: 'WIP Audit: Disposition of the 60 Retest-PASS Units',
        badge: 'WIP Audit',
        progressiveLockedByDefault: true,
        summary: 'Of the 60 retest-PASS units, 48 were released back into normal WIP flow and 12 remained held in WIP.',
        details: [
          'Interval 1 (5 retest-PASS): 3 released into WIP + 2 held in WIP.',
          'Interval 2 (55 retest-PASS): 45 released into WIP + 10 held in WIP.',
          'Reconciliation Rule: All 60 retest-PASS units (48 released + 12 held) are a subset already counted inside the 748 total WIP (350 and 398)—do not double count.'
        ]
      }
    ],
    interactiveTaskTitle: 'Step 1A: Reconcile Suspect Inventory & Containment Verification Controls',
    interactiveTaskSubtitle: 'Specify the exact populations, reconciliation math, and physical verification requirements.',
    interactiveTasks: [
      {
        id: 'D3-T1',
        label: '1. Suspect Interval 2 Lot Breakdown',
        prompt: 'What is the exact location breakdown of the 500 units produced in suspect Interval 2 (Units 501–1,000)?',
        options: [
          { value: '', label: '-- Select Interval 2 Inventory Breakdown --' },
          { value: 'INT2-748', label: '748 WIP + 232 Finished Goods + 20 Diagnostics = 1,000 suspect Interval 2 units' },
          { value: 'INT2-500', label: '398 WIP + 87 Finished Goods + 15 Diagnostics = 500 suspect Interval 2 units' },
          { value: 'INT2-87', label: '87 Finished Goods + 15 Diagnostics = 102 suspect Interval 2 units (WIP excluded)' }
        ],
        expectedValue: 'INT2-500',
        hintIfIncorrect: 'Check the Physical Inventory Trace card for the exact Interval 2 breakdown (398 WIP, 87 FG, 15 Diagnostics).'
      },
      {
        id: 'D3-T2',
        label: '2. Retest-PASS Reconciliation (No Double Counting)',
        prompt: 'How are the 60 retest-PASS units distributed and accounted for relative to the 748 WIP total?',
        options: [
          { value: '', label: '-- Select Retest-PASS Reconciliation --' },
          { value: 'RET-EXTRA', label: '60 additional units stored outside WIP, bringing total plant inventory to 1,060 units' },
          { value: 'RET-SUBSET', label: '48 released into WIP (3 Int. 1, 45 Int. 2) + 12 held in WIP (2 Int. 1, 10 Int. 2) = 60 units already included inside the 748 WIP total' },
          { value: 'RET-FG', label: '48 shipped to customers and 12 stored in Finished Goods' }
        ],
        expectedValue: 'RET-SUBSET',
        hintIfIncorrect: 'Inspect the WIP Audit record: all 60 retest-PASS units (48 released + 12 held) are already counted within the 350 and 398 WIP totals.'
      },
      {
        id: 'D3-T3',
        label: '3. Plan Approval vs. Physically Verified Containment',
        prompt: 'What is required to move containment from an approved decision to physically verified execution?',
        options: [
          { value: '', label: '-- Select Verification Requirement --' },
          { value: 'VER-PHYS', label: 'Physical quarantine hold tags, electronic MES routing blocks on serial numbers, and a reconciled physical count audit' },
          { value: 'VER-EMAIL', label: 'Sending a shift-handover email announcing the containment decision is sufficient to certify physical execution' },
          { value: 'VER-SCRAP', label: 'Immediately scrapping all 500 Interval 2 units before D4 root-cause analysis begins' }
        ],
        expectedValue: 'VER-PHYS',
        hintIfIncorrect: 'Distinguish an approved containment plan from verified physical execution: physical tags, MES routing locks, and count reconciliation are required.'
      }
    ],
    checkPromptTitle: 'Step 1B: Select Required Interim Containment Actions',
    checkPromptSubtitle: 'Inspect both inventory records above, then select the required containment controls.',
    checkOptions: [
      {
        id: 'D3-C1',
        label: 'Quarantine all 500 units from suspect Interval 2 across WIP (398), Finished Goods (87), and Diagnostics (15) under Production & Material Control ownership',
        isRequired: true,
        hintIfMissed: 'Include full quarantine of the 500 units from suspect Interval 2 (398 WIP, 87 FG, 15 Diagnostics).'
      },
      {
        id: 'D3-C5',
        label: 'Issue an external customer field recall notice for shipped Interval 2 units',
        isRequired: false,
        hintIfSelectedWhenIncorrect: 'All 1,000 units (748 WIP + 232 FG + 20 Diagnostics) remain in the plant with 0 customer shipments.'
      },
      {
        id: 'D3-C2',
        label: 'Trace and isolate all 48 released retest-PASS units in WIP (45 in Interval 2 and 3 in Interval 1) alongside the 12 already held',
        isRequired: true,
        hintIfMissed: 'Check the WIP Audit record: 48 retest-PASS units (3 in Interval 1, 45 in Interval 2) were released into WIP and must be isolated.'
      },
      {
        id: 'D3-C3',
        label: 'Enforce an immediate shop-floor and MES stop prohibiting release of any initial-FAIL board after a retest PASS',
        isRequired: true,
        hintIfMissed: 'Include an immediate movement block preventing any initial-FAIL board from entering WIP on a retest PASS.'
      },
      {
        id: 'D3-C6',
        label: 'Leave the 48 released retest-PASS units moving in WIP since they passed their second functional test',
        isRequired: false,
        hintIfSelectedWhenIncorrect: 'Passing a retest does not explain why those 48 boards failed their initial test—leaving them in active WIP risks downstream escape.'
      },
      {
        id: 'D3-C4',
        label: 'Require physical hold-tag audit and serial-number count reconciliation before marking physical containment verified',
        isRequired: true,
        hintIfMissed: 'Include physical hold verification and serial-number reconciliation so containment is verified, not merely planned.'
      }
    ],
    decisionPromptTitle: 'Step 2: Authorize the D3 Interim Containment Plan',
    decisionOptions: [
      {
        id: 'DEC-D3-2',
        label: 'Quarantine the 87 Finished Goods and 15 Diagnostics units from Interval 2, while allowing the 398 Interval 2 WIP units to continue assembly until final pack-out',
        description: 'Contains warehouse stock only while leaving suspect WIP moving on the shop floor.',
        isExpected: false,
        feedbackWhenSelected:
          'Hint: Leaving 398 Interval 2 units (including 45 released retest-PASS units) moving in WIP risks mixing suspect boards into downstream assembly.'
      },
      {
        id: 'DEC-D3-1',
        label: 'Quarantine all 500 Interval 2 units (398 WIP, 87 FG, 15 Diagnostics), isolate all 48 released retest-PASS units in WIP (plus the 12 held), block retest-only releases, and verify via physical hold audit',
        description: 'Contains the entire suspect interval and all 60 retest-PASS units with traceability and physical verification controls.',
        isExpected: true,
        feedbackWhenSelected:
          'Approved. This plan isolates the 500-unit suspect interval (398 WIP, 87 FG, 15 Diagnostics) and all 60 retest-PASS units (48 released + 12 held inside WIP), blocks retest-only release, and mandates physical hold verification.'
      },
      {
        id: 'DEC-D3-3',
        label: 'Isolate the 45 released retest-PASS units in Interval 2 WIP and the 20 persistent-FAIL boards in Diagnostics, but leave the remaining Interval 2 WIP (343) and FG (87) unrestricted',
        description: 'Contains only boards that failed initial test while leaving the rest of suspect Interval 2 unrestricted.',
        isExpected: false,
        feedbackWhenSelected:
          'Hint: With an intermittent failure mode in Interval 2 (86.0% FPY), boards from the same suspect 500-unit interval in WIP (398) and FG (87) must be quarantined until root cause is known.'
      }
    ],
    approvedFeedback:
      'D3 Verified. Interim Containment Plan approved: 500 Interval 2 units (398 WIP, 87 FG, 15 Diagnostics) and all 60 retest-PASS units (48 released + 12 held in WIP) are placed under quarantine hold with retest-only release blocked.',
    incompleteChecksFeedbackPrefix:
      'Complete the inventory reconciliation tasks in Step 1A and verify all required containment controls in Step 1B.',
    managementReviewQuote:
      '“Suspect inventory is isolated under containment hold. Proceed to D4 and use the 4-stage investigation lab to prove the Physical, Occurrence, Potential Escape, and Systemic root causes.”',
    reportEntrySummary: {
      caseFacts:
        'In-plant inventory (1,000 units, 0 shipped): 748 WIP (350 Int. 1 + 398 Int. 2), 232 FG (145 Int. 1 + 87 Int. 2), 20 Diagnostics (5 Int. 1 + 15 Int. 2). 60 Retest-PASS units inside WIP = 48 released (3 Int. 1, 45 Int. 2) + 12 held (2 Int. 1, 10 Int. 2).',
      keyFindings:
        '48 retest-PASS units had been released back into active WIP without investigating their initial FAIL. All 60 retest-PASS units are a subset inside the 748 WIP total.',
      verifiedDecision:
        'Approved ICA to quarantine all 500 Interval 2 units (398 WIP, 87 FG, 15 Diagnostics), isolate all 48 released + 12 held retest-PASS units in WIP, and block retest-only release.',
      pendingObligations:
        'Maintain quarantine hold on the 500 Interval 2 units and 60 retest-PASS units until D4 root cause is proven and physical rework/disposition is executed.',
      metricsSnapshot: 'Quarantined Interval 2: 398 WIP + 87 FG + 15 Diag = 500 | Retest-PASS Isolated in WIP: 48 Released + 12 Held = 60'
    }
  },
  {
    id: 'D4',
    shortTitle: 'Root Cause (RCA)',
    fullTitle: 'D4 — Root Cause Analysis',
    durationMinutes: CASE_METADATA.workshop.discipline_minutes.D4,
    managementChallenge:
      '“Multiple hypotheses are on the table: test fixture drift, component lots, firmware, connector soldering, thermal reflow parameters, or governance rules. Inspect laboratory records E01–E08 and E06-B to prove what caused the failure, why it occurred, and how retest units were released.”',
    kpis: [
      {
        label: 'Stage A: Hypotheses',
        value: '6 Manufacturing',
        sublabel: 'Filter out out-of-scope claims',
        tone: 'neutral'
      },
      {
        label: 'Stage B: Lab Records',
        value: '9 Evidence Files',
        sublabel: 'E01–E08 + E06-B gated inspection',
        tone: 'teal'
      },
      {
        label: 'Stages C & D: RCA',
        value: '4 Causal Layers',
        sublabel: 'Physical • Occurrence • Escape • Systemic',
        tone: 'warning'
      }
    ],
    evidenceSectionTitle: 'Interactive 4-Stage Root Cause Investigation',
    evidenceCards: [],
    checkPromptTitle: '',
    checkPromptSubtitle: '',
    checkOptions: [],
    decisionPromptTitle: '',
    decisionOptions: [],
    approvedFeedback:
      'D4 Verified. All four root-cause layers (Physical, Occurrence, Potential Escape, and Systemic) and their supporting laboratory evidence (E01–E08, E06-B) are verified.',
    incompleteChecksFeedbackPrefix: '',
    managementReviewQuote:
      '“The root causes are proven by laboratory and process evidence. In D5, classify candidate actions A1–A6 and build our Permanent Corrective Action plan.”',
    reportEntrySummary: {
      caseFacts:
        'E01 (5/5 fail both fixtures), E02 (shared component lots), E03 (FW-3.2.1 unchanged), E04 (J12 solder anomaly in 17/20 FAIL vs. 1/20 PASS), E05 (unvalidated reflow recipe change before Unit 501), E06 (10/10 pass after J12 Pin 4 solder repair), E06-B (8/30 J12 defects with modified recipe vs. 0/30 with restored validated recipe), E07 (48 retest-PASS released into WIP without RCA), E08 (missing retest & recipe validation governance).',
      keyFindings:
        'Rejected H1 (fixture), H2 (component lots), and H3 (firmware). Confirmed H4 (J12 Pin 4 insufficient solder), H5 (unvalidated reflow recipe modification), and H6 (retest release & change-control governance gaps).',
      verifiedDecision:
        'Verified 4-layer RCA: Physical (insufficient solder at J12 terminal 4), Occurrence (unvalidated thermal reflow recipe change), Potential Escape (release into WIP after retest PASS without investigating original FAIL), Systemic (insufficient change control, independent validation, and retest disposition instructions).',
      pendingObligations:
        'Select and map Permanent Corrective Actions (PCAs) and complementary disposition actions in D5.',
      metricsSnapshot: 'E04: 17/20 vs 1/20 | E06: 10/10 Repair Pass | E06-B: 8/30 Modified vs 0/30 Restored | E07: 48 Released'
    }
  },
  {
    id: 'D5',
    shortTitle: 'Corrective Actions',
    fullTitle: 'D5 — Permanent Corrective Actions (PCA)',
    durationMinutes: CASE_METADATA.workshop.discipline_minutes.D5,
    managementChallenge:
      '“Review candidate engineering actions A1 through A6. Classify which actions permanently eliminate our Occurrence, Escape, and Systemic root causes, which serve only as complementary containment/transition support, and which must be rejected.”',
    kpis: [
      {
        label: 'Occurrence Target',
        value: 'Unvalidated Reflow Recipe',
        sublabel: 'Proven by E05 & E06-B (8/30 vs 0/30)',
        tone: 'neutral'
      },
      {
        label: 'Escape Target',
        value: 'Retest-PASS WIP Release',
        sublabel: 'Proven by E07 (48 released)',
        tone: 'neutral'
      },
      {
        label: 'Systemic Target',
        value: 'Change & Retest Governance',
        sublabel: 'Proven by E08 (missing dual sign-off/WI)',
        tone: 'neutral'
      }
    ],
    evidenceSectionTitle: 'Candidate Engineering Actions (A1–A6)',
    evidenceCards: [],
    interactiveTaskTitle: 'Step 1A: Classify Candidate Actions A1–A6 & Map to Root Causes',
    interactiveTaskSubtitle:
      'Classify each candidate action (A1–A6) as a Permanent Corrective Action (mapped to its root-cause layer), a Complementary Action, or an Ineffective Action to Reject.',
    interactiveTasks: [
      {
        id: 'D5-T1',
        label: 'A1 — Restore and validate thermal reflow recipe',
        prompt: 'How should candidate action A1 be classified in the D5 corrective action plan?',
        options: [
          { value: '', label: '-- Classify Action A1 --' },
          { value: 'COMP', label: 'Complementary Action — Reworks existing contained boards only' },
          { value: 'PCA-OCC', label: 'Required PCA — Eliminates Occurrence Root Cause (unvalidated reflow recipe modification)' },
          { value: 'PCA-ESC', label: 'Required PCA — Eliminates Potential Escape Root Cause (retest release rule)' },
          { value: 'REJECT', label: 'Reject — Ineffective action that masks intermittent defects' }
        ],
        expectedValue: 'PCA-OCC',
        hintIfIncorrect: 'Consider which root-cause layer (Occurrence, Escape, or Systemic) is directly eliminated by restoring and validating the SMT thermal reflow recipe (E05, E06-B).'
      },
      {
        id: 'D5-T2',
        label: 'A2 — Repair defective boards from contained historical lot',
        prompt: 'How should candidate action A2 be classified?',
        options: [
          { value: '', label: '-- Classify Action A2 --' },
          { value: 'PCA-OCC', label: 'Required PCA — Permanently prevents future SMT reflow defects on new production lots' },
          { value: 'COMP-LOT', label: 'Complementary Action — Remedies physical solder defects on existing contained boards, but does not prevent new defects' },
          { value: 'REJECT', label: 'Reject — Defective boards should be released on retest without repair' }
        ],
        expectedValue: 'COMP-LOT',
        hintIfIncorrect: 'Does repairing already-built boards change the oven recipe or governance rules for future builds, or is it a complementary disposition action for contained inventory?'
      },
      {
        id: 'D5-T3',
        label: 'A3 — Increase retest attempts at functional test',
        prompt: 'How should candidate action A3 be classified?',
        options: [
          { value: '', label: '-- Classify Action A3 --' },
          { value: 'PCA-ESC', label: 'Required PCA — Eliminates the Potential Escape Root Cause at functional test' },
          { value: 'COMP-TRANS', label: 'Complementary Action — Useful temporary safeguard during pilot transition' },
          { value: 'REJECT-MASK', label: 'Reject (Ineffective / Counterproductive) — Masks intermittent J12 solder defects and increases escape risk' }
        ],
        expectedValue: 'REJECT-MASK',
        hintIfIncorrect: 'Evaluate what happens to an intermittent J12 solder joint if operators repeat retest attempts until it happens to pass.'
      },
      {
        id: 'D5-T4',
        label: 'A4 — Investigate original FAIL before releasing any retest-PASS board',
        prompt: 'How should candidate action A4 be classified?',
        options: [
          { value: '', label: '-- Classify Action A4 --' },
          { value: 'PCA-ESC', label: 'Required PCA — Eliminates Potential Escape Root Cause (uninvestigated retest-PASS release into WIP)' },
          { value: 'PCA-OCC', label: 'Required PCA — Eliminates Occurrence Root Cause at the SMT reflow oven' },
          { value: 'COMP-LOT', label: 'Complementary Action — Temporary inspection only' },
          { value: 'REJECT', label: 'Reject — Slows down WIP movement unnecessarily' }
        ],
        expectedValue: 'PCA-ESC',
        hintIfIncorrect: 'Review D4 record E07: 48 retest-PASS boards entered WIP because no investigation of the original FAIL was required before release.'
      },
      {
        id: 'D5-T5',
        label: 'A5 — Independently approve and validate critical recipe changes',
        prompt: 'How should candidate action A5 be classified?',
        options: [
          { value: '', label: '-- Classify Action A5 --' },
          { value: 'COMP-LOT', label: 'Complementary Action — Applies only to historical lot rework' },
          { value: 'PCA-SYS', label: 'Required PCA — Eliminates Systemic Root Cause (missing change-control & independent validation governance)' },
          { value: 'REJECT', label: 'Reject — Process engineers should modify critical oven recipes informally' }
        ],
        expectedValue: 'PCA-SYS',
        hintIfIncorrect: 'Review D4 record E08: the reflow recipe was altered without independent validation because change-control governance lacked mandatory dual sign-off.'
      },
      {
        id: 'D5-T6',
        label: 'A6 — Temporary reinforced J12 visual/X-ray inspection during transition',
        prompt: 'How should candidate action A6 be classified?',
        options: [
          { value: '', label: '-- Classify Action A6 --' },
          { value: 'PCA-SYS', label: 'Required PCA — Permanently replaces process validation and change-control governance' },
          { value: 'COMP-TRANS', label: 'Complementary Action — Provides temporary verification support during transition, not a standalone permanent fix' },
          { value: 'REJECT', label: 'Reject — Inspection of J12 is prohibited during pilot runs' }
        ],
        expectedValue: 'COMP-TRANS',
        hintIfIncorrect: 'Distinguish temporary reinforced inspection during cutover (complementary support) from permanent elimination of process and governance causes.'
      }
    ],
    checkPromptTitle: 'Step 1B: Confirm Action Plan Ownership, Evidence & Effectiveness Criteria',
    checkPromptSubtitle: 'Select the required implementation commitments for the D5 Action Plan (leave counterproductive items unchecked).',
    checkOptions: [
      {
        id: 'A1',
        label: 'Include A1 (Owner: SMT Process Eng • Timing: Prior to D6 pilot • Deliverable: Validated thermal profile report)',
        isRequired: true,
        hintIfMissed: 'Include A1 with assigned SMT Process Engineering ownership and thermal profile deliverable.'
      },
      {
        id: 'A2',
        label: 'Include A2 as a complementary disposition action for defective boards in the contained historical lot (Owner: Rework & Quality Eng)',
        isRequired: true,
        hintIfMissed: 'Include A2 as a complementary action so defective historical boards can be repaired under controlled verification.'
      },
      {
        id: 'A3',
        label: 'Include A3 (allow up to 3 retest attempts before locking a failing board)',
        isRequired: false,
        hintIfSelectedWhenIncorrect: 'Do not include A3: increasing retest attempts masks intermittent J12 solder defects rather than correcting them.'
      },
      {
        id: 'A4',
        label: 'Include A4 (Owner: Test & Quality Eng • Timing: Immediate before pilot • Deliverable: Updated Retest Disposition Rule & Hold Log)',
        isRequired: true,
        hintIfMissed: 'Include A4 with Test & Quality Engineering ownership to stop uninvestigated retest-PASS releases.'
      },
      {
        id: 'A5',
        label: 'Include A5 (Owner: Engineering + Quality Management • Timing: Prior to pilot release • Deliverable: Dual-signed ECN & validation gate)',
        isRequired: true,
        hintIfMissed: 'Include A5 to establish independent approval and validation for critical process changes.'
      },
      {
        id: 'A6',
        label: 'Include A6 as a complementary transitional inspection check (30-board J12 sample audit during D6 validation)',
        isRequired: true,
        hintIfMissed: 'Include A6 as a complementary transitional verification measure during the validation pilot.'
      }
    ],
    decisionPromptTitle: 'Step 2: Authorize the D5 Corrective Action Package',
    decisionOptions: [
      {
        id: 'DEC-D5-2',
        label: 'Authorize J12 board rework and reinforced X-ray/visual inspection as the primary Permanent Corrective Actions, deferring reflow recipe and governance changes',
        description: 'Relies on 100% inspection and solder touch-up rather than eliminating the process and governance root causes.',
        isExpected: false,
        feedbackWhenSelected:
          'Hint: Rework and inspection only catch or repair defects after they are created—they do not eliminate the Occurrence or Systemic root causes.'
      },
      {
        id: 'DEC-D5-1',
        label: 'Authorize the three root-cause-eliminating PCAs (Occurrence, Escape, and Systemic) with assigned owners, pre-pilot due dates, and quantitative D6 acceptance criteria, supported by board repair and transitional J12 inspection as complementary actions while rejecting additional retests',
        description: 'Links each permanent action to its verified causal layer and separates complementary transition/rework support from permanent prevention.',
        isExpected: true,
        feedbackWhenSelected:
          'Approved. The D5 package maps permanent corrective actions to the Occurrence (A1), Escape (A4), and Systemic (A5) causes, retains A2 and A6 as complementary actions, and rejects A3.'
      },
      {
        id: 'DEC-D5-3',
        label: 'Restore the thermal reflow recipe as the sole corrective action and allow standard retest-PASS releases to resume once oven settings are restored',
        description: 'Addresses the oven recipe only while leaving retest release and change-control rules unchanged.',
        isExpected: false,
        feedbackWhenSelected:
          'Hint: Fixing only the Occurrence cause leaves the Escape cause (E07) and Systemic governance gap (E08) unaddressed.'
      }
    ],
    approvedFeedback:
      'D5 Verified. Permanent Corrective Actions A1 (Occurrence), A4 (Escape), and A5 (Systemic) are approved alongside complementary actions A2 and A6; A3 is rejected.',
    incompleteChecksFeedbackPrefix:
      'Complete the A1–A6 classification in Step 1A and verify the action plan commitments in Step 1B.',
    managementReviewQuote:
      '“Your corrective action plan is approved. Proceed to D6 to evaluate the 500-unit NEW production pilot against our acceptance criteria and define ongoing monitoring.”',
    reportEntrySummary: {
      caseFacts:
        'Six candidate actions evaluated (A1–A6) against D4 verified Occurrence, Escape, and Systemic root causes.',
      keyFindings:
        'Classified A1 (Occurrence), A4 (Escape), and A5 (Systemic) as Required PCAs; classified A2 (repair defective boards) and A6 (temporary J12 inspection) as Complementary; rejected A3 (increase retest attempts).',
      verifiedDecision:
        'Approved D5 PCA Package (A1, A4, A5) + Complementary Actions (A2, A6) with owners, pre-pilot timing, and D6 validation criteria; rejected A3.',
      pendingObligations:
        'Validate PCAs on a 500-unit NEW production pilot in D6 and maintain separate quarantine control over the 500 historical contained units.',
      metricsSnapshot: 'Required PCAs: A1 (Occurrence), A4 (Escape), A5 (Systemic) | Complementary: A2, A6 | Rejected: A3'
    }
  },
  {
    id: 'D6',
    shortTitle: 'Validate PCA',
    fullTitle: 'D6 — Implement and Validate Permanent Corrective Actions',
    durationMinutes: CASE_METADATA.workshop.discipline_minutes.D6,
    managementChallenge:
      '“We ran a post-correction pilot of 500 NEW units. Evaluate the pilot numbers against our acceptance criteria, interpret what the 30-piece sample proves, define ongoing process monitoring, and determine how the 500 historical contained units must be handled.”',
    kpis: [
      {
        label: 'Pilot Lot Size',
        value: `${pilot.pilot_results.new_units_tested} NEW Units`,
        sublabel: '492 Initial PASS • 8 Initial FAIL',
        tone: 'teal'
      },
      {
        label: 'FPY Criterion',
        value: `>= ${pilot.proposed_acceptance_criteria.minimum_fpy_percent.toFixed(1)}%`,
        sublabel: 'Calculate achieved pilot FPY below',
        tone: 'neutral'
      },
      {
        label: 'J12 Sample Audit',
        value: '0 / 30 Defects',
        sublabel: '30-unit pilot sample inspected',
        tone: 'teal'
      },
      {
        label: 'Historical Contained Lot',
        value: '500 Units Held',
        sublabel: '398 WIP • 87 FG • 15 Diagnostics',
        tone: 'warning'
      }
    ],
    evidenceSectionTitle: 'Pilot Validation & Historical Quarantine Records',
    evidenceCards: [
      {
        id: 'D6-EV-1',
        title: 'Post-Correction Pilot Log (500 NEW Units)',
        badge: 'Pilot Data',
        summary: '500 NEW PCBAs built under the restored, validated thermal profile: 492 Initial PASS, 8 Initial FAIL.',
        details: [
          'Acceptance Criteria: Minimum FPY >= 98.0%; Conforming thermal profile; 0 J12 anomalies in 30-unit sample; 0 unauthorized retest releases.',
          'Observed Pilot Data: 492/500 Initial PASS (8 Initial FAIL); Thermal profile validated; 0/30 J12 solder anomalies; 0 unauthorized retest releases.'
        ]
      },
      {
        id: 'D6-EV-2',
        title: 'Quarantine Status of the 500 Historical Contained Units',
        badge: 'Quarantine Record',
        progressiveLockedByDefault: true,
        summary: 'The 500 historical Interval 2 units (398 WIP, 87 FG, 15 Diagnostics) and 60 retest-PASS units remain in quarantine.',
        details: [
          'These 500 historical units were assembled before the reflow recipe was restored.',
          'Validating 500 NEW pilot units verifies the corrected process for future production but does NOT alter solder joints on historical units.',
          'Historical units cannot be released without a documented physical screening, repair (A2), and re-verification disposition record.'
        ]
      }
    ],
    interactiveTaskTitle: 'Step 1A: Evaluate Pilot Acceptance Criteria & Ongoing Monitoring Plan',
    interactiveTaskSubtitle: 'Complete the quantitative pilot evaluation, sample interpretation, population separation, and ongoing monitoring rule.',
    interactiveTasks: [
      {
        id: 'D6-T1',
        label: '1. Pilot FPY Calculation & Criterion Verification',
        prompt: 'Based on 492 initial PASS and 8 initial FAIL across 500 NEW pilot units, what is the achieved FPY vs. the target criterion?',
        options: [
          { value: '', label: '-- Select Pilot FPY Evaluation --' },
          { value: 'FPY-FAIL', label: '492 / 500 = 98.4% FPY — Fails validation because 8 boards failed initial functional test (requires 100.0% FPY)' },
          { value: 'FPY-984', label: '492 / 500 = 98.4% FPY — Meets the >= 98.0% acceptance criterion (restores baseline ~98% performance)' },
          { value: 'FPY-920', label: '460 / 500 = 92.0% FPY — Below the >= 98.0% acceptance criterion' }
        ],
        expectedValue: 'FPY-984',
        hintIfIncorrect: 'Divide 492 initial PASS by 500 NEW units (492 / 500 = 98.4%) and compare against the >= 98.0% threshold.'
      },
      {
        id: 'D6-T2',
        label: '2. Interpretation of 0 / 30 J12 Sample Inspection',
        prompt: 'What does finding 0 J12 solder anomalies in 30 sampled pilot boards scientifically demonstrate?',
        options: [
          { value: '', label: '-- Select Sample Interpretation --' },
          { value: 'SMP-ABS', label: 'Mathematically guarantees 0.0% J12 defects across all future production lots without further process controls' },
          { value: 'SMP-CRIT', label: 'Meets the defined 0/30 sample acceptance criterion (vs. 8/30 in E06-B modified recipe), but does not prove zero future risk without ongoing monitoring' },
          { value: 'SMP-HIST', label: 'Proves that the 500 historical contained units in quarantine also have 0 J12 defects' }
        ],
        expectedValue: 'SMP-CRIT',
        hintIfIncorrect: 'A 30-piece sample satisfies the pilot acceptance criterion and confirms improvement over 8/30, but sustained quality requires ongoing process control.'
      },
      {
        id: 'D6-T3',
        label: '3. Disposition Rule for the 500 Historical Contained Units',
        prompt: 'How does the successful 500-unit NEW pilot affect the 500 historical Interval 2 units (398 WIP, 87 FG, 15 Diagnostics)?',
        options: [
          { value: '', label: '-- Select Historical Lot Rule --' },
          { value: 'HIST-REL', label: 'Passing the 500-unit NEW pilot automatically authorizes releasing the 398 WIP and 87 FG historical units' },
          { value: 'HIST-HOLD', label: 'Strictly separate: the 500 historical units remain quarantined until a documented physical inspection/rework (A2) and re-test pathway is completed' },
          { value: 'HIST-RETEST', label: 'Historical units can be shipped immediately if they pass a single functional retest cycle' }
        ],
        expectedValue: 'HIST-HOLD',
        hintIfIncorrect: 'Inspect the Quarantine Status record: a pilot on 500 NEW units does not change physical solder joints on the 500 historical boards built under the modified recipe.'
      },
      {
        id: 'D6-T4',
        label: '4. Ongoing Process Monitoring & Reaction Plan',
        prompt: 'Which ongoing monitoring plan is required to verify sustained effectiveness after the pilot?',
        options: [
          { value: '', label: '-- Select Ongoing Monitoring Rule --' },
          { value: 'MON-NONE', label: 'No ongoing monitoring needed once the 500-unit pilot meets the 98.4% FPY target' },
          { value: 'MON-RULE', label: 'Metric: Shift FPY (>= 98.0%) & oven profile log • Freq: Every shift / lot • Owner: SMT & Quality Eng • Reaction: Stop line & hold lot if FPY < 98.0% or J12 defect > 0' },
          { value: 'MON-YEAR', label: 'Metric: Annual customer warranty review • Freq: Once per year • Owner: Sales • Reaction: Retest returned units' }
        ],
        expectedValue: 'MON-RULE',
        hintIfIncorrect: 'Pilot acceptance proves initial capability; sustained effectiveness requires shift-by-shift FPY/profile monitoring, clear ownership, and an immediate line-stop reaction rule.'
      }
    ],
    checkPromptTitle: 'Step 1B: Confirm Pilot Validation & Historical Quarantine Boundaries',
    checkPromptSubtitle: 'Inspect both validation records above, then select the verified conclusions.',
    checkOptions: [
      {
        id: 'D6-C1',
        label: 'The 500 NEW pilot units achieved 98.4% FPY (492 PASS, 8 FAIL), satisfying the >= 98.0% acceptance criterion',
        isRequired: true,
        hintIfMissed: 'Verify that 492/500 (98.4% FPY) meets the >= 98.0% acceptance criterion.'
      },
      {
        id: 'D6-C4',
        label: 'Pilot validation authorizes automatically releasing the 87 Finished Goods and 398 WIP historical units into shipment',
        isRequired: false,
        hintIfSelectedWhenIncorrect: 'The 500 historical units were built before the reflow recipe was restored and cannot be released on the basis of the new-unit pilot.'
      },
      {
        id: 'D6-C2',
        label: 'All physical and governance pilot criteria were met: validated thermal profile, 0/30 J12 sample defects, and 0 unauthorized retest releases',
        isRequired: true,
        hintIfMissed: 'Check the Post-Correction Pilot Log for thermal profile, J12 sample (0/30), and retest governance (0 unauthorized releases).'
      },
      {
        id: 'D6-C3',
        label: 'The 500 historical contained units (398 WIP, 87 FG, 15 Diagnostics) and 60 retest-PASS units remain quarantined pending documented rework/disposition',
        isRequired: true,
        hintIfMissed: 'Inspect the Quarantine Status record regarding the 500 historical contained units.'
      }
    ],
    decisionPromptTitle: 'Step 2: Authorize the D6 Validation & Disposition Gate Decision',
    decisionOptions: [
      {
        id: 'DEC-D6-2',
        label: 'Certify the 500-unit NEW pilot and release the 398 WIP and 87 FG historical Interval 2 units that passed initial test or retest',
        description: 'Uses the new-lot pilot result to clear historical contained inventory without physical rework.',
        isExpected: false,
        feedbackWhenSelected:
          'Hint: The 500 historical Interval 2 units were built under the unvalidated reflow recipe—releasing them without documented physical screening/rework risks shipping latent J12 solder defects.'
      },
      {
        id: 'DEC-D6-1',
        label: 'Certify PCA validation for new production (492/500 = 98.4% FPY vs. >= 98.0% criterion; 0/30 J12 defects; 0 unauthorized releases) with shift monitoring and reaction rules, while keeping all 500 historical contained units (and 60 retest-PASS units) quarantined until physical rework/disposition is documented',
        description: 'Approves new production launch with ongoing monitoring while enforcing strict quarantine on historical suspect inventory.',
        isExpected: true,
        feedbackWhenSelected:
          'Approved. New production is validated by the 500-unit NEW pilot (98.4% FPY), ongoing shift monitoring is established, and the 500 historical contained units remain held pending documented physical disposition.'
      },
      {
        id: 'DEC-D6-3',
        label: 'Reject the 500-unit NEW pilot because 8 initial failures occurred (98.4% FPY) and require 100% X-ray inspection on all future lots indefinitely',
        description: 'Rejects a pilot that met the >= 98.0% FPY threshold and substitutes permanent 100% inspection for process control.',
        isExpected: false,
        feedbackWhenSelected:
          'Hint: 98.4% FPY (492/500) exceeds the >= 98.0% acceptance threshold and restores historical baseline performance (~2.0% initial fail rate).'
      }
    ],
    approvedFeedback:
      'D6 Verified. PCAs are validated on the 500 NEW pilot units (98.4% FPY, 0/30 J12 defects, 0 unauthorized releases) with ongoing monitoring, while the 500 historical contained units remain quarantined pending documented physical disposition.',
    incompleteChecksFeedbackPrefix:
      'Complete the Pilot Evaluation & Monitoring Matrix in Step 1A and verify your checklist selections in Step 1B.',
    managementReviewQuote:
      '“New production is validated, and the 500 historical units remain properly quarantined pending disposition. In D7, map our five systemic prevention controls, owners, frequencies, and reaction plans.”',
    reportEntrySummary: {
      caseFacts:
        '500 NEW pilot units: 492 Initial PASS, 8 Initial FAIL (98.4% FPY vs. >= 98.0% criterion), validated thermal profile, 0/30 J12 sample defects, 0 unauthorized retest releases. 500 HISTORICAL Interval 2 units (398 WIP, 87 FG, 15 Diagnostics) + 60 retest-PASS units remain in quarantine.',
      keyFindings:
        'Pilot satisfies all acceptance criteria for new production (98.4% FPY, 0/30 J12 sample anomalies). Historical 500 units remain un-dispositioned and require separate physical rework/verification.',
      verifiedDecision:
        'Certified PCA validation for new production with shift monitoring and reaction rules; maintained quarantine hold on the 500 historical contained units.',
      pendingObligations:
        'Complete physical rework/inspection/scrap disposition records for the 500 historical contained units (and 60 retest-PASS units) and standardize D7 systemic controls.',
      metricsSnapshot: '500 NEW Pilot: 492/500 = 98.4% FPY (>=98.0%) | 0/30 J12 Sample | Historical 500 Units: Quarantined (Disposition Pending)'
    }
  },
  {
    id: 'D7',
    shortTitle: 'Prevent Recurrence',
    fullTitle: 'D7 — Prevent Recurrence',
    durationMinutes: CASE_METADATA.workshop.discipline_minutes.D7,
    managementChallenge:
      '“To prevent recurrence across our plant, map the five systemic prevention controls to their defense layers, owners, verification frequencies, and reaction plans—and distinguish approved control standards from verified ongoing audits.”',
    kpis: [
      {
        label: 'Occurrence Defense',
        value: 'Recipe Version Lock',
        sublabel: 'Status: Approved Plan (Audit Pending)',
        tone: 'neutral'
      },
      {
        label: 'Escape Defense',
        value: 'Retest WI + MES Hold',
        sublabel: 'Status: Approved Plan (MES Audit Pending)',
        tone: 'neutral'
      },
      {
        label: 'Systemic Governance',
        value: 'Dual Sign-Off + LPAs',
        sublabel: 'Status: Approved Plan (LPA Cycle Pending)',
        tone: 'warning'
      }
    ],
    evidenceSectionTitle: 'Control Standardization & Verification Status Brief',
    evidenceCards: [
      {
        id: 'D7-EV-1',
        title: 'Control Lifecycle Status: Proposed -> Approved -> Implemented -> Verified',
        badge: 'Governance Status',
        summary: 'Approving D7 standardizes the 5 controls in the Plant Control Plan, but physical deployment audits and multi-cycle LPA effectiveness checks remain tracked obligations.',
        details: [
          'Supporting Case Evidence: E05/E06-B & D6 Pilot support the technical specification of Recipe Locks (C1) and Dual Sign-Off (C2); E07/E08 support Retest WIs (C3), Electronic MES Holds (C4), and LPA Audits (C5).',
          'Status Honesty Rule: Selecting and approving C1–C5 in D7 transitions their status from PROPOSED to APPROVED IN CONTROL PLAN.',
          'Verification Requirement: Physical MES routing lock test logs and weekly/monthly Layered Process Audit (LPA) records are required to certify sustained IMPLEMENTATION & EFFECTIVENESS.'
        ]
      }
    ],
    interactiveTaskTitle: 'Step 1A: Map the 5 Preventive Controls (Mechanism, Layer, Owner, Frequency & Reaction Plan)',
    interactiveTaskSubtitle: 'Configure each of the five systemic controls to lock in Occurrence, Escape, and Systemic recurrence prevention.',
    interactiveTasks: [
      {
        id: 'D7-T1',
        label: 'Control 1 — Protected, Version-Locked SMT Reflow Recipes',
        prompt: 'Select the correct Defense Layer, Owner, Verification Frequency, and Reaction Plan for SMT Reflow Recipes:',
        options: [
          { value: '', label: '-- Map Control 1 (SMT Reflow Recipes) --' },
          { value: 'C1-WEAK', label: 'Escape Prevention • Owner: Shipping Dept • Freq: Annual review • Reaction: Retest boards at pack-out' },
          { value: 'C1-MAP', label: 'Occurrence Prevention • Owner: SMT Process Eng • Freq: Every recipe load / shift start • Reaction: Lock oven & hold lot on version/checksum mismatch' },
          { value: 'C1-OPT', label: 'Informal Guideline • Owner: Line Operator • Freq: Optional • Reaction: Verbal note at shift change' }
        ],
        expectedValue: 'C1-MAP',
        hintIfIncorrect: 'Password-protected, version-locked reflow recipes prevent Occurrence at the SMT oven under SMT Process Engineering ownership, checked every shift/recipe load.'
      },
      {
        id: 'D7-T2',
        label: 'Control 2 — Independent Thermal Validation & Dual Quality Sign-Off for Recipe Changes',
        prompt: 'Select the correct Defense Layer, Owner, Frequency, and Reaction Plan for Process Change Validation:',
        options: [
          { value: '', label: '-- Map Control 2 (Change Validation) --' },
          { value: 'C2-POST', label: 'Systemic Governance • Owner: Process Eng only • Freq: 30 days after production release • Reaction: File report retroactively' },
          { value: 'C2-MAP', label: 'Systemic Governance • Owner: Process + Quality Eng • Freq: Prior to any critical parameter/recipe ECN • Reaction: Block production release without dual sign-off & thermal profile report' },
          { value: 'C2-NONE', label: 'Escape Prevention • Owner: Test Technician • Freq: After customer complaint • Reaction: Run fixture check' }
        ],
        expectedValue: 'C2-MAP',
        hintIfIncorrect: 'Independent thermal validation and dual Process + Quality Engineering sign-off must occur BEFORE any critical recipe change is released to production.'
      },
      {
        id: 'D7-T3',
        label: 'Control 3 — Updated Retest Work Instructions (Prohibit Release Without Failure Investigation)',
        prompt: 'Select the correct Defense Layer, Owner, Frequency, and Reaction Plan for Retest Work Instructions:',
        options: [
          { value: '', label: '-- Map Control 3 (Retest Work Instructions) --' },
          { value: 'C3-MAP', label: 'Escape Prevention (Procedural) • Owner: Test & Quality Eng • Freq: Every initial functional FAIL • Reaction: Quarantine board to Diagnostic Hold bench for RCA' },
          { value: 'C3-PASS', label: 'Escape Prevention • Owner: Test Operator • Freq: After 3 failed retests • Reaction: Release to WIP if 4th test passes' },
          { value: 'C3-OCC', label: 'Occurrence Prevention • Owner: Warehouse Lead • Freq: Monthly • Reaction: Count Finished Goods' }
        ],
        expectedValue: 'C3-MAP',
        hintIfIncorrect: 'Updated Retest Work Instructions govern every initial functional FAIL under Test & Quality Engineering, routing failing boards to Diagnostic Hold rather than WIP.'
      },
      {
        id: 'D7-T4',
        label: 'Control 4 — Automated Electronic MES / Tester Routing Hold on Initial FAIL Serial Numbers',
        prompt: 'Select the correct Defense Layer, Owner, Frequency, and Reaction Plan for Electronic MES / Tester Holds:',
        options: [
          { value: '', label: '-- Map Control 4 (Electronic MES Holds) --' },
          { value: 'C4-MAN', label: 'Escape Prevention • Owner: Line Operator • Freq: Manual spreadsheet entry at end of week • Reaction: Highlight row in yellow' },
          { value: 'C4-MAP', label: 'Escape Prevention (Technical Poka-Yoke) • Owner: Test / MES Eng • Freq: Continuous automated scan check • Reaction: Hard-block downstream WIP scan until engineering disposition sign-off' },
          { value: 'C4-SYS', label: 'Occurrence Prevention • Owner: Purchasing • Freq: Per component lot • Reaction: Hold raw reels' }
        ],
        expectedValue: 'C4-MAP',
        hintIfIncorrect: 'An automated MES routing lock acts as a continuous technical poka-yoke under Test/MES Engineering, hard-blocking downstream WIP scans for any initial-FAIL serial number.'
      },
      {
        id: 'D7-T5',
        label: 'Control 5 — Operator/Engineer Training & Scheduled Layered Process Audits (LPAs)',
        prompt: 'Select the correct Defense Layer, Owner, Frequency, and Reaction Plan for Training & LPAs:',
        options: [
          { value: '', label: '-- Map Control 5 (Training & LPAs) --' },
          { value: 'C5-ONCE', label: 'Systemic Sustainability • Owner: HR Dept • Freq: One-time memo with no shop-floor audits • Reaction: None required' },
          { value: 'C5-MAP', label: 'Systemic Sustainability • Owner: Production & Quality Leads • Freq: Shift training + Weekly/Monthly LPA schedule • Reaction: Escalate audit gap within 24h & re-lock station' },
          { value: 'C5-INS', label: 'Occurrence Prevention • Owner: Shipping • Freq: Quarterly • Reaction: Inspect cartons' }
        ],
        expectedValue: 'C5-MAP',
        hintIfIncorrect: 'Training must be paired with scheduled Weekly/Monthly Layered Process Audits (LPAs) owned by Production & Quality Leads and a 24-hour escalation rule.'
      }
    ],
    checkPromptTitle: 'Step 1B: Approve the 5 Systemic Controls & Verify Implementation Governance',
    checkPromptSubtitle: 'Select the five required prevention controls (C1–C5) to approve in the Control Plan, while rejecting unsupported implementation claims.',
    checkOptions: [
      {
        id: 'D7-C1',
        label: 'Approve C1 (Occurrence Control): Password-protected, version-locked SMT reflow recipes (Owner: SMT Process Eng; oven lock audit tracked)',
        isRequired: true,
        hintIfMissed: 'Approve C1 (protected, version-locked SMT reflow recipes).'
      },
      {
        id: 'D7-C2',
        label: 'Approve C2 (Change Governance): Mandatory independent thermal validation and dual Process + Quality Engineering sign-off before any critical recipe release',
        isRequired: true,
        hintIfMissed: 'Approve C2 (independent thermal validation and dual sign-off for critical recipe changes).'
      },
      {
        id: 'D7-DIST-1',
        label: 'Certify that multi-cycle Layered Process Audits (LPAs) and physical MES lock audits are already completed simply by selecting C1–C5 today',
        isRequired: false,
        hintIfSelectedWhenIncorrect: 'Selecting controls in D7 approves the standardization plan; physical MES lock verification and multi-cycle LPA effectiveness audits remain pending obligations.'
      },
      {
        id: 'D7-C3',
        label: 'Approve C3 (Procedural Escape Control): Updated retest work instructions prohibiting WIP release on retest PASS without failure investigation (Owner: Test & Quality Eng)',
        isRequired: true,
        hintIfMissed: 'Approve C3 (updated retest work instructions prohibiting uninvestigated retest-PASS release).'
      },
      {
        id: 'D7-C4',
        label: 'Approve C4 (Technical Escape Poka-Yoke): Automated electronic MES / tester routing hold on initial-FAIL serial numbers (Owner: Test / MES Eng; deployment audit tracked)',
        isRequired: true,
        hintIfMissed: 'Approve C4 (automated electronic MES / tester routing hold on initial-FAIL serial numbers).'
      },
      {
        id: 'D7-DIST-2',
        label: 'Rely on verbal shift-handover reminders alone without recipe password locks or electronic MES holds',
        isRequired: false,
        hintIfSelectedWhenIncorrect: 'Verbal reminders alone cannot prevent unauthorized recipe edits or uninvestigated retest-PASS releases.'
      },
      {
        id: 'D7-C5',
        label: 'Approve C5 (Sustainability & Audit Plan): Operator/engineer training and scheduled Weekly/Monthly Layered Process Audits (Owner: Production & Quality Leads; effectiveness audit tracked)',
        isRequired: true,
        hintIfMissed: 'Approve C5 (operator/engineer training and scheduled Weekly/Monthly Layered Process Audits).'
      }
    ],
    decisionPromptTitle: 'Step 2: Authorize the D7 Recurrence Prevention Control Plan',
    decisionOptions: [
      {
        id: 'DEC-D7-2',
        label: 'Approve the updated Retest Work Instruction (C3) and operator training (C5) only, deferring SMT recipe locks (C1) and electronic MES holds (C4) to avoid software/equipment changes',
        description: 'Adopts administrative controls only without technical poka-yoke locks.',
        isExpected: false,
        feedbackWhenSelected:
          'Hint: Administrative work instructions alone cannot prevent an unvalidated recipe edit or an accidental scan of an initial-FAIL board into WIP.'
      },
      {
        id: 'DEC-D7-1',
        label: 'Approve all five systemic controls (C1 Recipe Lock, C2 Independent Change Validation, C3 Retest WI, C4 Electronic MES Hold, C5 Training & LPAs) in the Plant Control Plan with assigned owners, frequencies, and reaction rules, while tracking physical MES/oven deployment and LPA effectiveness audits as open verification obligations',
        description: 'Standardizes technical and procedural prevention across Occurrence, Escape, and Systemic layers while distinguishing plan approval from verified effectiveness.',
        isExpected: true,
        feedbackWhenSelected:
          'Approved. All five systemic controls (C1–C5) are approved in the Control Plan with clear owners, frequencies, and reaction plans, while physical deployment and multi-cycle LPA effectiveness audits remain tracked obligations.'
      },
      {
        id: 'DEC-D7-3',
        label: 'Lock the SMT reflow recipe (C1) and require dual ECN sign-off (C2), but leave retest release rules and MES routing unchanged since the oven recipe is now fixed',
        description: 'Prevents the reflow recipe change only while leaving the retest escape pathway open.',
        isExpected: false,
        feedbackWhenSelected:
          'Hint: Any future intermittent defect from another source could still escape if uninvestigated retest-PASS releases (C3, C4) remain permitted.'
      }
    ],
    approvedFeedback:
      'D7 Verified. All five systemic controls (C1–C5) are approved in the Plant Control Plan with owners, verification frequencies, and reaction rules; physical MES/oven deployment and LPA effectiveness audits are tracked as pending verification.',
    incompleteChecksFeedbackPrefix:
      'Complete the 5-Control Mapping Matrix in Step 1A and select only the five approved controls (C1–C5) in Step 1B.',
    managementReviewQuote:
      '“Your recurrence-prevention control plan is approved. Proceed to D8 to conduct an honest, evidence-based closure audit, recognize the team, and generate the Cumulative Executive 8D Report.”',
    reportEntrySummary: {
      caseFacts:
        'Five systemic controls defined across Occurrence (C1 Recipe Lock), Escape (C3 Retest WI, C4 Electronic MES Hold), and Systemic Governance (C2 Independent Change Validation, C5 Training & LPAs).',
      keyFindings:
        'Mapped all 5 controls to owners, verification frequencies, and reaction rules. Distinguished D7 Control Plan Approval from ongoing physical implementation and multi-cycle LPA effectiveness verification.',
      verifiedDecision:
        'Approved D7 Systemic Prevention Control Plan (C1–C5) with explicit ownership, frequencies, reaction plans, and tracked implementation/LPA audit verification.',
      pendingObligations:
        'Verify physical MES/oven lock implementation logs and complete scheduled Weekly/Monthly LPA effectiveness checks.',
      metricsSnapshot: 'C1–C5 Status: Approved in Control Plan | Implementation & LPA Effectiveness: Verification Pending'
    }
  },
  {
    id: 'D8',
    shortTitle: 'Recognize & Close',
    fullTitle: 'D8 — Recognize the Team and Close the 8D',
    durationMinutes: CASE_METADATA.workshop.discipline_minutes.D8,
    managementChallenge:
      '“Audit our actual case records before signing off: distinguish what is proven and validated from what remains an open physical obligation (especially the 500 historical contained units), recognize the cross-functional team, and record an accurate, evidence-based 8D closure status.”',
    kpis: [
      {
        label: '500 NEW Pilot Units',
        value: 'Validated (98.4% FPY)',
        sublabel: '492/500 PASS • 0/30 J12 • 0 Escapes',
        tone: 'teal'
      },
      {
        label: '500 Historical Units',
        value: 'Disposition Pending',
        sublabel: '398 WIP • 87 FG • 15 Diag + 60 Retest Held',
        tone: 'risk'
      },
      {
        label: 'D7 Controls (C1–C5)',
        value: 'Plan Approved',
        sublabel: 'MES & LPA effectiveness audits pending',
        tone: 'warning'
      },
      {
        label: 'Actual Case Status',
        value: 'Closure Pending',
        sublabel: 'Historical disposition evidence required',
        tone: 'warning'
      }
    ],
    evidenceSectionTitle: 'D8 Closure-Evidence Audit Gate',
    evidenceCards: [
      {
        id: 'D8-EV-1',
        title: 'Closure-Evidence Audit: Verified Case Facts vs. Outstanding Obligations',
        badge: 'Closure Gate Audit',
        summary: 'Unconditional 8D closure requires documented completion of historical inventory disposition and control verification—do not certify undocumented actions as complete.',
        details: [
          'VERIFIED CASE FACTS: D4 root causes proven (E01–E08, E06-B); D5 PCAs (A1, A4, A5) approved; D6 pilot on 500 NEW units validated (492/500 = 98.4% FPY, 0/30 J12 defects, 0 unauthorized releases); 0 customer escapes.',
          'OUTSTANDING OBLIGATION 1 (Critical): The 500 historical Interval 2 units (398 WIP, 87 FG, 15 Diagnostics) and 60 retest-PASS units (48 released, 12 held) remain quarantined from D3/D6. The case file contains NO physical rework (A2), re-test, scrap, or release completion quantities.',
          'OUTSTANDING OBLIGATION 2: D7 controls (C1–C5) are approved in the Control Plan, while physical MES lock audit logs and multi-cycle LPA sustained-effectiveness records remain pending.'
        ]
      }
    ],
    interactiveTaskTitle: 'Step 1A: Conduct the Evidence-Based Closure Audit',
    interactiveTaskSubtitle: 'Classify the exact verification status of each closure requirement based strictly on the documented case evidence.',
    interactiveTasks: [
      {
        id: 'D8-T1',
        label: '1. Audit Status: 500 NEW Pilot Units & Root Cause Proof',
        prompt: 'What is the documented status of the D4 root-cause proof and the D6 500-unit NEW pilot?',
        options: [
          { value: '', label: '-- Select Pilot & RCA Status --' },
          { value: 'PILOT-PEND', label: 'Unverified — No pilot run or root-cause experiments have been conducted yet' },
          { value: 'PILOT-VER', label: 'Verified by Case Evidence — 4-layer RCA proven (E01–E08/E06-B) and 500 NEW pilot units met criteria (98.4% FPY, 0/30 J12 defects, 0 unauthorized releases)' },
          { value: 'PILOT-FAIL', label: 'Failed — The 500-unit NEW pilot failed the >= 98.0% FPY threshold' }
        ],
        expectedValue: 'PILOT-VER',
        hintIfIncorrect: 'Review D4 (E01–E08, E06-B) and D6 (492/500 = 98.4% FPY, 0/30 J12 defects): both RCA and the 500-unit NEW pilot are verified by documented case facts.'
      },
      {
        id: 'D8-T2',
        label: '2. Audit Status: 500 Historical Contained Units (398 WIP, 87 FG, 15 Diag) & 60 Retest-PASS Units',
        prompt: 'What is the documented status of the 500 historical Interval 2 units and 60 retest-PASS units held in quarantine?',
        options: [
          { value: '', label: '-- Select Historical Inventory Status --' },
          { value: 'HIST-COMP', label: 'Verified Complete — All 500 historical units and 60 retest-PASS units have documented rework and re-test completion certificates in the case file' },
          { value: 'HIST-PEND', label: 'Pending Physical Disposition Evidence — Quarantined in D3/D6, but physical rework (A2), re-test, or scrap completion quantities are NOT yet documented in the case file' },
          { value: 'HIST-AUTO', label: 'Automatically Cleared — The 500-unit NEW pilot cleared all historical units without physical inspection' }
        ],
        expectedValue: 'HIST-PEND',
        hintIfIncorrect: 'Check D6 and the D8 Closure-Evidence Audit card: the 500 historical units remain held in quarantine, and no physical rework/scrap completion quantities exist in the case file.'
      },
      {
        id: 'D8-T3',
        label: '3. Audit Status: D7 Systemic Controls (C1–C5) & Sustained Effectiveness',
        prompt: 'What is the documented status of the five D7 recurrence-prevention controls?',
        options: [
          { value: '', label: '-- Select D7 Controls Status --' },
          { value: 'CTRL-FULL', label: 'Fully Audited & Complete — Six months of weekly/monthly LPA audits and MES validation logs are already documented in the case file' },
          { value: 'CTRL-PLAN', label: 'Approved in D7 Control Plan — Technical/procedural standards defined, while physical MES lock audit logs and multi-cycle LPA effectiveness checks remain pending' },
          { value: 'CTRL-NONE', label: 'Not Defined — No preventive controls, owners, or frequencies have been proposed' }
        ],
        expectedValue: 'CTRL-PLAN',
        hintIfIncorrect: 'Distinguish D7 Control Plan approval from completed multi-cycle LPA effectiveness records.'
      }
    ],
    checkPromptTitle: 'Step 1B: Confirm Closure Governance & Cross-Functional Team Recognition',
    checkPromptSubtitle: 'Verify the required closure audit conclusions and team recognition commitments.',
    checkOptions: [
      {
        id: 'D8-C1',
        label: 'Certify as VERIFIED: 4-layer root cause analysis (D4), PCA package (D5), and 500-unit NEW pilot validation (98.4% FPY, 0/30 J12 anomalies, 0 customer escapes)',
        isRequired: true,
        hintIfMissed: 'Confirm the documented case achievements that ARE verified by evidence (D0–D6 pilot).'
      },
      {
        id: 'D8-C5',
        label: 'Certify that all 500 historical contained units have already been reworked and released into Finished Goods without supporting case records',
        isRequired: false,
        hintIfSelectedWhenIncorrect: 'Never certify undocumented physical rework or inventory disposition as completed.'
      },
      {
        id: 'D8-C2',
        label: 'Record as OPEN CLOSURE OBLIGATION: Documented physical inspection, repair (A2), re-test, or scrap disposition quantities for the 500 historical contained units (398 WIP, 87 FG, 15 Diagnostics) and 60 retest-PASS units',
        isRequired: true,
        hintIfMissed: 'Explicitly flag that historical lot disposition evidence is required before unconditional closure.'
      },
      {
        id: 'D8-C3',
        label: 'Record as OPEN CLOSURE OBLIGATION: Physical implementation verification of D7 controls (recipe lock, electronic MES hold) and scheduled LPA effectiveness audit evidence',
        isRequired: true,
        hintIfMissed: 'Flag that D7 control deployment and sustained LPA audit evidence must be verified.'
      },
      {
        id: 'D8-C4',
        label: 'Formally recognize Quality Engineering, SMT Process Engineering, Test & Diagnostics, and Production & Material Control for zero customer escapes and evidence-based root-cause proof',
        isRequired: true,
        hintIfMissed: 'Include formal recognition of each cross-functional team discipline.'
      }
    ],
    decisionPromptTitle: 'Step 2: Authorize the D8 Closure Gate Decision',
    decisionOptions: [
      {
        id: 'DEC-D8-2',
        label: 'Authorize unconditional final 8D closure today and mark the 500 historical contained units and D7 audits as 100% completed based on the successful 500-unit NEW pilot',
        description: 'Grants unconditional closure without documented disposition evidence for the 500 historical suspect units.',
        isExpected: false,
        feedbackWhenSelected:
          'Hint: Contradiction check—in D6 the 500 historical units (398 WIP, 87 FG, 15 Diagnostics) were kept in quarantine pending rework/disposition, and no completion records exist in the case file. An 8D cannot be unconditionally closed by assuming historical disposition is complete.'
      },
      {
        id: 'DEC-D8-1',
        label: 'Recognize the cross-functional team, certify D0–D7 investigation and 500-unit NEW pilot validation, and set Actual Case Status to "Closure Pending" until physical disposition records for the 500 historical units (and 60 retest-PASS units) and D7 effectiveness audits are documented',
        description: 'Verifies the D8 classroom exercise while maintaining strict case integrity: Actual Case Status remains Closure Pending until missing historical disposition and D7 audit evidence is provided.',
        isExpected: true,
        feedbackWhenSelected:
          'D8 Exercise Verified — Formal 8D Closure Pending. Cross-functional team contributions are recognized and the 500-unit NEW pilot (98.4% FPY) is certified, while Actual Case Status remains Closure Pending until historical disposition and D7 effectiveness evidence are documented.'
      },
      {
        id: 'DEC-D8-3',
        label: 'Reject the entire D0–D7 investigation and revoke D6 NEW pilot approval because historical inventory disposition is still pending',
        description: 'Invalidates verified root causes and new-production pilot results due to pending historical rework.',
        isExpected: false,
        feedbackWhenSelected:
          'Hint: Distinguish new-production PCA validation (proven on the 500 NEW pilot units at 98.4% FPY) from the remaining historical lot disposition obligation.'
      }
    ],
    approvedHeadline: 'D8 Exercise Verified — Formal 8D Closure Pending',
    approvedFeedback:
      'D8 Exercise Verified — Formal 8D Closure Pending. Cross-functional team contributions are recognized, and the D0–D7 investigation and 500-unit NEW pilot (98.4% FPY) are certified. Actual Case Status remains "Closure Pending" until documented physical disposition records for the 500 historical contained units (and 60 retest-PASS units) and D7 effectiveness audits are verified.',
    incompleteChecksFeedbackPrefix:
      'Complete the Closure-Evidence Audit in Step 1A and verify all required governance and recognition items in Step 1B.',
    managementReviewQuote:
      '“Excellent rigor. You verified the D8 classroom exercise, recognized the cross-functional team, and certified our 98.4% FPY new-production pilot—while holding Actual Case Status at Closure Pending until documented disposition records for the 500 historical quarantined units and D7 effectiveness audits are supplied.”',
    reportEntrySummary: {
      caseFacts:
        'Verified Case Facts: 1,000 historical units in-plant (0 customer escapes); D4 4-layer RCA proven (E01–E08, E06-B); D5 PCAs (A1, A4, A5) approved; D6 500 NEW pilot units validated (98.4% FPY, 0/30 J12 defects, 0 unauthorized releases); D7 controls (C1–C5) approved in Control Plan. Missing Case Evidence: No documented rework/scrap/release completion records for the 500 historical Interval 2 units (398 WIP, 87 FG, 15 Diagnostics) or 60 retest-PASS units; D7 physical deployment & LPA audits pending.',
      keyFindings:
        'D6–D8 Consistency Enforced: D8 Classroom Exercise is verified, while Actual Case Status remains "Closure Pending" because the 500 historical contained units lack documented disposition completion records and D7 controls await effectiveness audit verification.',
      verifiedDecision:
        'D8 Exercise Verified — Formal 8D Closure Pending: Recognized cross-functional team, certified D0–D7 & 500-unit NEW pilot, and recorded Actual Case Status as "Closure Pending".',
      pendingObligations:
        '1. Document physical inspection, rework (A2), re-test, and scrap/release quantities for all 500 historical Interval 2 units (398 WIP, 87 FG, 15 Diagnostics) and 60 retest-PASS units. 2. Complete D7 MES lock verification and Weekly/Monthly LPA effectiveness audit logs.',
      metricsSnapshot: 'Actual Case Status: Closure Pending | D8 Exercise: Verified | New Pilot: 98.4% FPY (492/500) | Customer Escapes: 0'
    }
  }
];
