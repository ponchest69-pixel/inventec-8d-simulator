import React, { useEffect, useState } from 'react';
import {
  D4_EVIDENCE_ITEMS,
  D4InvestigationModule
} from './components/D4InvestigationModule';
import { DisciplineVisuals } from './components/DisciplineVisuals';
import {
  DISCIPLINES,
  DisciplineConfig,
  DisciplineId
} from './data/disciplinesData';
import {
  EvaluationResult,
  evaluateDisciplineSubmission
} from './utils/evaluateDiscipline';
import {
  D4DraftProgress,
  TEAM_OPTIONS,
  TeamSessionState,
  createInitialD4Draft,
  createInitialDisciplineState,
  downloadCumulativeReportHtml,
  formatVerifiedTeamSelections,
  getD8ClosureStatus,
  getDisciplineMetricsSnapshot,
  isDisciplineUnlockedForSession,
  loadActiveTeamId,
  loadTeamSession,
  resetTeamSession,
  saveActiveTeamId,
  saveTeamSession
} from './utils/reportExport';

export const App: React.FC = () => {
  const [teamId, setTeamId] = useState<string>(() => loadActiveTeamId());
  const [session, setSession] = useState<TeamSessionState>(() =>
    loadTeamSession(loadActiveTeamId())
  );
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);
  const [instructorPreview, setInstructorPreview] = useState<boolean>(() => {
    try {
      return new URLSearchParams(window.location.search).get('instructor') === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    saveActiveTeamId(teamId);
    const loaded = loadTeamSession(teamId);
    setSession(loaded);
    setInstructorPreview(false);
    setIsResetModalOpen(false);
  }, [teamId]);

  useEffect(() => {
    saveTeamSession(session);
  }, [session]);

  const handleToggleInstructorPreview = (enabled: boolean) => {
    setInstructorPreview(enabled);
  };

  const isDisciplineUnlocked = (index: number): boolean =>
    isDisciplineUnlockedForSession(session, index, instructorPreview);

  const activeDiscipline: DisciplineConfig =
    DISCIPLINES.find((d) => d.id === session.activeDisciplineId) || DISCIPLINES[0];

  const activeProgress =
    session.disciplines[activeDiscipline.id] ||
    createInitialDisciplineState(activeDiscipline.id);

  const verifiedCount = DISCIPLINES.filter(
    (d) => session.disciplines[d.id]?.isVerified
  ).length;

  const closureStatus = getD8ClosureStatus(session);

  const activeIndex = DISCIPLINES.findIndex((d) => d.id === activeDiscipline.id);
  const nextDiscipline =
    activeIndex >= 0 && activeIndex < DISCIPLINES.length - 1
      ? DISCIPLINES[activeIndex + 1]
      : null;

  // Contextual Investigation Task computation (ONLY for disciplines with gated evidence: D2, D3, D4, D6)
  const getInvestigationTaskInfo = () => {
    if (activeDiscipline.id === 'D4') {
      const total = D4_EVIDENCE_ITEMS.length;
      const unlocked = activeProgress.unlockedEvidenceIds;
      const pendingItems = D4_EVIDENCE_ITEMS.filter((e) => !unlocked.includes(e.id));
      return {
        required: true,
        inspectedCount: total - pendingItems.length,
        totalCount: total,
        nextLabel:
          pendingItems.length > 0
            ? `Next required lab records in Stage B: ${pendingItems
                .slice(0, 3)
                .map((e) => `${e.code} (${e.title})`)
                .join(', ')}${pendingItems.length > 3 ? '...' : ''}`
            : 'All 9 laboratory evidence records inspected — complete Stages C & D below.'
      };
    }

    const gatedCards = activeDiscipline.evidenceCards.filter(
      (c) => c.progressiveLockedByDefault
    );
    if (gatedCards.length === 0) {
      return { required: false, inspectedCount: 0, totalCount: 0, nextLabel: '' };
    }

    const totalCards = activeDiscipline.evidenceCards.length;
    const pendingGated = gatedCards.filter(
      (c) => !activeProgress.unlockedEvidenceIds.includes(c.id)
    );
    return {
      required: true,
      inspectedCount: totalCards - pendingGated.length,
      totalCount: totalCards,
      nextLabel:
        pendingGated.length > 0
          ? `Next required evidence record to inspect: "${pendingGated[0].title}" (${pendingGated[0].badge})`
          : `All ${totalCards} evidence records inspected — complete Step 1 and Step 2 below.`
    };
  };

  const investigationTask = getInvestigationTaskInfo();

  const handleSelectDiscipline = (id: DisciplineId, index: number) => {
    if (!isDisciplineUnlocked(index)) return;
    setSession((prev) => {
      const bypassedSequential = !isDisciplineUnlockedForSession(prev, index, false);
      return {
        ...prev,
        usedInstructorUnlock: prev.usedInstructorUnlock || bypassedSequential,
        activeDisciplineId: id
      };
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUnlockEvidenceCard = (cardId: string) => {
    setSession((prev) => {
      const current = prev.disciplines[activeDiscipline.id];
      if (current.unlockedEvidenceIds.includes(cardId)) return prev;
      return {
        ...prev,
        disciplines: {
          ...prev.disciplines,
          [activeDiscipline.id]: {
            ...current,
            unlockedEvidenceIds: [...current.unlockedEvidenceIds, cardId]
          }
        }
      };
    });
  };

  const handleUpdateTaskValue = (taskId: string, value: string) => {
    setSession((prev) => {
      const current = prev.disciplines[activeDiscipline.id];
      return {
        ...prev,
        disciplines: {
          ...prev.disciplines,
          [activeDiscipline.id]: {
            ...current,
            taskValues: {
              ...(current.taskValues || {}),
              [taskId]: value
            },
            isVerified: false
          }
        }
      };
    });
  };

  const handleToggleCheck = (checkId: string) => {
    setSession((prev) => {
      const current = prev.disciplines[activeDiscipline.id];
      const exists = current.selectedCheckIds.includes(checkId);
      const updatedChecks = exists
        ? current.selectedCheckIds.filter((id) => id !== checkId)
        : [...current.selectedCheckIds, checkId];

      return {
        ...prev,
        disciplines: {
          ...prev.disciplines,
          [activeDiscipline.id]: {
            ...current,
            selectedCheckIds: updatedChecks,
            isVerified: false
          }
        }
      };
    });
  };

  const handleSelectDecision = (decisionId: string) => {
    setSession((prev) => {
      const current = prev.disciplines[activeDiscipline.id];
      return {
        ...prev,
        disciplines: {
          ...prev.disciplines,
          [activeDiscipline.id]: {
            ...current,
            selectedDecisionId: decisionId,
            isVerified: false
          }
        }
      };
    });
  };

  const handleSubmitDecision = () => {
    const evaluation = evaluateDisciplineSubmission(
      activeDiscipline,
      activeProgress.selectedCheckIds,
      activeProgress.selectedDecisionId,
      activeProgress.unlockedEvidenceIds,
      activeProgress.taskValues || {}
    );

    setSession((prev) => {
      const current = prev.disciplines[activeDiscipline.id];
      const bypassedSequential = !isDisciplineUnlockedForSession(prev, activeIndex, false);
      return {
        ...prev,
        usedInstructorUnlock: prev.usedInstructorUnlock || bypassedSequential,
        disciplines: {
          ...prev.disciplines,
          [activeDiscipline.id]: {
            ...current,
            attempts: current.attempts + 1,
            isVerified: evaluation.isApproved,
            verifiedAt: evaluation.isApproved
              ? new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : undefined,
            lastFeedback: evaluation
          }
        }
      };
    });
  };

  const handleUpdateD4Draft = (nextDraft: D4DraftProgress) => {
    setSession((prev) => {
      const current = prev.disciplines.D4;
      return {
        ...prev,
        disciplines: {
          ...prev.disciplines,
          D4: {
            ...current,
            d4Draft: nextDraft,
            isVerified: false
          }
        }
      };
    });
  };

  const handleSubmitD4 = (evaluation: EvaluationResult) => {
    setSession((prev) => {
      const current = prev.disciplines.D4;
      const bypassedSequential = !isDisciplineUnlockedForSession(prev, 4, false);
      return {
        ...prev,
        usedInstructorUnlock: prev.usedInstructorUnlock || bypassedSequential,
        disciplines: {
          ...prev.disciplines,
          D4: {
            ...current,
            attempts: current.attempts + 1,
            isVerified: evaluation.isApproved,
            verifiedAt: evaluation.isApproved
              ? new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : undefined,
            lastFeedback: evaluation
          }
        }
      };
    });
  };

  const handleToggleSimulatedClosure = (enabled: boolean) => {
    setSession((prev) => {
      const current = prev.disciplines.D8;
      return {
        ...prev,
        disciplines: {
          ...prev.disciplines,
          D8: {
            ...current,
            simulatedClosureAssumption: enabled
          }
        }
      };
    });
  };

  const handleClearCurrentSelectionsKeepEvidence = () => {
    setSession((prev) => {
      const current = prev.disciplines[activeDiscipline.id];
      return {
        ...prev,
        disciplines: {
          ...prev.disciplines,
          [activeDiscipline.id]: {
            ...current,
            taskValues: {},
            selectedCheckIds: [],
            selectedDecisionId: null,
            d4Draft:
              activeDiscipline.id === 'D4' ? createInitialD4Draft() : undefined,
            simulatedClosureAssumption:
              activeDiscipline.id === 'D8' ? false : undefined,
            isVerified: false,
            verifiedAt: undefined,
            lastFeedback: undefined
          }
        }
      };
    });
  };

  const handleConfirmResetTeamExercise = () => {
    const fresh = resetTeamSession(teamId);
    setInstructorPreview(false);
    setSession(fresh);
    setIsResetModalOpen(false);
    setIsReportModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-shell">
      {/* Top Header */}
      <header className="top-header">
        <div className="brand-block">
          <span className="brand-eyebrow">
            Inventec Quality Workshop &bull; PCBA Simulation
          </span>
          <h1 className="brand-title">
            Interactive 8D Problem Solving Simulator
          </h1>
        </div>

        <div className="header-controls">
          <div className="team-selector-group">
            <label htmlFor="team-select-input">Team:</label>
            <select
              id="team-select-input"
              className="team-select"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
            >
              {TEAM_OPTIONS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <label
            className="team-selector-group"
            style={{ cursor: 'pointer', fontSize: '12px', color: '#CBD5E1' }}
            title="Unlock all discipline tabs for instructor preview/testing"
          >
            <input
              type="checkbox"
              checked={instructorPreview}
              onChange={(e) => handleToggleInstructorPreview(e.target.checked)}
              style={{ accentColor: '#14B8A6' }}
            />
            <span>Instructor Unlock</span>
          </label>

          <button
            type="button"
            className="btn btn-teal"
            onClick={() => setIsReportModalOpen(true)}
          >
            8D Report ({verifiedCount}/9)
          </button>

          <button
            type="button"
            className="btn btn-outline-light"
            onClick={() => downloadCumulativeReportHtml(session)}
          >
            Download Report
          </button>

          <button
            type="button"
            className="btn btn-reset-header"
            onClick={() => setIsResetModalOpen(true)}
          >
            Reset Team Exercise
          </button>
        </div>
      </header>

      {/* Discipline Navigation Tabs (D0 - D8) */}
      <nav className="discipline-nav" aria-label="8D Disciplines">
        {DISCIPLINES.map((disc, idx) => {
          const prog = session.disciplines[disc.id];
          const isCurrent = disc.id === activeDiscipline.id;
          const isVerified = Boolean(prog?.isVerified);
          const unlocked = isDisciplineUnlocked(idx);
          return (
            <button
              key={disc.id}
              type="button"
              disabled={!unlocked}
              onClick={() => handleSelectDiscipline(disc.id, idx)}
              className={`disc-tab ${isCurrent ? 'active' : ''} ${
                isVerified ? 'verified' : ''
              } ${!unlocked ? 'locked-tab' : ''}`}
              title={
                unlocked
                  ? `${disc.fullTitle}`
                  : `Complete and verify ${DISCIPLINES[idx - 1].id} first`
              }
            >
              <span
                className={`disc-badge-dot ${isVerified ? 'verified' : ''}`}
              />
              <span>
                {disc.id}: {disc.shortTitle}
              </span>
              <span style={{ fontSize: '11px', opacity: 0.75 }}>
                {unlocked ? `${disc.durationMinutes}m` : 'Locked'}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Discreet Local Persistence & Session Context Strip */}
      <div className="persistence-strip">
        <span>
          Progress is stored locally in this browser and device. Use the same browser throughout the exercise.
        </span>
        <span>
          Session: <strong>{session.sessionContextId}</strong> &bull;{' '}
          {session.usedInstructorUnlock ? (
            <strong style={{ color: '#B45309' }}>Instructor Testing Mode</strong>
          ) : (
            <span>Sequential Classroom Mode</span>
          )}
        </span>
      </div>

      {/* Main Discipline Workspace */}
      <main className="workspace-container">
        {/* Discipline Title & Management Challenge */}
        <section className="discipline-banner">
          <div className="banner-top-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 className="discipline-title">{activeDiscipline.fullTitle}</h2>
              {activeProgress.isVerified && (
                <span
                  className={`status-pill ${
                    activeDiscipline.id === 'D8' && !activeProgress.simulatedClosureAssumption
                      ? 'warning-pill'
                      : 'approved'
                  }`}
                >
                  {activeDiscipline.id === 'D8'
                    ? closureStatus.badgeLabel
                    : 'VERIFIED OUTCOME'}
                </span>
              )}
            </div>
            <span className="time-pill">
              Activity Time: {activeDiscipline.durationMinutes} min
            </span>
          </div>

          <div className="challenge-box">
            <div className="challenge-label">Management Challenge</div>
            <p className="challenge-quote">
              {activeDiscipline.managementChallenge}
            </p>
          </div>
        </section>

        {/* Contextual Investigation Task Indicator (ONLY on D2, D3, D4, D6) */}
        {investigationTask.required && (
          <section
            className={`investigation-task-bar ${
              investigationTask.inspectedCount === investigationTask.totalCount
                ? 'complete'
                : 'pending'
            }`}
            aria-label="Investigation Task Guidance"
          >
            <div className="inv-task-left">
              <span className="inv-task-badge">
                Investigation Task: {investigationTask.inspectedCount} /{' '}
                {investigationTask.totalCount} Records Inspected
              </span>
              <span className="inv-task-next">{investigationTask.nextLabel}</span>
            </div>
          </section>
        )}

        {/* Key Indicators */}
        <section className="kpi-grid" aria-label="Discipline Key Indicators">
          {activeDiscipline.kpis.map((kpi, idx) => (
            <div key={idx} className={`kpi-card ${kpi.tone || 'neutral'}`}>
              <div className="kpi-label">{kpi.label}</div>
              <div className="kpi-value">{kpi.value}</div>
              {kpi.sublabel && <div className="kpi-sublabel">{kpi.sublabel}</div>}
            </div>
          ))}
        </section>

        {/* Interactive Visual Diagram for Current Discipline */}
        <DisciplineVisuals
          disciplineId={activeDiscipline.id}
          unlockedEvidenceIds={activeProgress.unlockedEvidenceIds}
          isVerified={activeProgress.isVerified}
          simulatedClosureAssumption={Boolean(activeProgress.simulatedClosureAssumption)}
        />

        {/* D4 4-Stage Interactive Investigation vs Standard D0-D3 / D5-D8 Flow */}
        {activeDiscipline.id === 'D4' ? (
          <D4InvestigationModule
            unlockedEvidenceIds={activeProgress.unlockedEvidenceIds}
            d4Draft={activeProgress.d4Draft || createInitialD4Draft()}
            attempts={activeProgress.attempts}
            teamId={teamId}
            onUnlockEvidence={handleUnlockEvidenceCard}
            onUpdateD4Draft={handleUpdateD4Draft}
            onSubmitD4={handleSubmitD4}
            onResetD4SelectionsOnly={handleClearCurrentSelectionsKeepEvidence}
          />
        ) : (
          <>
            {/* Compact Evidence Cards */}
            {activeDiscipline.evidenceCards.length > 0 && (
              <section className="section-card">
                <div className="section-header">
                  <h3 className="section-title">
                    {activeDiscipline.evidenceSectionTitle}
                  </h3>
                </div>

                <div className="evidence-grid">
                  {activeDiscipline.evidenceCards.map((card) => {
                    const isUnlocked =
                      activeProgress.unlockedEvidenceIds.includes(card.id) ||
                      !card.progressiveLockedByDefault;

                    if (!isUnlocked) {
                      return (
                        <div key={card.id} className="evidence-card locked">
                          <div className="evidence-top" style={{ width: '100%' }}>
                            <span className="evidence-title">{card.title}</span>
                            <span className="evidence-badge">{card.badge}</span>
                          </div>
                          <button
                            type="button"
                            className="btn btn-outline-navy btn-sm"
                            onClick={() => handleUnlockEvidenceCard(card.id)}
                          >
                            Inspect Record: {card.title}
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div key={card.id} className="evidence-card">
                        <div className="evidence-top">
                          <span className="evidence-title">{card.title}</span>
                          <span className="evidence-badge">{card.badge}</span>
                        </div>
                        <p className="evidence-summary">{card.summary}</p>
                        <ul className="evidence-details">
                          {card.details.map((detail, i) => (
                            <li key={i}>{detail}</li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Step 1A Interactive Builder / Classification / Mapping Tasks */}
            {activeDiscipline.interactiveTasks &&
              activeDiscipline.interactiveTasks.length > 0 && (
                <section className="section-card">
                  <div className="section-header">
                    <h3 className="section-title">
                      {activeDiscipline.interactiveTaskTitle}
                    </h3>
                    {activeDiscipline.interactiveTaskSubtitle && (
                      <p className="section-subtitle">
                        {activeDiscipline.interactiveTaskSubtitle}
                      </p>
                    )}
                  </div>

                  <div className="interactive-tasks-grid">
                    {activeDiscipline.interactiveTasks.map((field) => {
                      const currentVal = activeProgress.taskValues?.[field.id] || '';
                      return (
                        <div key={field.id} className="task-field-card">
                          <label
                            htmlFor={`task-${field.id}`}
                            className="task-field-label"
                          >
                            {field.label}
                          </label>
                          <div className="task-field-prompt">{field.prompt}</div>
                          <select
                            id={`task-${field.id}`}
                            className="task-field-select"
                            value={currentVal}
                            onChange={(e) =>
                              handleUpdateTaskValue(field.id, e.target.value)
                            }
                          >
                            {field.options.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

            {/* Step 1B Checkboxes */}
            <section className="section-card">
              <div className="section-header">
                <h3 className="section-title">
                  {activeDiscipline.checkPromptTitle}
                </h3>
                <p className="section-subtitle">
                  {activeDiscipline.checkPromptSubtitle}
                </p>
              </div>

              <div className="options-list">
                {activeDiscipline.checkOptions.map((opt) => {
                  const checked = activeProgress.selectedCheckIds.includes(
                    opt.id
                  );
                  return (
                    <label
                      key={opt.id}
                      className={`option-row compact ${checked ? 'selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleToggleCheck(opt.id)}
                      />
                      <div className="option-content">
                        <div className="option-title">{opt.label}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* Step 2 Executive Decision */}
            <section className="section-card">
              <div className="section-header">
                <h3 className="section-title">
                  {activeDiscipline.decisionPromptTitle}
                </h3>
              </div>

              <div className="options-list">
                {activeDiscipline.decisionOptions.map((dec) => {
                  const selected = activeProgress.selectedDecisionId === dec.id;
                  return (
                    <label
                      key={dec.id}
                      className={`option-row ${selected ? 'selected' : ''}`}
                    >
                      <input
                        type="radio"
                        name={`decision-${activeDiscipline.id}`}
                        checked={selected}
                        onChange={() => handleSelectDecision(dec.id)}
                      />
                      <div className="option-content">
                        <div className="option-title">{dec.label}</div>
                        <div className="option-desc">{dec.description}</div>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="action-bar">
                <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                  <strong>{teamId}</strong> &bull; Attempts:{' '}
                  <strong>{activeProgress.attempts}</strong>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn btn-outline-navy"
                    onClick={handleClearCurrentSelectionsKeepEvidence}
                  >
                    Clear Selections (Keep Evidence)
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary-submit"
                    onClick={handleSubmitDecision}
                  >
                    Submit {activeDiscipline.id} Decision
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Deterministic Feedback Banner */}
        {activeProgress.lastFeedback && (
          <section
            className={`feedback-banner ${
              activeProgress.lastFeedback.isApproved ? 'approved' : 'revision'
            }`}
            aria-live="polite"
          >
            <h4 className="feedback-headline">
              {activeProgress.lastFeedback.headline}
            </h4>
            <p className="feedback-text">
              {activeProgress.lastFeedback.feedbackMessage}
            </p>
            {activeProgress.lastFeedback.hints.length > 0 && (
              <ul className="feedback-hints">
                {activeProgress.lastFeedback.hints.map((hint, idx) => (
                  <li key={idx}>{hint}</li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Management Review & Verbal Progression Gate */}
        {activeProgress.isVerified && (
          <section className="management-review-card">
            <div className="review-eyebrow">Management Review</div>
            <blockquote className="review-quote">
              {activeDiscipline.managementReviewQuote}
            </blockquote>

            {/* D8 Closure Status & Optional Classroom Simulation Toggle */}
            {activeDiscipline.id === 'D8' && (
              <div className="d8-closure-governance-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <strong>Official 8D Gate Status: {closureStatus.headline}</strong>
                  <span
                    className={`status-pill ${
                      activeProgress.simulatedClosureAssumption ? 'approved' : 'warning-pill'
                    }`}
                  >
                    {closureStatus.badgeLabel}
                  </span>
                </div>
                <div style={{ marginTop: '6px', fontSize: '12.5px', fontWeight: 600, color: '#0F172A' }}>
                  {closureStatus.actualCaseStatusLabel} &bull; {closureStatus.classroomDemoStatusLabel}
                </div>
                <p style={{ margin: '6px 0', fontSize: '13px', color: '#334155' }}>
                  {closureStatus.explanation}
                </p>
                <label className="simulated-closure-toggle">
                  <input
                    type="checkbox"
                    checked={Boolean(activeProgress.simulatedClosureAssumption)}
                    onChange={(e) => handleToggleSimulatedClosure(e.target.checked)}
                  />
                  <span>
                    <strong>Instructor Classroom Demonstration (SIMULATED / ASSUMED):</strong>{' '}
                    Simulate hypothetical final closure assuming the 500 historical contained units (and 60 retest-PASS units) completed documented rework/inspection and D7 MES/LPA audits were verified. (Explicitly marked SIMULATED / ASSUMED in the UI and exported report.)
                  </span>
                </label>
              </div>
            )}

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <button
                type="button"
                className="btn btn-outline-navy"
                onClick={() => setIsReportModalOpen(true)}
              >
                View Cumulative 8D Report
              </button>

              {nextDiscipline ? (
                <button
                  type="button"
                  className="btn btn-teal"
                  onClick={() =>
                    handleSelectDiscipline(nextDiscipline.id, activeIndex + 1)
                  }
                >
                  Continue to {nextDiscipline.id}: {nextDiscipline.shortTitle}{' '}
                  &rarr;
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-teal"
                  onClick={() => downloadCumulativeReportHtml(session)}
                >
                  Download Final 8D Report (.html)
                </button>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Reset Team Exercise Confirmation Modal */}
      {isResetModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsResetModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-modal-title"
        >
          <div
            className="modal-panel"
            style={{ maxWidth: '500px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <div
                  style={{
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    color: '#FCA5A5',
                    fontWeight: 700
                  }}
                >
                  Confirm Per-Team Reset
                </div>
                <div id="reset-modal-title" style={{ fontSize: '17px', fontWeight: 700 }}>
                  Reset Team Exercise — {teamId}
                </div>
              </div>
              <button
                type="button"
                className="btn btn-outline-light btn-sm"
                onClick={() => setIsResetModalOpen(false)}
              >
                Cancel
              </button>
            </div>

            <div className="modal-body" style={{ gap: '12px' }}>
              <p style={{ margin: 0, fontSize: '13.5px', color: '#0F172A' }}>
                Are you sure you want to reset all <strong>D0–D8</strong> progress for{' '}
                <strong>{teamId}</strong>?
              </p>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '18px',
                  fontSize: '12.5px',
                  color: '#334155',
                  lineHeight: 1.55
                }}
              >
                <li>Clears all answers, decisions, and attempt counters (returns to D0 with 0 attempts)</li>
                <li>Re-locks progressively gated evidence and all 9 D4 laboratory records (E01–E08, E06-B)</li>
                <li>Clears D4 hypotheses, verdicts, and 4-layer root-cause selections</li>
                <li>Locks D1–D8 until their preceding disciplines are verified</li>
                <li>Resets {teamId}&rsquo;s Cumulative 8D Report entries to Pending (0/9)</li>
                <li>
                  <strong>Preserves all other teams&rsquo; progress unchanged</strong>
                </li>
              </ul>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  marginTop: '6px',
                  paddingTop: '12px',
                  borderTop: '1px solid #E2E8F0'
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline-navy"
                  onClick={() => setIsResetModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger-confirm"
                  onClick={handleConfirmResetTeamExercise}
                >
                  Confirm Reset {teamId}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cumulative 8D Report Modal */}
      {isReportModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsReportModalOpen(false)}
        >
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div
                  style={{
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    color: '#5EEAD4',
                    fontWeight: 700
                  }}
                >
                  Cumulative Executive 8D Report &bull; {session.sessionContextId}
                </div>
                <div style={{ fontSize: '17px', fontWeight: 700 }}>
                  {teamId} ({verifiedCount}/9 Verified &bull; {closureStatus.badgeLabel})
                </div>
                <div style={{ fontSize: '11.5px', color: '#CBD5E1', marginTop: '2px' }}>
                  Mode:{' '}
                  {session.usedInstructorUnlock
                    ? 'Instructor Unlock / Non-Sequential Testing Session'
                    : 'Sequential Participant Classroom Session'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-teal"
                  onClick={() => downloadCumulativeReportHtml(session)}
                >
                  Download (.html)
                </button>
                <button
                  type="button"
                  className="btn btn-outline-light"
                  onClick={() => setIsReportModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>

            <div className="modal-body">
              <div className="d8-closure-governance-box" style={{ marginBottom: '4px' }}>
                <strong>Official 8D Gate Status: {closureStatus.headline}</strong>
                <div style={{ marginTop: '4px', fontSize: '12px', fontWeight: 600, color: '#0F172A' }}>
                  {closureStatus.actualCaseStatusLabel} &bull; {closureStatus.classroomDemoStatusLabel}
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#334155' }}>
                  {closureStatus.explanation}
                </p>
              </div>

              {DISCIPLINES.map((disc) => {
                const prog = session.disciplines[disc.id];
                const isVerified = Boolean(prog?.isVerified);
                const teamSelections = isVerified
                  ? formatVerifiedTeamSelections(disc.id, prog)
                  : [];
                return (
                  <div
                    key={disc.id}
                    className={`report-entry-card ${
                      isVerified ? 'verified' : 'pending'
                    }`}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '6px',
                        flexWrap: 'wrap',
                        gap: '6px'
                      }}
                    >
                      <strong style={{ fontSize: '15px', color: '#0F172A' }}>
                        {disc.fullTitle}
                      </strong>
                      <span
                        className={`status-pill ${
                          !isVerified
                            ? 'draft'
                            : disc.id === 'D8' && !prog.simulatedClosureAssumption
                            ? 'warning-pill'
                            : 'approved'
                        }`}
                      >
                        {!isVerified
                          ? 'PENDING'
                          : disc.id === 'D8' && !prog.simulatedClosureAssumption
                          ? 'VERIFIED — CLOSURE PENDING EVIDENCE'
                          : disc.id === 'D8' && prog.simulatedClosureAssumption
                          ? 'VERIFIED — SIMULATED CLOSURE'
                          : 'VERIFIED'}
                      </span>
                    </div>
                    {isVerified ? (
                      <div style={{ fontSize: '13px', color: '#334155' }}>
                        <p style={{ margin: '4px 0' }}>
                          <strong>Case Facts:</strong>{' '}
                          {disc.reportEntrySummary.caseFacts}
                        </p>
                        <p style={{ margin: '4px 0' }}>
                          <strong>Verified Decision:</strong>{' '}
                          {disc.reportEntrySummary.verifiedDecision}
                        </p>
                        {teamSelections.length > 0 && (
                          <div
                            style={{
                              margin: '6px 0',
                              padding: '6px 10px',
                              background: '#F8FAFC',
                              border: '1px solid #E2E8F0',
                              borderRadius: '4px',
                              fontSize: '12px'
                            }}
                          >
                            <strong>Team Verified Selections &amp; Evidence:</strong>
                            <ul style={{ margin: '3px 0 0 0', paddingLeft: '18px' }}>
                              {teamSelections.map((line, i) => (
                                <li key={i}>{line}</li>
                              ))}
                              <li>
                                <strong>Inspected Records:</strong>{' '}
                                {prog.unlockedEvidenceIds.length > 0
                                  ? prog.unlockedEvidenceIds.join(', ')
                                  : 'Standard discipline brief'}
                              </li>
                            </ul>
                          </div>
                        )}
                        <p
                          style={{
                            margin: '4px 0',
                            fontSize: '12px',
                            color: '#92400E',
                            background: '#FFFBEB',
                            padding: '5px 8px',
                            borderRadius: '4px'
                          }}
                        >
                          <strong>Open / Next Obligations:</strong>{' '}
                          {disc.reportEntrySummary.pendingObligations}
                        </p>
                        <p
                          style={{
                            margin: '6px 0 0 0',
                            fontFamily: 'monospace',
                            fontSize: '12px',
                            background: '#F0FDFA',
                            color: '#0F766E',
                            padding: '4px 8px',
                            borderRadius: '4px'
                          }}
                        >
                          {getDisciplineMetricsSnapshot(disc, prog)}
                        </p>
                        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                          Attempts: {prog.attempts} &bull; Verified: {prog.verifiedAt || 'Completed'}
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: '13px', fontStyle: 'italic' }}>
                        Not yet verified (Attempts: {prog?.attempts || 0}). Rejected or incomplete draft selections are excluded.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
