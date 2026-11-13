import React from 'react';
import { DisciplineId } from '../data/disciplinesData';

interface DisciplineVisualProps {
  disciplineId: DisciplineId;
  unlockedEvidenceIds: string[];
  isVerified?: boolean;
  simulatedClosureAssumption?: boolean;
}

export const DisciplineVisuals: React.FC<DisciplineVisualProps> = ({
  disciplineId,
  unlockedEvidenceIds,
  isVerified = false,
  simulatedClosureAssumption = false
}) => {
  switch (disciplineId) {
    case 'D0':
      return (
        <div className="visual-grid-2">
          {/* Chart 1: ~2.0% Baseline vs 8.0% Current */}
          <div className="visual-panel">
            <div className="visual-panel-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.2">
                <path d="M3 3v18h18" />
                <rect x="7" y="13" width="4" height="5" fill="#0d9488" />
                <rect x="14" y="5" width="4" height="13" fill="#dc2626" />
              </svg>
              <span>Initial Functional Test Failure Rate (1,000 PCBAs)</span>
            </div>
            <div className="bar-compare-wrap">
              <div className="bar-row">
                <div className="bar-label">Historical Baseline</div>
                <div className="bar-track">
                  <div className="bar-fill teal" style={{ width: '20%' }} />
                </div>
                <div className="bar-val">~2.0% (~98% FPY)</div>
              </div>
              <div className="bar-row">
                <div className="bar-label">Current Production Lot</div>
                <div className="bar-track">
                  <div className="bar-fill risk" style={{ width: '80%' }} />
                </div>
                <div className="bar-val risk-text">8.0% (80 FAIL)</div>
              </div>
            </div>
            <div className="visual-kpi-strip" style={{ marginTop: '10px' }}>
              <span className="mini-chip neutral">920 Initial PASS (92.0% FPY)</span>
              <span className="mini-chip risk">80 Initial FAIL (8.0%)</span>
              <span className="mini-chip teal">0 Customer Shipments</span>
            </div>
          </div>

          {/* Chart 2: Retest Flow */}
          <div className="visual-panel">
            <div className="visual-panel-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.2">
                <path d="M17 2.1l4 4-4 4" />
                <path d="M3 12.2v-2a4 4 0 0 1 4-4h14" />
                <path d="M7 21.9l-4-4 4-4" />
                <path d="M21 11.8v2a4 4 0 0 1-4 4H3" />
              </svg>
              <span>Retest Flow of the 80 Initial-FAIL Units</span>
            </div>
            <div className="flow-diagram">
              <div className="flow-node neutral">
                <div className="flow-num">1,000</div>
                <div className="flow-sub">PCBAs Tested</div>
              </div>
              <div className="flow-arrow">&rarr;</div>
              <div className="flow-node risk">
                <div className="flow-num">80</div>
                <div className="flow-sub">Initial FAIL (8.0%)</div>
              </div>
              <div className="flow-arrow">&rarr;</div>
              <div className="flow-split">
                <div className="flow-node warning">
                  <div className="flow-num">60</div>
                  <div className="flow-sub">Retest PASS (Disposition ?)</div>
                </div>
                <div className="flow-node risk">
                  <div className="flow-num">20</div>
                  <div className="flow-sub">Persistent FAIL</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'D1':
      return (
        <div className="visual-panel">
          <div className="visual-panel-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.2">
              <circle cx="9" cy="7" r="4" />
              <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              <path d="M21 21v-2a4 4 0 0 0-3-3.85" />
            </svg>
            <span>Plant Operational Touchpoints Across the 1,000-Unit Lot (Map Functions in Step 1)</span>
          </div>
          <div className="org-grid">
            <div className="org-card">
              <div className="org-icon-row">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                  <rect x="9" y="9" width="6" height="6" />
                  <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
                </svg>
                <strong>Touchpoint 1: Board Assembly</strong>
              </div>
              <span>Automated surface-mount placement, thermal reflow soldering &amp; line recipe parameters</span>
            </div>
            <div className="org-card">
              <div className="org-icon-row">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                <strong>Touchpoint 2: Functional Test Bench</strong>
              </div>
              <span>End-of-line test stations, fixtures, initial FAIL detection (80) &amp; retest logs (60/20)</span>
            </div>
            <div className="org-card">
              <div className="org-icon-row">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
                <strong>Touchpoint 3: In-Plant Material Flow</strong>
              </div>
              <span>Shop-floor WIP routing, Finished Goods storage, lot tracking &amp; quarantine execution</span>
            </div>
            <div className="org-card">
              <div className="org-icon-row">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                <strong>Touchpoint 4: Quality &amp; 8D Governance</strong>
              </div>
              <span>Retest disposition standards, change-control rules &amp; accountable 8D gate leadership</span>
            </div>
          </div>
        </div>
      );

    case 'D2': {
      const isNotUnlocked = unlockedEvidenceIds.includes('D2-EV-2');
      return (
        <div className="visual-grid-2">
          {/* Left: Interval FPY + Production-Interval Failure Concentration */}
          <div className="visual-panel">
            <div className="visual-panel-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.2">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              <span>Stratification by Production Sequence (Interval 1 vs. Interval 2)</span>
            </div>

            <div className="interval-compare">
              <div className="interval-box teal-border">
                <div className="interval-header">Interval 1: Units 001–500</div>
                <div className="interval-big teal-text">98.0% FPY</div>
                <div className="interval-stats">
                  <span><strong>490</strong> Initial PASS</span>
                  <span><strong>10</strong> Initial FAIL (2.0% — matches baseline)</span>
                  <span><strong>5</strong> Retest PASS &bull; <strong>5</strong> Persistent FAIL</span>
                </div>
              </div>
              <div className="interval-box risk-border">
                <div className="interval-header">Interval 2: Units 501–1,000</div>
                <div className="interval-big risk-text">86.0% FPY</div>
                <div className="interval-stats">
                  <span><strong>430</strong> Initial PASS</span>
                  <span className="risk-text"><strong>70</strong> Initial FAIL (14.0% — 7x Interval 1)</span>
                  <span><strong>55</strong> Retest PASS &bull; <strong>15</strong> Persistent FAIL</span>
                </div>
              </div>
            </div>

            {/* Production-Interval Failure Concentration Bar */}
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                PRODUCTION-INTERVAL FAILURE CONCENTRATION (80 INITIAL FAILURES):
              </div>
              <div className="bar-compare-wrap">
                <div className="bar-row">
                  <div className="bar-label">Interval 2 (501–1,000)</div>
                  <div className="bar-track">
                    <div className="bar-fill risk" style={{ width: '87.5%' }} />
                  </div>
                  <div className="bar-val risk-text">70 / 80 (87.5%)</div>
                </div>
                <div className="bar-row">
                  <div className="bar-label">Interval 1 (001–500)</div>
                  <div className="bar-track">
                    <div className="bar-fill teal" style={{ width: '12.5%' }} />
                  </div>
                  <div className="bar-val">10 / 80 (12.5%)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Visual IS / IS NOT Boundary Reference */}
          <div className="visual-panel">
            <div className="visual-panel-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="12" y1="9" x2="12" y2="21" />
              </svg>
              <span>5W2H / IS – IS NOT Boundary Log (Gated by D2-EV-2)</span>
            </div>
            {isNotUnlocked ? (
              <table className="compact-table">
                <thead>
                  <tr>
                    <th>Dimension</th>
                    <th>IS Observed (Case Fact)</th>
                    <th>IS NOT Observed (Boundary Contrast)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>What</strong></td>
                    <td>80 initial functional test FAILs (60 retest PASS, 20 persistent FAIL)</td>
                    <td>Catastrophic board short; unverified physical/process causes</td>
                  </tr>
                  <tr>
                    <td><strong>Where</strong></td>
                    <td>In-plant end-of-line functional test station</td>
                    <td>Customer sites or field returns (0 units shipped)</td>
                  </tr>
                  <tr>
                    <td><strong>When</strong></td>
                    <td>Abnormal 14.0% failure surge in Interval 2 (Units 501–1,000: 70 FAIL)</td>
                    <td>Abnormal surge in Interval 1 (Units 001–500 had 10 baseline FAILs [2.0%], NOT the 14.0% surge)</td>
                  </tr>
                  <tr>
                    <td><strong>Extent</strong></td>
                    <td>87.5% of initial FAILs (70/80) &amp; 91.7% of retest PASS (55/60) in Interval 2</td>
                    <td>Uniformly distributed across all 1,000 boards</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div className="gated-visual-placeholder">
                <span>
                  Inspect required record <strong>&ldquo;Boundary Check (5W2H / IS – IS NOT)&rdquo;</strong> below to unlock the boundary comparison data and complete Step 1A.
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }

    case 'D3': {
      const wipAuditUnlocked = unlockedEvidenceIds.includes('D3-EV-2');
      return (
        <div className="visual-panel">
          <div className="visual-panel-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.2">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            </svg>
            <span>In-Plant Inventory Reconciliation &amp; Containment Scope (1,000 Historical Units)</span>
          </div>
          <div className="inventory-matrix-grid">
            <div className="inv-col">
              <div className="inv-col-header">Interval 1: Units 001–500 (98.0% FPY)</div>
              <div className="inv-stat-row">
                <span>WIP Inventory</span>
                <strong>350 units</strong>
              </div>
              <div className="inv-sub-note">
                {wipAuditUnlocked
                  ? 'Subset inside 350 WIP: 5 retest-PASS (3 released, 2 held)'
                  : 'Retest-PASS subset gated — Inspect WIP Audit below'}
              </div>
              <div className="inv-stat-row">
                <span>Finished Goods</span>
                <strong>145 units</strong>
              </div>
              <div className="inv-stat-row">
                <span>Diagnostics Bench</span>
                <strong>5 units (Persistent FAIL)</strong>
              </div>
              <div className="inv-total-row">Interval 1 Total: 500 units</div>
            </div>

            <div className="inv-col suspect">
              <div className="inv-col-header">Suspect Interval 2: Units 501–1,000 (86.0% FPY)</div>
              <div className="inv-stat-row">
                <span>WIP Inventory</span>
                <strong className="risk-text">398 units</strong>
              </div>
              <div className="inv-sub-note">
                {wipAuditUnlocked
                  ? 'Subset inside 398 WIP: 55 retest-PASS (45 released, 10 held)'
                  : 'Retest-PASS subset gated — Inspect WIP Audit below'}
              </div>
              <div className="inv-stat-row">
                <span>Finished Goods</span>
                <strong className="risk-text">87 units</strong>
              </div>
              <div className="inv-stat-row">
                <span>Diagnostics Bench</span>
                <strong className="risk-text">15 units (Persistent FAIL)</strong>
              </div>
              <div className="inv-total-row risk-text">Suspect Interval 2 Total: 500 units</div>
            </div>

            <div className="inv-col summary">
              <div className="inv-col-header">Plant-Wide Reconciliation (No Double Counting)</div>
              <div className="inv-stat-row">
                <span>Total WIP (350 + 398)</span>
                <strong>748 units</strong>
              </div>
              <div className="inv-sub-note">
                {wipAuditUnlocked
                  ? 'Includes all 60 retest-PASS units (48 released + 12 held)'
                  : 'Inspect WIP Audit to reconcile 60 retest-PASS units'}
              </div>
              <div className="inv-stat-row">
                <span>Total Finished Goods (145 + 87)</span>
                <strong>232 units</strong>
              </div>
              <div className="inv-stat-row">
                <span>Total Diagnostics (5 + 15)</span>
                <strong>20 units</strong>
              </div>
              <div className="inv-stat-row teal-highlight">
                <span>Customer Shipments</span>
                <strong>0 units (All 1,000 in plant)</strong>
              </div>
            </div>
          </div>

          <div className="visual-kpi-strip" style={{ marginTop: '10px' }}>
            <span className="mini-chip neutral">Case Fact: 748 WIP + 232 FG + 20 Diag = 1,000 Units</span>
            <span className={`mini-chip ${isVerified ? 'teal' : 'warning'}`}>
              D3 Plan Status: {isVerified ? 'Containment Plan Approved' : 'Decision Pending'}
            </span>
            <span className="mini-chip warning">
              Physical Execution: Requires Hold Tags, MES Lock &amp; Serial Count Audit
            </span>
          </div>
        </div>
      );
    }

    case 'D4': {
      const hasE02 = unlockedEvidenceIds.includes('E02');
      const hasE03 = unlockedEvidenceIds.includes('E03');
      const hasE04 = unlockedEvidenceIds.includes('E04');
      const hasE06 = unlockedEvidenceIds.includes('E06');
      const hasE06B = unlockedEvidenceIds.includes('E06-B');
      return (
        <div className="visual-grid-2">
          {/* Left: PCBA Schematic + Conceptual Solder Cross-Section */}
          <div className="visual-panel">
            <div className="visual-panel-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <circle cx="15.5" cy="8.5" r="1.5" />
                <path d="M7 15h10" />
              </svg>
              <span>PCBA Diagnostic Map &amp; Solder Joint Technical View (Conceptual Illustration)</span>
            </div>
            <svg viewBox="0 0 460 175" className="pcba-svg" role="img" aria-label="PCBA and J12 solder schematic">
              {/* Board Outline */}
              <rect x="8" y="8" width="255" height="158" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="2" />
              <circle cx="20" cy="20" r="4" fill="#334155" />
              <circle cx="251" cy="20" r="4" fill="#334155" />
              <circle cx="20" cy="154" r="4" fill="#334155" />
              <circle cx="251" cy="154" r="4" fill="#334155" />

              {/* MCU Block */}
              <rect x="24" y="28" width="82" height="54" rx="4" fill="#1e293b" stroke="#475569" />
              <text x="65" y="50" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="middle">MCU Core</text>
              <text x="65" y="67" fill="#5eead4" fontSize="9.5" textAnchor="middle">
                {hasE03 ? 'FW-3.2.1 (Same)' : 'E03: Locked'}
              </text>

              {/* Component Lots Block */}
              <rect x="24" y="94" width="82" height="54" rx="4" fill="#1e293b" stroke="#475569" />
              <text x="65" y="116" fill="#e2e8f0" fontSize="10.5" fontWeight="bold" textAnchor="middle">Passive/IC Lots</text>
              <text x="65" y="133" fill="#cbd5e1" fontSize="9.5" textAnchor="middle">
                {hasE02 ? 'No Lot Shift' : 'E02: Locked'}
              </text>

              {/* Connector J12 Header on Board */}
              <rect
                x="130"
                y="26"
                width="116"
                height="122"
                rx="6"
                fill={hasE04 ? '#3b0a0a' : '#1e293b'}
                stroke={hasE04 ? '#ef4444' : '#0d9488'}
                strokeWidth="2"
              />
              <text x="188" y="45" fill="#ffffff" fontSize="11.5" fontWeight="bold" textAnchor="middle">
                Connector J12
              </text>
              {/* Pins 1 to 4 */}
              <rect x="144" y="56" width="18" height="10" rx="2" fill="#14b8a6" />
              <text x="170" y="64" fill="#cbd5e1" fontSize="9.5" textAnchor="start">Pin 1: OK</text>
              <rect x="144" y="74" width="18" height="10" rx="2" fill="#14b8a6" />
              <text x="170" y="82" fill="#cbd5e1" fontSize="9.5" textAnchor="start">Pin 2: OK</text>
              <rect x="144" y="92" width="18" height="10" rx="2" fill="#14b8a6" />
              <text x="170" y="100" fill="#cbd5e1" fontSize="9.5" textAnchor="start">Pin 3: OK</text>
              <rect
                x="144"
                y="112"
                width="18"
                height="12"
                rx="2"
                fill={hasE04 ? '#ef4444' : '#64748b'}
              />
              <text
                x="170"
                y="121"
                fill={hasE04 ? '#fca5a5' : '#94a3b8'}
                fontSize="10"
                fontWeight="bold"
                textAnchor="start"
              >
                {hasE04 ? 'Pin 4: Anomaly' : 'Pin 4 (E04)'}
              </text>
              <text x="188" y="139" fill="#5eead4" fontSize="9.5" textAnchor="middle">
                {hasE06 ? 'E06: 10/10 Pass After Repair' : 'Inspect E04 & E06'}
              </text>

              {/* Right Side: Conceptual Cross-Section of Pin Wetting */}
              <rect x="275" y="8" width="177" height="158" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="363" y="25" fill="#0f172a" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                Solder Joint Cross-Section
              </text>

              {/* Normal Joint */}
              <text x="363" y="42" fill="#0f766e" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                Normal Wetting (Pins 1–3)
              </text>
              <rect x="295" y="72" width="136" height="8" fill="#0d9488" />
              <path d="M335 72 Q350 65 353 48 L373 48 Q376 65 391 72 Z" fill="#94a3b8" />
              <rect x="357" y="44" width="12" height="28" fill="#475569" />

              {/* Pin 4 Joint (Gated by E04) */}
              <text x="363" y="102" fill={hasE04 ? '#b91c1c' : '#64748b'} fontSize="9.5" fontWeight="bold" textAnchor="middle">
                {hasE04 ? 'J12 Pin 4: Insufficient Solder' : 'J12 Pin 4 (Inspect E04)'}
              </text>
              <rect x="295" y="138" width="136" height="8" fill="#0d9488" />
              {hasE04 ? (
                <>
                  <path d="M346 138 Q353 134 355 126 L369 126 Q371 134 374 136 Z" fill="#cbd5e1" />
                  <rect x="357" y="108" width="12" height="26" fill="#475569" />
                  <line x1="348" y1="136" x2="378" y2="136" stroke="#dc2626" strokeWidth="2" strokeDasharray="3,2" />
                  <text x="363" y="158" fill="#b91c1c" fontSize="9" fontWeight="bold" textAnchor="middle">
                    Intermittent Contact Gap
                  </text>
                </>
              ) : (
                <text x="363" y="130" fill="#64748b" fontSize="10" textAnchor="middle">
                  Locked — Click E04 below
                </text>
              )}
            </svg>
          </div>

          {/* Right: E04, E06, E06-B Experimental Charts */}
          <div className="visual-panel">
            <div className="visual-panel-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.2">
                <path d="M9 3h6M10 3v6.5L4 19a2 2 0 0 0 1.7 3h12.6a2 2 0 0 0 1.7-3l-6-9.5V3" />
              </svg>
              <span>Laboratory Verification Results (Gated by E04, E06, E06-B)</span>
            </div>
            <div className="bar-compare-wrap">
              <div className="bar-row">
                <div className="bar-label">E04: J12 Anomaly (FAIL Sample)</div>
                <div className="bar-track">
                  <div className="bar-fill risk" style={{ width: hasE04 ? '85%' : '0%' }} />
                </div>
                <div className="bar-val">{hasE04 ? '17 / 20 (85%)' : 'Inspect E04'}</div>
              </div>
              <div className="bar-row">
                <div className="bar-label">E04: J12 Anomaly (PASS Sample)</div>
                <div className="bar-track">
                  <div className="bar-fill teal" style={{ width: hasE04 ? '5%' : '0%' }} />
                </div>
                <div className="bar-val">{hasE04 ? '1 / 20 (5%)' : 'Inspect E04'}</div>
              </div>
              <div className="bar-row">
                <div className="bar-label">E06: Rework Verification</div>
                <div className="bar-track">
                  <div className="bar-fill teal" style={{ width: hasE06 ? '100%' : '0%' }} />
                </div>
                <div className="bar-val">{hasE06 ? '10 / 10 PASS' : 'Inspect E06'}</div>
              </div>
              <div className="bar-row">
                <div className="bar-label">E06-B: Modified Recipe Trial</div>
                <div className="bar-track">
                  <div className="bar-fill risk" style={{ width: hasE06B ? '26.7%' : '0%' }} />
                </div>
                <div className="bar-val">{hasE06B ? '8 / 30 Defects' : 'Inspect E06-B'}</div>
              </div>
              <div className="bar-row">
                <div className="bar-label">E06-B: Restored Recipe Trial</div>
                <div className="bar-track">
                  <div className="bar-fill teal" style={{ width: hasE06B ? '2%' : '0%' }} />
                </div>
                <div className="bar-val">{hasE06B ? '0 / 30 Defects' : 'Inspect E06-B'}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    case 'D5':
      return (
        <div className="visual-panel">
          <div className="visual-panel-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
            <span>Candidate Engineering &amp; Quality Actions (Classify A1–A6 in Step 1A Below)</span>
          </div>
          <div className="d5-cards-grid">
            <div className="d5-action-card">
              <div className="d5-action-top">
                <span className="d5-code">A1</span>
                <span className="d5-target">SMT Reflow Process</span>
              </div>
              <strong>Restore &amp; Validate Thermal Reflow Recipe</strong>
              <span>Restore original thermal recipe and complete full profile validation before production</span>
            </div>
            <div className="d5-action-card">
              <div className="d5-action-top">
                <span className="d5-code">A2</span>
                <span className="d5-target">Existing Contained Boards</span>
              </div>
              <strong>Repair Defective Boards</strong>
              <span>Perform controlled J12 solder rework on defective boards from the contained lot</span>
            </div>
            <div className="d5-action-card">
              <div className="d5-action-top">
                <span className="d5-code">A3</span>
                <span className="d5-target">Functional Test Bench</span>
              </div>
              <strong>Increase Retest Attempts</strong>
              <span>Allow operators to run additional retest cycles when a board fails functional test</span>
            </div>
            <div className="d5-action-card">
              <div className="d5-action-top">
                <span className="d5-code">A4</span>
                <span className="d5-target">Retest Disposition Rule</span>
              </div>
              <strong>Investigate Original FAIL Before Release</strong>
              <span>Prohibit releasing any retest-PASS board into WIP without investigating the initial FAIL</span>
            </div>
            <div className="d5-action-card">
              <div className="d5-action-top">
                <span className="d5-code">A5</span>
                <span className="d5-target">Change Control System</span>
              </div>
              <strong>Independently Approve Critical Recipe Changes</strong>
              <span>Require independent engineering + quality approval and validation for recipe changes</span>
            </div>
            <div className="d5-action-card">
              <div className="d5-action-top">
                <span className="d5-code">A6</span>
                <span className="d5-target">Cutover Inspection</span>
              </div>
              <strong>Temporary Reinforced J12 Inspection</strong>
              <span>Apply short-term visual/X-ray sample inspection of J12 during process transition</span>
            </div>
          </div>
        </div>
      );

    case 'D6': {
      const quarantineUnlocked = unlockedEvidenceIds.includes('D6-EV-2');
      return (
        <div className="visual-grid-2">
          <div className="visual-panel">
            <div className="visual-panel-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>Post-Correction Pilot Raw Data vs. Target Criteria (500 NEW Units)</span>
            </div>
            <table className="compact-table">
              <thead>
                <tr>
                  <th>Validation Dimension</th>
                  <th>Acceptance Criterion</th>
                  <th>Observed Pilot Data (500 NEW)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>First Pass Yield (FPY)</strong></td>
                  <td>&ge; 98.0% FPY</td>
                  <td><strong>492 Initial PASS / 8 Initial FAIL</strong> (Calculate % in Step 1A)</td>
                </tr>
                <tr>
                  <td><strong>SMT Thermal Profile</strong></td>
                  <td>Conforming profile</td>
                  <td><strong>Validated &amp; documented prior to pilot</strong></td>
                </tr>
                <tr>
                  <td><strong>J12 Solder Sample Audit</strong></td>
                  <td>0 anomalies in 30 units</td>
                  <td><strong>0 anomalies / 30 sampled pilot units</strong></td>
                </tr>
                <tr>
                  <td><strong>Retest Governance</strong></td>
                  <td>0 unauthorized releases</td>
                  <td><strong>0 retest-PASS units released without RCA</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="visual-panel">
            <div className="visual-panel-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.2">
                <rect x="2" y="4" width="9" height="16" rx="1.5" />
                <rect x="13" y="4" width="9" height="16" rx="1.5" />
              </svg>
              <span>Population Separation: 500 NEW Pilot vs. 500 Historical Lot (Gated by D6-EV-2)</span>
            </div>
            {quarantineUnlocked ? (
              <div className="interval-compare">
                <div className="interval-box teal-border">
                  <div className="interval-header">Pilot Lot: 500 NEW Units</div>
                  <div className="interval-big teal-text">492 / 500 PASS</div>
                  <div className="interval-stats">
                    <span>Built after A1/A4/A5 implementation</span>
                    <span>0 / 30 J12 anomalies &bull; 0 unauthorized releases</span>
                  </div>
                </div>
                <div className="interval-box risk-border">
                  <div className="interval-header">Historical Lot: 500 Suspect Units</div>
                  <div className="interval-big risk-text">Quarantined (Hold)</div>
                  <div className="interval-stats">
                    <span><strong>398 WIP &bull; 87 FG &bull; 15 Diagnostics</strong> (+ 60 Retest-PASS)</span>
                    <span>Built under modified recipe; requires documented rework/disposition</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="gated-visual-placeholder">
                <span>
                  Inspect required record <strong>&ldquo;Quarantine Status of the 500 Historical Contained Units&rdquo;</strong> below to compare the 500 NEW pilot population against the 500 quarantined historical units.
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }

    case 'D7':
      return (
        <div className="visual-panel">
          <div className="visual-panel-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.2">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Systemic Prevention Defense Layers &amp; Control Lifecycle Status (Map C1–C5 in Step 1A)</span>
          </div>
          <div className="org-grid">
            <div className="org-card">
              <strong>Layer 1: Occurrence Prevention (SMT Equipment)</strong>
              <span>Target: Prevent unvalidated recipe edits at the reflow oven (Supported by E05, E06-B)</span>
              <span className={`mini-chip ${isVerified ? 'teal' : 'neutral'}`} style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                {isVerified ? 'Status: Approved in D7 Plan (Oven Audit Tracked)' : 'Status: Proposed — Map C1 in Step 1A'}
              </span>
            </div>
            <div className="org-card">
              <strong>Layer 2: Escape Prevention (Test &amp; MES Routing)</strong>
              <span>Target: Block uninvestigated retest-PASS movement into WIP (Supported by E07)</span>
              <span className={`mini-chip ${isVerified ? 'teal' : 'neutral'}`} style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                {isVerified ? 'Status: Approved in D7 Plan (MES Lock Audit Tracked)' : 'Status: Proposed — Map C3 & C4 in Step 1A'}
              </span>
            </div>
            <div className="org-card">
              <strong>Layer 3: Systemic Change &amp; Audit Governance</strong>
              <span>Target: Dual engineering/quality ECN sign-off &amp; Layered Process Audits (Supported by E08)</span>
              <span className={`mini-chip ${isVerified ? 'warning' : 'neutral'}`} style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
                {isVerified ? 'Status: Approved in D7 Plan (Weekly/Monthly LPA Pending)' : 'Status: Proposed — Map C2 & C5 in Step 1A'}
              </span>
            </div>
          </div>
        </div>
      );

    case 'D8':
      return (
        <div className="visual-panel">
          <div className="visual-panel-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <span>D8 Evidence-Based Closure Gate: Documented Case Facts vs. Open Obligations</span>
          </div>
          <div className="org-grid">
            <div className="org-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>1. D4 RCA &amp; D6 NEW Pilot (500 Units)</strong>
                <span className="mini-chip teal">VERIFIED FACT</span>
              </div>
              <span>492/500 PASS (98.4% FPY &ge; 98.0%), 0/30 J12 defects, 0 customer escapes</span>
            </div>
            <div className="org-card" style={{ borderLeftColor: simulatedClosureAssumption ? '#0d9488' : '#dc2626' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>2. Historical 500 Units + 60 Retest-PASS</strong>
                <span className={`mini-chip ${simulatedClosureAssumption ? 'warning' : 'risk'}`}>
                  {simulatedClosureAssumption ? 'SIMULATED / ASSUMED' : 'EVIDENCE MISSING'}
                </span>
              </div>
              <span>
                {simulatedClosureAssumption
                  ? 'Assumed complete for classroom demonstration ONLY (not in canonical case file)'
                  : '398 WIP + 87 FG + 15 Diag quarantined; no physical rework/scrap completion record in case file'}
              </span>
            </div>
            <div className="org-card" style={{ borderLeftColor: simulatedClosureAssumption ? '#0d9488' : '#d97706' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>3. D7 Systemic Controls (C1–C5)</strong>
                <span className="mini-chip warning">
                  {simulatedClosureAssumption ? 'SIMULATED / ASSUMED' : 'PLAN APPROVED / AUDIT PENDING'}
                </span>
              </div>
              <span>
                {simulatedClosureAssumption
                  ? 'MES lock & LPA audits assumed complete for classroom training scenario'
                  : 'Standardized in D7 Control Plan; physical MES lock & multi-cycle LPA audit logs pending'}
              </span>
            </div>
            <div className="org-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>4. Official 8D Gate Status</strong>
                <span className={`mini-chip ${!isVerified ? 'neutral' : simulatedClosureAssumption ? 'teal' : 'warning'}`}>
                  {!isVerified
                    ? 'AUDIT IN PROGRESS'
                    : simulatedClosureAssumption
                    ? 'DEMO: HYPOTHETICAL CLOSURE (SIMULATED)'
                    : 'ACTUAL CASE: CLOSURE PENDING'}
                </span>
              </div>
              <span>
                {!isVerified
                  ? 'Complete Step 1A, Step 1B, and Step 2 below to record D8 gate status'
                  : simulatedClosureAssumption
                  ? 'D8 Exercise Verified — Actual Case Status: Closure Pending | Classroom Demonstration: Hypothetical Closure (SIMULATED / ASSUMED)'
                  : 'D8 Exercise Verified — Formal 8D Closure Pending (Actual Case Status: Closure Pending)'}
              </span>
            </div>
          </div>
        </div>
      );
  }
};
