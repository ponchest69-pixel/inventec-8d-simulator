import React from 'react';
import { EvaluationResult } from '../utils/evaluateDiscipline';
import { D4DraftProgress } from '../utils/reportExport';

interface D4InvestigationModuleProps {
  unlockedEvidenceIds: string[];
  d4Draft: D4DraftProgress;
  attempts: number;
  teamId: string;
  onUnlockEvidence: (id: string) => void;
  onUpdateD4Draft: (nextDraft: D4DraftProgress) => void;
  onSubmitD4: (evaluation: EvaluationResult) => void;
  onResetD4SelectionsOnly: () => void;
}

export const D4_HYPOTHESES = [
  {
    id: 'H1',
    label: 'H1: Functional test station fixture alignment or tester hardware stability',
    isInScope: true,
    expectedVerdict: 'rejected' as const,
    relatedEvidenceIds: ['E01'],
    relatedEvidence: 'E01'
  },
  {
    id: 'H2',
    label: 'H2: Raw component lot variation across the two 500-unit production intervals',
    isInScope: true,
    expectedVerdict: 'rejected' as const,
    relatedEvidenceIds: ['E02'],
    relatedEvidence: 'E02'
  },
  {
    id: 'H3',
    label: 'H3: Microcontroller firmware version or test software configuration change',
    isInScope: true,
    expectedVerdict: 'rejected' as const,
    relatedEvidenceIds: ['E03'],
    relatedEvidence: 'E03'
  },
  {
    id: 'H4',
    label: 'H4: PCBA connector J12 solder joint wetting and electrical contact integrity',
    isInScope: true,
    expectedVerdict: 'supported' as const,
    relatedEvidenceIds: ['E04', 'E06'],
    relatedEvidence: 'E04, E06'
  },
  {
    id: 'H5',
    label: 'H5: SMT reflow oven thermal recipe settings between Interval 1 and Interval 2',
    isInScope: true,
    expectedVerdict: 'supported' as const,
    relatedEvidenceIds: ['E05', 'E06-B'],
    relatedEvidence: 'E05, E06-B'
  },
  {
    id: 'H6',
    label: 'H6: Shop-floor retest release procedures and process-change validation rules',
    isInScope: true,
    expectedVerdict: 'supported' as const,
    relatedEvidenceIds: ['E07', 'E08'],
    relatedEvidence: 'E07, E08'
  }
];

export const D4_STAGE_A_DISTRACTORS = [
  {
    id: 'H7',
    label: 'H7: Customer field installation over-voltage or external harness miswiring at end-user sites',
    hintWhenSelected:
      'Stage A Scope Check: D0/D2/D3 established 0 customer shipments—all 1,000 units failed or passed inside the plant, so H7 is out of scope.'
  },
  {
    id: 'H8',
    label: 'H8: Outbound sea-freight container humidity corrosion during international transit',
    hintWhenSelected:
      'Stage A Scope Check: All 1,000 boards remain in plant inventory (748 WIP, 232 FG, 20 Diagnostics); none entered outbound transit, so H8 is out of scope.'
  }
];

export const D4_EVIDENCE_ITEMS = [
  {
    id: 'E01',
    code: 'E01',
    title: 'Fixture Cross-Verification',
    category: 'Tester Bench',
    metricTag: '5 / 5 fail on both fixtures',
    observation: 'Five intermittent boards fail on both verified functional test fixtures.'
  },
  {
    id: 'E02',
    code: 'E02',
    title: 'Component Lot Genealogy',
    category: 'Traceability',
    metricTag: 'Shared lots across 1,000 units',
    observation: 'Common component lots were used across both 500-unit periods; no clear lot correlation.'
  },
  {
    id: 'E03',
    code: 'E03',
    title: 'Firmware Audit',
    category: 'Software Control',
    metricTag: 'FW-3.2.1 unchanged (1,000/1,000)',
    observation: 'Firmware FW-3.2.1 was unchanged across all 1,000 units.'
  },
  {
    id: 'E04',
    code: 'E04',
    title: 'J12 Solder Inspection',
    category: 'X-Ray / Optical Lab',
    metricTag: '17/20 FAIL vs. 1/20 PASS',
    observation: 'Anomalous J12 solder observed in 17/20 intermittent FAIL samples versus 1/20 initial PASS samples.'
  },
  {
    id: 'E05',
    code: 'E05',
    title: 'SMT Reflow Process Log',
    category: 'Oven Audit',
    metricTag: 'Unvalidated recipe edit @ Unit 501',
    observation: 'Reflow recipe was changed before the second 500 units without documented thermal profile validation.'
  },
  {
    id: 'E06',
    code: 'E06',
    title: 'Rework & Reproduction Test',
    category: 'Bench Verification',
    metricTag: '10/10 PASS after J12 Pin 4 repair',
    observation: 'Ten J12-anomalous boards reproduce the failure; all ten pass consistently after J12 terminal 4 solder repair.'
  },
  {
    id: 'E06-B',
    code: 'E06-B',
    title: 'Controlled Recipe Comparison',
    category: 'DOE Split Run',
    metricTag: '8/30 Modified vs. 0/30 Restored',
    observation: '8 J12 defects found in 30 modified-recipe units versus 0 in 30 units built with the validated restored recipe.'
  },
  {
    id: 'E07',
    code: 'E07',
    title: 'Retest Disposition Trace',
    category: 'WIP Routing Log',
    metricTag: '48 released / 12 held in WIP',
    observation: '48 retest-PASS units were released into WIP without investigating the original FAIL; 12 remained held.'
  },
  {
    id: 'E08',
    code: 'E08',
    title: 'Procedure & Governance Audit',
    category: 'Quality System',
    metricTag: 'Missing retest & change rules',
    observation: 'Work instructions lacked clear retest disposition rules and required no independent validation for critical recipe changes.'
  }
];

export function evaluateD4Submission(
  unlockedEvidenceIds: string[],
  d4Draft: D4DraftProgress
): EvaluationResult {
  const hints: string[] = [];

  // Stage A Check: All 6 in-scope hypotheses must be selected, and out-of-scope H7/H8 excluded
  const missingHypotheses = D4_HYPOTHESES.filter(
    (h) => !d4Draft.selectedHypotheses.includes(h.id)
  );
  if (missingHypotheses.length > 0) {
    hints.push(
      `Stage A: Include all 6 plausible in-plant hypotheses (${missingHypotheses.map((h) => h.id).join(', ')} not selected) so no internal assembly, test, component, or governance factor is overlooked.`
    );
  }

  for (const dist of D4_STAGE_A_DISTRACTORS) {
    if (d4Draft.selectedHypotheses.includes(dist.id)) {
      hints.push(dist.hintWhenSelected);
    }
  }

  // Stage B Check: All 9 evidence items must be inspected
  const uninspected = D4_EVIDENCE_ITEMS.filter(
    (ev) => !unlockedEvidenceIds.includes(ev.id)
  );
  if (uninspected.length > 0) {
    hints.push(
      `Stage B: Inspect all 9 laboratory evidence records (${uninspected.map((e) => e.code).join(', ')} not yet inspected).`
    );
  }

  // Stage C Check: Each hypothesis must be evaluated as supported or rejected based on evidence
  const wrongVerdicts = D4_HYPOTHESES.filter(
    (h) => d4Draft.verdicts[h.id] !== h.expectedVerdict
  );
  if (wrongVerdicts.length > 0) {
    for (const h of wrongVerdicts.slice(0, 2)) {
      if (!d4Draft.verdicts[h.id]) {
        hints.push(`Stage C: Record an evidence-based verdict (Rejected or Supported) for ${h.id} using ${h.relatedEvidence}.`);
      } else {
        hints.push(`Stage C: Re-evaluate ${h.id} against empirical laboratory record(s) ${h.relatedEvidence}.`);
      }
    }
  }

  // Stage D Check: All 4 root cause dimensions and their confirming evidence basis
  if (d4Draft.physicalCause !== 'PHY-J12') {
    hints.push('Stage D (Physical Cause): Compare your selection with physical solder inspection and repair records E04 and E06.');
  } else if (d4Draft.physicalEvidence && d4Draft.physicalEvidence !== 'E04, E06') {
    hints.push('Stage D (Physical Evidence Basis): Select the laboratory records that physically inspected and repaired the solder joint.');
  }

  if (d4Draft.occurrenceCause !== 'OCC-REFLOW') {
    hints.push('Stage D (Occurrence Cause): Compare your selection with process log E05 and split-lot trial E06-B.');
  } else if (d4Draft.occurrenceEvidence && d4Draft.occurrenceEvidence !== 'E05, E06-B') {
    hints.push('Stage D (Occurrence Evidence Basis): Select the records documenting the oven recipe change and controlled recipe trial.');
  }

  if (d4Draft.escapeCause !== 'ESC-RETEST') {
    hints.push('Stage D (Potential Escape Cause): Review E07—note that the initial functional test DID detect the 80 failures, whereas retest-PASS boards were released into WIP.');
  } else if (d4Draft.escapeEvidence && d4Draft.escapeEvidence !== 'E07') {
    hints.push('Stage D (Escape Evidence Basis): Select the record tracing the 48 released retest-PASS units in WIP.');
  }

  if (d4Draft.systemicCause !== 'SYS-GOV') {
    hints.push('Stage D (Systemic Cause): Compare your selection with procedure and governance audit record E08.');
  } else if (d4Draft.systemicEvidence && d4Draft.systemicEvidence !== 'E08') {
    hints.push('Stage D (Systemic Evidence Basis): Select the record auditing work instructions and change-control governance.');
  }

  if (hints.length > 0) {
    return {
      isApproved: false,
      headline: 'Root Cause Investigation Incomplete or Needs Revision',
      feedbackMessage:
        'Review the laboratory evidence records in Stage B and refine your selections. Your inspected evidence remains saved.',
      hints
    };
  }

  return {
    isApproved: true,
    headline: 'D4 Root Cause Analysis Verified',
    feedbackMessage:
      'Empirical evidence E01–E08 rules out fixtures (E01), component lots (E02), and firmware (E03), and confirms: (1) Physical: insufficient solder at J12 terminal 4 (E04, E06); (2) Occurrence: unvalidated thermal reflow recipe change (E05, E06-B); (3) Potential Escape: release after retest PASS without investigating the original FAIL (E07); (4) Systemic: insufficient change control, independent validation, and retest disposition instructions (E08).',
    hints: []
  };
}

export const D4InvestigationModule: React.FC<D4InvestigationModuleProps> = ({
  unlockedEvidenceIds,
  d4Draft,
  attempts,
  teamId,
  onUnlockEvidence,
  onUpdateD4Draft,
  onSubmitD4,
  onResetD4SelectionsOnly
}) => {
  const toggleHypothesis = (id: string) => {
    const exists = d4Draft.selectedHypotheses.includes(id);
    const nextSelected = exists
      ? d4Draft.selectedHypotheses.filter((item) => item !== id)
      : [...d4Draft.selectedHypotheses, id];
    onUpdateD4Draft({
      ...d4Draft,
      selectedHypotheses: nextSelected
    });
  };

  const handleSetVerdict = (id: string, val: 'supported' | 'rejected') => {
    onUpdateD4Draft({
      ...d4Draft,
      verdicts: {
        ...d4Draft.verdicts,
        [id]: val
      }
    });
  };

  const handleVerifyD4 = () => {
    // Require evidence basis selections in UI when submitting from Stage D
    const missingBasisHints: string[] = [];
    if (!d4Draft.physicalEvidence) {
      missingBasisHints.push('Stage D: Select the Confirming Evidence Basis for the Physical Root Cause.');
    }
    if (!d4Draft.occurrenceEvidence) {
      missingBasisHints.push('Stage D: Select the Confirming Evidence Basis for the Occurrence Root Cause.');
    }
    if (!d4Draft.escapeEvidence) {
      missingBasisHints.push('Stage D: Select the Confirming Evidence Basis for the Potential Escape Root Cause.');
    }
    if (!d4Draft.systemicEvidence) {
      missingBasisHints.push('Stage D: Select the Confirming Evidence Basis for the Systemic Root Cause.');
    }

    const result = evaluateD4Submission(unlockedEvidenceIds, d4Draft);
    if (missingBasisHints.length > 0) {
      onSubmitD4({
        isApproved: false,
        headline: 'Root Cause Evidence Basis Required',
        feedbackMessage:
          'Link each of the four root-cause layers in Stage D to its confirming laboratory evidence record(s).',
        hints: [...result.hints, ...missingBasisHints].slice(0, 4)
      });
      return;
    }
    onSubmitD4(result);
  };

  const allStageACandidates = [...D4_HYPOTHESES, ...D4_STAGE_A_DISTRACTORS];

  return (
    <div className="d4-stages-wrap">
      {/* Stage A */}
      <section className="section-card">
        <div className="section-header">
          <h3 className="section-title">Stage A — Scope the Formal Investigation Plan</h3>
          <p className="section-subtitle">
            Select the plausible in-plant hypotheses (H1–H8) that warrant laboratory testing based on the D2/D3 boundary (1,000 units in-plant, 0 customer shipments). Exclude out-of-scope external claims.
          </p>
        </div>
        <div className="compact-grid-2">
          {allStageACandidates.map((h) => {
            const active = d4Draft.selectedHypotheses.includes(h.id);
            return (
              <label key={h.id} className={`option-row compact ${active ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggleHypothesis(h.id)}
                />
                <span className="option-title">{h.label}</span>
              </label>
            );
          })}
        </div>
      </section>

      {/* Stage B */}
      <section className="section-card">
        <div className="section-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h3 className="section-title">
              Stage B — Laboratory Evidence Center ({unlockedEvidenceIds.length} / {D4_EVIDENCE_ITEMS.length} Inspected)
            </h3>
            <span className="time-pill">Inspect each record to unlock lab visuals &amp; observations</span>
          </div>
        </div>
        <div className="e-cards-grid">
          {D4_EVIDENCE_ITEMS.map((ev) => {
            const unlocked = unlockedEvidenceIds.includes(ev.id);
            return (
              <div key={ev.id} className={`e-card ${unlocked ? 'unlocked' : 'locked'}`}>
                <div className="e-card-top" style={{ justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="e-code">{ev.code}</span>
                    <span className="e-title">{ev.title}</span>
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 600 }}>{ev.category}</span>
                </div>
                {unlocked ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div className="mini-chip teal" style={{ alignSelf: 'flex-start' }}>
                      {ev.metricTag}
                    </div>
                    <p className="e-obs">{ev.observation}</p>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn btn-outline-navy btn-sm"
                    onClick={() => onUnlockEvidence(ev.id)}
                  >
                    Inspect {ev.code} Record
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Stage C */}
      <section className="section-card">
        <div className="section-header">
          <h3 className="section-title">Stage C — Evaluate Hypotheses Against Laboratory Evidence</h3>
          <p className="section-subtitle">
            For each in-plant hypothesis (H1–H6), determine whether the Stage B laboratory evidence rejects or supports it.
          </p>
        </div>
        <div className="verdict-list">
          {D4_HYPOTHESES.map((h) => {
            const current = d4Draft.verdicts[h.id] || '';
            const evidenceReady = h.relatedEvidenceIds.every((id) =>
              unlockedEvidenceIds.includes(id)
            );
            return (
              <div key={h.id} className="verdict-row">
                <div className="verdict-label" style={{ flexWrap: 'wrap' }}>
                  <strong>{h.label}</strong>
                  <span className="verdict-ref">
                    {evidenceReady
                      ? `Relevant Lab Record: ${h.relatedEvidence} (Inspected)`
                      : `Inspect ${h.relatedEvidence} in Stage B first`}
                  </span>
                </div>
                <div className="verdict-btns">
                  <button
                    type="button"
                    className={`verdict-btn ${current === 'rejected' ? 'active-reject' : ''}`}
                    onClick={() => handleSetVerdict(h.id, 'rejected')}
                  >
                    Rejected by Evidence
                  </button>
                  <button
                    type="button"
                    className={`verdict-btn ${current === 'supported' ? 'active-support' : ''}`}
                    onClick={() => handleSetVerdict(h.id, 'supported')}
                  >
                    Supported by Evidence
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stage D */}
      <section className="section-card">
        <div className="section-header">
          <h3 className="section-title">Stage D — Build the 4-Layer Root Cause Report &amp; Evidence Justification</h3>
          <p className="section-subtitle">
            Select the verified cause AND its confirming laboratory evidence basis for each of the four causal layers.
          </p>
        </div>

        <div className="rca-builder-grid">
          <div className="rca-field">
            <label htmlFor="d4-phy">1. Physical Root Cause (Board-Level Mechanism)</label>
            <select
              id="d4-phy"
              value={d4Draft.physicalCause}
              onChange={(e) =>
                onUpdateD4Draft({ ...d4Draft, physicalCause: e.target.value })
              }
            >
              <option value="">-- Select Physical Cause --</option>
              <option value="PHY-FIX">Test fixture pogo-pin wear causing false fails</option>
              <option value="PHY-J12">Insufficient solder at J12 terminal 4 causing intermittent electrical contact</option>
              <option value="PHY-MCU">Microcontroller firmware timing lockup under load</option>
            </select>
            <select
              aria-label="Physical Root Cause Evidence Basis"
              value={d4Draft.physicalEvidence || ''}
              onChange={(e) =>
                onUpdateD4Draft({ ...d4Draft, physicalEvidence: e.target.value })
              }
              style={{ marginTop: '4px' }}
            >
              <option value="">-- Confirming Evidence Basis --</option>
              <option value="E01">E01 (Fixture cross-verification)</option>
              <option value="E04, E06">E04 &amp; E06 (17/20 vs 1/20 J12 solder anomaly + 10/10 pass after Pin 4 repair)</option>
              <option value="E03">E03 (Firmware FW-3.2.1 audit)</option>
            </select>
          </div>

          <div className="rca-field">
            <label htmlFor="d4-occ">2. Occurrence Root Cause (Process Change)</label>
            <select
              id="d4-occ"
              value={d4Draft.occurrenceCause}
              onChange={(e) =>
                onUpdateD4Draft({ ...d4Draft, occurrenceCause: e.target.value })
              }
            >
              <option value="">-- Select Occurrence Cause --</option>
              <option value="OCC-LOT">Contaminated connector lot from raw material supplier</option>
              <option value="OCC-REFLOW">Unvalidated thermal reflow recipe change before the second 500 units</option>
              <option value="OCC-HAND">Manual operator board handling after functional test</option>
            </select>
            <select
              aria-label="Occurrence Root Cause Evidence Basis"
              value={d4Draft.occurrenceEvidence || ''}
              onChange={(e) =>
                onUpdateD4Draft({ ...d4Draft, occurrenceEvidence: e.target.value })
              }
              style={{ marginTop: '4px' }}
            >
              <option value="">-- Confirming Evidence Basis --</option>
              <option value="E02">E02 (Component lot genealogy)</option>
              <option value="E05, E06-B">E05 &amp; E06-B (Unvalidated recipe log + 8/30 vs 0/30 controlled recipe trial)</option>
              <option value="E07">E07 (Retest WIP disposition trace)</option>
            </select>
          </div>

          <div className="rca-field">
            <label htmlFor="d4-esc">3. Potential Escape Root Cause (Detection / Release Gap)</label>
            <select
              id="d4-esc"
              value={d4Draft.escapeCause}
              onChange={(e) =>
                onUpdateD4Draft({ ...d4Draft, escapeCause: e.target.value })
              }
            >
              <option value="">-- Select Potential Escape Cause --</option>
              <option value="ESC-TESTER">Initial functional test failed to detect the defective boards</option>
              <option value="ESC-RETEST">Release into WIP after retest PASS without investigating the original FAIL</option>
              <option value="ESC-SHIP">Shipping department bypassed Finished Goods scanning</option>
            </select>
            <select
              aria-label="Potential Escape Root Cause Evidence Basis"
              value={d4Draft.escapeEvidence || ''}
              onChange={(e) =>
                onUpdateD4Draft({ ...d4Draft, escapeEvidence: e.target.value })
              }
              style={{ marginTop: '4px' }}
            >
              <option value="">-- Confirming Evidence Basis --</option>
              <option value="E01">E01 (Both functional test fixtures detected the failure)</option>
              <option value="E04">E04 (X-ray inspection of J12)</option>
              <option value="E07">E07 (48 retest-PASS units released into WIP without investigating original FAIL)</option>
            </select>
          </div>

          <div className="rca-field">
            <label htmlFor="d4-sys">4. Systemic Root Cause (Management &amp; Governance)</label>
            <select
              id="d4-sys"
              value={d4Draft.systemicCause}
              onChange={(e) =>
                onUpdateD4Draft({ ...d4Draft, systemicCause: e.target.value })
              }
            >
              <option value="">-- Select Systemic Cause --</option>
              <option value="SYS-CAL">Missing annual calibration schedule for functional test stations</option>
              <option value="SYS-SUP">Inadequate incoming receiving inspection for passive components</option>
              <option value="SYS-GOV">Insufficient change control, independent validation, and retest disposition instructions</option>
            </select>
            <select
              aria-label="Systemic Root Cause Evidence Basis"
              value={d4Draft.systemicEvidence || ''}
              onChange={(e) =>
                onUpdateD4Draft({ ...d4Draft, systemicEvidence: e.target.value })
              }
              style={{ marginTop: '4px' }}
            >
              <option value="">-- Confirming Evidence Basis --</option>
              <option value="E02">E02 (Incoming component lot trace)</option>
              <option value="E08">E08 (Procedure audit: missing retest rules &amp; no independent validation for recipe changes)</option>
              <option value="E06">E06 (Bench rework reproduction test)</option>
            </select>
          </div>
        </div>

        <div className="action-bar">
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            <strong>{teamId}</strong> &bull; Attempts: <strong>{attempts}</strong>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-outline-navy"
              onClick={onResetD4SelectionsOnly}
            >
              Clear Selections (Keep Evidence)
            </button>
            <button type="button" className="btn btn-primary-submit" onClick={handleVerifyD4}>
              Submit D4 Root Cause Report
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
