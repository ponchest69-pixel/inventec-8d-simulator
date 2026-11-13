import { CASE_METADATA, DISCIPLINES, DisciplineConfig, DisciplineId } from '../data/disciplinesData';

export interface D4DraftProgress {
  selectedHypotheses: string[];
  verdicts: Record<string, 'supported' | 'rejected' | ''>;
  physicalCause: string;
  occurrenceCause: string;
  escapeCause: string;
  systemicCause: string;
  physicalEvidence?: string;
  occurrenceEvidence?: string;
  escapeEvidence?: string;
  systemicEvidence?: string;
}

export interface DisciplineProgressState {
  unlockedEvidenceIds: string[];
  taskValues: Record<string, string>;
  selectedCheckIds: string[];
  selectedDecisionId: string | null;
  d4Draft?: D4DraftProgress;
  simulatedClosureAssumption?: boolean;
  attempts: number;
  isVerified: boolean;
  verifiedAt?: string;
  lastFeedback?: {
    isApproved: boolean;
    headline: string;
    feedbackMessage: string;
    hints: string[];
  };
}

export interface TeamSessionState {
  teamId: string;
  sessionContextId: string;
  usedInstructorUnlock: boolean;
  activeDisciplineId: DisciplineId;
  disciplines: Record<DisciplineId, DisciplineProgressState>;
}

export const STORAGE_KEY_PREFIX = 'inventec_8d_simulator_v2_';
export const ACTIVE_TEAM_KEY = 'inventec_8d_active_team_v2';

export const TEAM_OPTIONS = [
  { id: 'Team 1', label: 'Team 1' },
  { id: 'Team 2', label: 'Team 2' },
  { id: 'Team 3', label: 'Team 3' },
  { id: 'Team 4', label: 'Team 4' },
  { id: 'Team 5', label: 'Team 5' },
  { id: 'Practice', label: 'Individual Practice' }
];

export function createInitialD4Draft(): D4DraftProgress {
  return {
    selectedHypotheses: [],
    verdicts: {},
    physicalCause: '',
    occurrenceCause: '',
    escapeCause: '',
    systemicCause: '',
    physicalEvidence: '',
    occurrenceEvidence: '',
    escapeEvidence: '',
    systemicEvidence: ''
  };
}

export function createInitialDisciplineState(disciplineId: DisciplineId): DisciplineProgressState {
  const disc = DISCIPLINES.find((d) => d.id === disciplineId);
  const initialUnlocked = disc
    ? disc.evidenceCards.filter((c) => !c.progressiveLockedByDefault).map((c) => c.id)
    : [];
  return {
    unlockedEvidenceIds: [...initialUnlocked],
    taskValues: {},
    selectedCheckIds: [],
    selectedDecisionId: null,
    d4Draft: disciplineId === 'D4' ? createInitialD4Draft() : undefined,
    simulatedClosureAssumption: disciplineId === 'D8' ? false : undefined,
    attempts: 0,
    isVerified: false,
    verifiedAt: undefined,
    lastFeedback: undefined
  };
}

function generateSessionContextId(teamId: string): string {
  const cleanTeam = teamId.toUpperCase().replace(/[^A-Z0-9]+/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `INV8D-${cleanTeam}-${randomSuffix}`;
}

export function createDefaultTeamState(teamId: string): TeamSessionState {
  return {
    teamId,
    sessionContextId: generateSessionContextId(teamId),
    usedInstructorUnlock: false,
    activeDisciplineId: 'D0',
    disciplines: {
      D0: createInitialDisciplineState('D0'),
      D1: createInitialDisciplineState('D1'),
      D2: createInitialDisciplineState('D2'),
      D3: createInitialDisciplineState('D3'),
      D4: createInitialDisciplineState('D4'),
      D5: createInitialDisciplineState('D5'),
      D6: createInitialDisciplineState('D6'),
      D7: createInitialDisciplineState('D7'),
      D8: createInitialDisciplineState('D8')
    }
  };
}

export function isDisciplineUnlockedForSession(
  state: TeamSessionState,
  disciplineIndex: number,
  instructorPreview = false
): boolean {
  if (instructorPreview || disciplineIndex === 0) return true;
  for (let i = 0; i < disciplineIndex; i++) {
    const prevId = DISCIPLINES[i].id;
    if (!state.disciplines[prevId]?.isVerified) {
      return false;
    }
  }
  return true;
}

export interface ClosureStatusSummary {
  code: 'OPEN_IN_PROGRESS' | 'CLOSURE_PENDING_EVIDENCE' | 'CLOSED_SIMULATED_ASSUMPTION';
  badgeLabel: string;
  headline: string;
  actualCaseStatusLabel: string;
  exerciseStatusLabel: string;
  classroomDemoStatusLabel: string;
  explanation: string;
  tone: 'neutral' | 'warning' | 'teal';
}

export function getD8ClosureStatus(state: TeamSessionState): ClosureStatusSummary {
  const d8 = state.disciplines.D8;
  if (!d8?.isVerified) {
    return {
      code: 'OPEN_IN_PROGRESS',
      badgeLabel: 'OPEN — D8 AUDIT PENDING',
      headline: '8D Investigation In Progress (Not Yet Closed)',
      actualCaseStatusLabel: 'Actual Case Status: Closure Pending (D8 Gate Audit In Progress)',
      exerciseStatusLabel: 'D8 Classroom Exercise: Pending Verification',
      classroomDemoStatusLabel: 'Classroom Demonstration: Inactive',
      explanation:
        'Complete and verify D0–D8 to record the official 8D gate status.',
      tone: 'neutral'
    };
  }

  if (d8.simulatedClosureAssumption) {
    return {
      code: 'CLOSED_SIMULATED_ASSUMPTION',
      badgeLabel: 'ACTUAL CASE: CLOSURE PENDING | DEMO: HYPOTHETICAL CLOSURE (SIMULATED / ASSUMED)',
      headline:
        'D8 Exercise Verified — Formal 8D Closure Pending | Classroom Demonstration: Hypothetical Closure (SIMULATED / ASSUMED)',
      actualCaseStatusLabel: 'Actual Case Status: Closure Pending',
      exerciseStatusLabel: 'D8 Exercise Verified — Formal 8D Closure Pending',
      classroomDemoStatusLabel: 'Classroom Demonstration: Hypothetical Closure (SIMULATED / ASSUMED)',
      explanation:
        'SIMULATED / ASSUMED FOR CLASSROOM TRAINING: D8 classroom exercise is verified. Actual Case Status remains Closure Pending in the canonical case file. Hypothetical closure is demonstrated ONLY by assuming that all 500 historical Interval 2 units (398 WIP, 87 FG, 15 Diagnostics) and 60 retest-PASS units completed documented rework/inspection and that D7 MES/LPA audits were verified.',
      tone: 'teal'
    };
  }

  return {
    code: 'CLOSURE_PENDING_EVIDENCE',
    badgeLabel: 'CLOSURE PENDING — HISTORICAL DISPOSITION EVIDENCE REQUIRED',
    headline: 'D8 Exercise Verified — Formal 8D Closure Pending',
    actualCaseStatusLabel: 'Actual Case Status: Closure Pending',
    exerciseStatusLabel: 'D8 Exercise Verified — Formal 8D Closure Pending',
    classroomDemoStatusLabel: 'Classroom Demonstration: Inactive (Canonical Case Status Only)',
    explanation:
      'D0–D8 classroom exercise and the 500-unit NEW pilot (98.4% FPY, 0/30 J12 defects, 0 customer escapes) are verified. Actual Case Status remains Closure Pending until documented physical rework/inspection/scrap records are completed for the 500 quarantined historical units (398 WIP, 87 FG, 15 Diagnostics) and 60 retest-PASS units, plus D7 MES/LPA audit verification.',
    tone: 'warning'
  };
}

export function getDisciplineMetricsSnapshot(
  disc: DisciplineConfig,
  prog?: DisciplineProgressState
): string {
  if (disc.id !== 'D8') {
    return disc.reportEntrySummary.metricsSnapshot;
  }
  const demoStatus = prog?.simulatedClosureAssumption
    ? 'Classroom Demonstration: Hypothetical Closure (SIMULATED / ASSUMED)'
    : 'Classroom Demonstration: Inactive (Canonical Case Status Only)';
  return `D8 Exercise Verified — Formal 8D Closure Pending | Actual Case Status: Closure Pending (500 Hist. + 60 Retest-PASS + D7 Audits Pending) | ${demoStatus}`;
}

export function hasNonSequentialProgress(
  disciplines: Record<DisciplineId, DisciplineProgressState>,
  activeDisciplineId: DisciplineId
): boolean {
  const activeIdx = DISCIPLINES.findIndex((d) => d.id === activeDisciplineId);
  for (let i = 1; i < DISCIPLINES.length; i++) {
    const discId = DISCIPLINES[i].id;
    const prog = disciplines[discId];
    const priorAllVerified = DISCIPLINES.slice(0, i).every(
      (prev) => disciplines[prev.id]?.isVerified
    );
    if (!priorAllVerified) {
      if (prog?.isVerified || (prog?.attempts ?? 0) > 0 || activeIdx === i) {
        return true;
      }
    }
  }
  return false;
}

export function loadActiveTeamId(): string {
  try {
    return localStorage.getItem(ACTIVE_TEAM_KEY) || 'Team 1';
  } catch {
    return 'Team 1';
  }
}

export function saveActiveTeamId(teamId: string): void {
  try {
    localStorage.setItem(ACTIVE_TEAM_KEY, teamId);
  } catch {
    // Ignore storage quota errors
  }
}

export function loadTeamSession(teamId: string): TeamSessionState {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${teamId}`);
    if (!raw) return createDefaultTeamState(teamId);
    const parsed = JSON.parse(raw) as Partial<TeamSessionState>;
    const defaults = createDefaultTeamState(teamId);
    const mergedDisciplines = { ...defaults.disciplines };

    for (const disc of DISCIPLINES) {
      const savedDisc = parsed.disciplines?.[disc.id];
      if (savedDisc) {
        const isVerified = Boolean(savedDisc.isVerified);
        const validCheckIds = new Set(disc.checkOptions.map((c) => c.id));
        const requiredCheckIds = disc.checkOptions
          .filter((c) => c.isRequired)
          .map((c) => c.id);

        const rawSelectedChecks = Array.isArray(savedDisc.selectedCheckIds)
          ? savedDisc.selectedCheckIds.filter((id) => validCheckIds.has(id))
          : [];
        const sanitizedChecks = isVerified ? requiredCheckIds : rawSelectedChecks;

        let sanitizedFeedback = savedDisc.lastFeedback;
        if (isVerified && sanitizedFeedback?.isApproved) {
          sanitizedFeedback = {
            ...sanitizedFeedback,
            headline:
              disc.approvedHeadline ||
              (disc.id === 'D4'
                ? 'D4 Root Cause Analysis Verified'
                : `${disc.id} Verified`),
            feedbackMessage: disc.approvedFeedback
          };
        }

        const rawD4 = savedDisc.d4Draft;
        const sanitizedD4: D4DraftProgress | undefined =
          disc.id === 'D4'
            ? {
                ...createInitialD4Draft(),
                ...(rawD4 || {}),
                selectedHypotheses:
                  Array.isArray(rawD4?.selectedHypotheses) &&
                  rawD4!.selectedHypotheses.length > 0
                    ? [...rawD4!.selectedHypotheses]
                    : isVerified
                    ? ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']
                    : [],
                verdicts:
                  rawD4?.verdicts && Object.keys(rawD4.verdicts).length > 0
                    ? { ...rawD4.verdicts }
                    : isVerified
                    ? {
                        H1: 'rejected',
                        H2: 'rejected',
                        H3: 'rejected',
                        H4: 'supported',
                        H5: 'supported',
                        H6: 'supported'
                      }
                    : {},
                physicalCause:
                  rawD4?.physicalCause || (isVerified ? 'PHY-J12' : ''),
                occurrenceCause:
                  rawD4?.occurrenceCause || (isVerified ? 'OCC-REFLOW' : ''),
                escapeCause:
                  rawD4?.escapeCause || (isVerified ? 'ESC-RETEST' : ''),
                systemicCause:
                  rawD4?.systemicCause || (isVerified ? 'SYS-GOV' : ''),
                physicalEvidence:
                  rawD4?.physicalEvidence || (isVerified ? 'E04, E06' : ''),
                occurrenceEvidence:
                  rawD4?.occurrenceEvidence || (isVerified ? 'E05, E06-B' : ''),
                escapeEvidence:
                  rawD4?.escapeEvidence || (isVerified ? 'E07' : ''),
                systemicEvidence:
                  rawD4?.systemicEvidence || (isVerified ? 'E08' : '')
              }
            : undefined;

        mergedDisciplines[disc.id] = {
          ...defaults.disciplines[disc.id],
          ...savedDisc,
          unlockedEvidenceIds: Array.isArray(savedDisc.unlockedEvidenceIds)
            ? [...savedDisc.unlockedEvidenceIds]
            : [...defaults.disciplines[disc.id].unlockedEvidenceIds],
          taskValues:
            savedDisc.taskValues && typeof savedDisc.taskValues === 'object'
              ? { ...savedDisc.taskValues }
              : {},
          selectedCheckIds: sanitizedChecks,
          simulatedClosureAssumption:
            disc.id === 'D8' ? Boolean(savedDisc.simulatedClosureAssumption) : undefined,
          d4Draft: sanitizedD4,
          lastFeedback: sanitizedFeedback
        };
      }
    }

    const activeDisciplineId = parsed.activeDisciplineId || 'D0';
    const nonSequential = hasNonSequentialProgress(
      mergedDisciplines,
      activeDisciplineId
    );

    return {
      teamId,
      sessionContextId: parsed.sessionContextId || defaults.sessionContextId,
      usedInstructorUnlock: Boolean(parsed.usedInstructorUnlock) && nonSequential,
      activeDisciplineId,
      disciplines: mergedDisciplines
    };
  } catch {
    return createDefaultTeamState(teamId);
  }
}

export function saveTeamSession(state: TeamSessionState): void {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${state.teamId}`, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

export function resetTeamSession(teamId: string): TeamSessionState {
  const fresh = createDefaultTeamState(teamId);
  try {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${teamId}`);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${teamId}`, JSON.stringify(fresh));
  } catch {
    // Ignore storage errors
  }
  return fresh;
}

const D4_ROOT_CAUSE_LABELS: Record<string, string> = {
  'PHY-J12': 'Insufficient solder at J12 terminal 4 causing intermittent electrical contact',
  'OCC-REFLOW': 'Unvalidated thermal reflow recipe change before the second 500 units',
  'ESC-RETEST': 'Release into WIP after retest PASS without investigating the original FAIL',
  'SYS-GOV': 'Insufficient change control, independent validation, and retest disposition instructions'
};

export function formatVerifiedTeamSelections(
  discId: DisciplineId,
  prog: DisciplineProgressState
): string[] {
  if (!prog.isVerified) return [];
  const disc = DISCIPLINES.find((d) => d.id === discId);
  if (!disc) return [];

  if (discId === 'D4') {
    const d = prog.d4Draft || createInitialD4Draft();
    const physicalLabel =
      D4_ROOT_CAUSE_LABELS[d.physicalCause] ||
      d.physicalCause ||
      D4_ROOT_CAUSE_LABELS['PHY-J12'];
    const occurrenceLabel =
      D4_ROOT_CAUSE_LABELS[d.occurrenceCause] ||
      d.occurrenceCause ||
      D4_ROOT_CAUSE_LABELS['OCC-REFLOW'];
    const escapeLabel =
      D4_ROOT_CAUSE_LABELS[d.escapeCause] ||
      d.escapeCause ||
      D4_ROOT_CAUSE_LABELS['ESC-RETEST'];
    const systemicLabel =
      D4_ROOT_CAUSE_LABELS[d.systemicCause] ||
      d.systemicCause ||
      D4_ROOT_CAUSE_LABELS['SYS-GOV'];

    const physicalBasis = d.physicalEvidence || 'E04, E06';
    const occurrenceBasis = d.occurrenceEvidence || 'E05, E06-B';
    const escapeBasis = d.escapeEvidence || 'E07';
    const systemicBasis = d.systemicEvidence || 'E08';

    const hypothesesList =
      d.selectedHypotheses && d.selectedHypotheses.length > 0
        ? d.selectedHypotheses.join(', ')
        : 'H1, H2, H3, H4, H5, H6';

    const supportedIds = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].filter(
      (hId) =>
        (d.verdicts?.[hId] ||
          (['H4', 'H5', 'H6'].includes(hId) ? 'supported' : 'rejected')) ===
        'supported'
    );
    const rejectedIds = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].filter(
      (hId) =>
        (d.verdicts?.[hId] ||
          (['H4', 'H5', 'H6'].includes(hId) ? 'supported' : 'rejected')) ===
        'rejected'
    );

    const inspectedList =
      prog.unlockedEvidenceIds && prog.unlockedEvidenceIds.length > 0
        ? prog.unlockedEvidenceIds.join(', ')
        : 'E01, E02, E03, E04, E05, E06, E06-B, E07, E08';

    return [
      `In-Scope Hypotheses Investigated (Stage A): ${hypothesesList}`,
      `Evidence Records Inspected (Stage B — ${prog.unlockedEvidenceIds?.length || 9}/9): ${inspectedList}`,
      `Hypothesis Verdicts (Stage C): Supported [${supportedIds.join(', ')}] | Rejected [${rejectedIds.join(', ')}]`,
      `Physical Cause: ${physicalLabel} (Confirming Evidence: ${physicalBasis})`,
      `Occurrence Cause: ${occurrenceLabel} (Confirming Evidence: ${occurrenceBasis})`,
      `Potential Escape Cause: ${escapeLabel} (Confirming Evidence: ${escapeBasis})`,
      `Systemic Cause: ${systemicLabel} (Confirming Evidence: ${systemicBasis})`
    ];
  }

  const lines: string[] = [];
  if (disc.interactiveTasks && disc.interactiveTasks.length > 0) {
    for (const task of disc.interactiveTasks) {
      const val = prog.taskValues?.[task.id] || task.expectedValue;
      const matchedOpt = task.options.find((o) => o.value === val);
      if (matchedOpt && val) {
        lines.push(`${task.label}: ${matchedOpt.label}`);
      }
    }
  }

  const chosenChecks = disc.checkOptions
    .filter((c) => c.isRequired && prog.selectedCheckIds.includes(c.id))
    .map((c) => c.label);
  const fallbackRequiredChecks =
    chosenChecks.length > 0
      ? chosenChecks
      : disc.checkOptions.filter((c) => c.isRequired).map((c) => c.label);

  if (fallbackRequiredChecks.length > 0) {
    const checkHeader =
      discId === 'D7'
        ? `Verified Prevention Plan Controls (Approved in D7 Plan; MES/LPA Audit Verification Pending) (${fallbackRequiredChecks.length})`
        : `Verified Checks (${fallbackRequiredChecks.length})`;
    lines.push(`${checkHeader}: ${fallbackRequiredChecks.join(' | ')}`);
  }

  const chosenDec =
    disc.decisionOptions.find((d) => d.id === prog.selectedDecisionId) ||
    disc.decisionOptions.find((d) => d.isExpected);
  if (chosenDec) {
    lines.push(`Selected Gate Decision: ${chosenDec.label}`);
  }

  return lines;
}

export function buildCumulativeReportHtml(state: TeamSessionState): string {
  const verifiedCount = DISCIPLINES.filter((d) => state.disciplines[d.id]?.isVerified).length;
  const closureStatus = getD8ClosureStatus(state);
  const sessionModeLabel = state.usedInstructorUnlock
    ? 'Instructor Unlock / Non-Sequential Testing Session'
    : 'Sequential Participant Classroom Session';

  const closureBannerBg =
    closureStatus.code === 'CLOSED_SIMULATED_ASSUMPTION'
      ? '#F0FDFA'
      : closureStatus.code === 'CLOSURE_PENDING_EVIDENCE'
      ? '#FFFBEB'
      : '#F8FAFC';
  const closureBannerBorder =
    closureStatus.code === 'CLOSED_SIMULATED_ASSUMPTION'
      ? '#0D9488'
      : closureStatus.code === 'CLOSURE_PENDING_EVIDENCE'
      ? '#D97706'
      : '#94A3B8';

  const rowsHtml = DISCIPLINES.map((disc) => {
    const prog = state.disciplines[disc.id];
    const isVerified = Boolean(prog?.isVerified);
    const statusBadge = isVerified
      ? disc.id === 'D8' && !prog.simulatedClosureAssumption
        ? '<span style="background:#B45309;color:#FFFFFF;padding:3px 10px;border-radius:4px;font-size:12px;font-weight:700;">VERIFIED — CLOSURE PENDING EVIDENCE</span>'
        : disc.id === 'D8' && prog.simulatedClosureAssumption
        ? '<span style="background:#0D9488;color:#FFFFFF;padding:3px 10px;border-radius:4px;font-size:12px;font-weight:700;">VERIFIED — SIMULATED CLOSURE</span>'
        : '<span style="background:#0D9488;color:#FFFFFF;padding:3px 10px;border-radius:4px;font-size:12px;font-weight:700;">VERIFIED</span>'
      : '<span style="background:#E2E8F0;color:#475569;padding:3px 10px;border-radius:4px;font-size:12px;font-weight:700;">PENDING</span>';

    const teamSelectionLines = isVerified ? formatVerifiedTeamSelections(disc.id, prog) : [];
    const inspectedEvidenceList =
      prog?.unlockedEvidenceIds && prog.unlockedEvidenceIds.length > 0
        ? prog.unlockedEvidenceIds.join(', ')
        : 'Standard discipline brief';

    const simulatedNoteHtml =
      isVerified && disc.id === 'D8'
        ? `<div style="margin:8px 0;padding:8px 12px;background:${
            prog.simulatedClosureAssumption ? '#FEF2F2' : '#FFFBEB'
          };border-left:4px solid ${
            prog.simulatedClosureAssumption ? '#DC2626' : '#D97706'
          };font-size:12px;color:${
            prog.simulatedClosureAssumption ? '#991B1B' : '#92400E'
          };">
             <div><strong>D8 Exercise Status:</strong> ${closureStatus.exerciseStatusLabel}</div>
             <div><strong>Actual Case Status:</strong> Closure Pending (500 historical Interval 2 units [398 WIP, 87 FG, 15 Diagnostics] + 60 retest-PASS units disposition &amp; D7 MES/LPA audit logs pending)</div>
             <div><strong>${closureStatus.classroomDemoStatusLabel}</strong>${
            prog.simulatedClosureAssumption
              ? ' — SIMULATED / ASSUMED CLASSROOM SCENARIO: Instructor simulation toggle is active. Historical disposition and D7 audit completion are assumed ONLY for classroom demonstration, not from canonical case evidence.'
              : ''
          }</div>
           </div>`
        : '';

    const metricsSnapshotText = getDisciplineMetricsSnapshot(disc, prog);

    return `
      <div style="border:1px solid #CBD5E1;border-radius:8px;padding:16px;margin-bottom:14px;background:${isVerified ? '#FFFFFF' : '#F8FAFC'};">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #E2E8F0;padding-bottom:8px;margin-bottom:10px;">
          <strong style="font-size:16px;color:#0F172A;">${disc.fullTitle}</strong>
          <div>${statusBadge}</div>
        </div>
        ${
          isVerified
            ? `
          <p style="margin:6px 0;font-size:13px;color:#334155;"><strong>Predefined Case Conclusions &amp; Documented Facts:</strong> ${disc.reportEntrySummary.caseFacts}</p>
          <p style="margin:6px 0;font-size:13px;color:#0F172A;"><strong>Official Discipline Gate Summary:</strong> ${disc.reportEntrySummary.verifiedDecision}</p>
          <div style="margin:8px 0;padding:8px 12px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:6px;font-size:12px;color:#1E293B;">
            <strong>Verified Team Selections &amp; Evidence Trace:</strong>
            <ul style="margin:4px 0 0 0;padding-left:18px;">
              ${teamSelectionLines.map((line) => `<li>${line}</li>`).join('')}
              <li><strong>Inspected Evidence Records:</strong> ${inspectedEvidenceList}</li>
            </ul>
          </div>
          <p style="margin:6px 0;font-size:12.5px;color:#92400E;background:#FFFBEB;padding:6px 10px;border-radius:4px;border-left:3px solid #D97706;"><strong>Open / Next Obligations:</strong> ${disc.reportEntrySummary.pendingObligations}</p>
          ${simulatedNoteHtml}
          <p style="margin:6px 0;font-size:12px;color:#0F766E;background:#F0FDFA;padding:6px 10px;border-radius:4px;font-family:monospace;"><strong>Metrics Snapshot:</strong> ${metricsSnapshotText}</p>
          <p style="margin:4px 0 0 0;font-size:11px;color:#64748B;">Attempts: ${prog.attempts} &bull; Verified Timestamp: ${prog.verifiedAt || 'Completed'} &bull; Session: ${state.sessionContextId}</p>
        `
            : `<p style="margin:6px 0;font-size:13px;color:#64748B;font-style:italic;">Discipline not yet verified in this session (Attempts so far: ${prog?.attempts || 0}). Unverified or rejected draft selections are excluded from official conclusions.</p>`
        }
      </div>
    `;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Inventec Cumulative 8D Report — ${state.teamId}</title>
</head>
<body style="font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#F1F5F9;color:#0F172A;margin:0;padding:32px;">
  <div style="max-width:940px;margin:0 auto;background:#FFFFFF;border:1px solid #CBD5E1;border-radius:10px;padding:28px 32px;box-shadow:0 4px 12px rgba(15,23,42,0.06);">
    <div style="border-bottom:3px solid #0F172A;padding-bottom:16px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;">
      <div>
        <div style="font-size:12px;font-weight:700;letter-spacing:0.08em;color:#0D9488;text-transform:uppercase;">Inventec 8D Problem Solving Workshop</div>
        <h1 style="margin:4px 0 6px 0;font-size:24px;color:#0F172A;">Cumulative Executive 8D Investigation Report</h1>
        <div style="font-size:13px;color:#475569;">Case ID: <strong>${CASE_METADATA.case_id}</strong> &bull; Session ID: <strong>${state.sessionContextId}</strong></div>
        <div style="font-size:12px;color:#64748B;margin-top:2px;">Session Mode: <strong>${sessionModeLabel}</strong></div>
      </div>
      <div style="text-align:right;font-size:13px;color:#334155;">
        <div><strong>Team:</strong> ${state.teamId}</div>
        <div><strong>Verified Disciplines:</strong> ${verifiedCount} / ${DISCIPLINES.length}</div>
        <div><strong>8D Gate Badge:</strong> ${closureStatus.badgeLabel}</div>
        <div><strong>${closureStatus.actualCaseStatusLabel}</strong></div>
        <div><strong>${closureStatus.classroomDemoStatusLabel}</strong></div>
        <div><strong>Generated:</strong> ${new Date().toLocaleString('en-US')}</div>
      </div>
    </div>

    <div style="background:${closureBannerBg};border:1px solid ${closureBannerBorder};border-left:5px solid ${closureBannerBorder};border-radius:6px;padding:12px 16px;margin-bottom:20px;">
      <div style="font-size:13px;font-weight:700;color:#0F172A;">Official 8D Gate &amp; Closure Summary: ${closureStatus.headline}</div>
      <div style="font-size:12px;font-weight:600;color:#0F172A;margin-top:4px;">${closureStatus.actualCaseStatusLabel} &bull; ${closureStatus.classroomDemoStatusLabel}</div>
      <div style="font-size:12.5px;color:#334155;margin-top:4px;">${closureStatus.explanation}</div>
    </div>

    ${rowsHtml}
  </div>
</body>
</html>`;
}

export function downloadCumulativeReportHtml(state: TeamSessionState): void {
  const html = buildCumulativeReportHtml(state);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeTeam = state.teamId.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  a.href = url;
  a.download = `inventec-8d-report-${safeTeam}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
