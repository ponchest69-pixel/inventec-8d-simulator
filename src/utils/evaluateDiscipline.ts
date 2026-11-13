import { DisciplineConfig } from '../data/disciplinesData';

export interface EvaluationResult {
  isApproved: boolean;
  headline: string;
  feedbackMessage: string;
  hints: string[];
}

export function evaluateDisciplineSubmission(
  discipline: DisciplineConfig,
  selectedCheckIds: string[],
  selectedDecisionId: string | null,
  unlockedEvidenceIds: string[] = [],
  taskValues: Record<string, string> = {}
): EvaluationResult {
  const uninspectedCards = discipline.evidenceCards.filter(
    (card) => card.progressiveLockedByDefault && !unlockedEvidenceIds.includes(card.id)
  );

  if (uninspectedCards.length > 0) {
    return {
      isApproved: false,
      headline: 'Evidence Inspection Incomplete',
      feedbackMessage: 'Inspect all required evidence records before submitting your team decision.',
      hints: uninspectedCards.map(
        (c) => `Inspect required record: "${c.title}" (${c.badge}) in the Evidence section above.`
      )
    };
  }

  if (!selectedDecisionId) {
    return {
      isApproved: false,
      headline: 'Decision Selection Required',
      feedbackMessage: 'Select a decision option in Step 2 before submitting.',
      hints: []
    };
  }

  const chosenDecision = discipline.decisionOptions.find((d) => d.id === selectedDecisionId);
  if (!chosenDecision) {
    return {
      isApproved: false,
      headline: 'Invalid Decision Option',
      feedbackMessage: 'Select a valid decision option in Step 2.',
      hints: []
    };
  }

  const interactiveFields = discipline.interactiveTasks || [];
  const failedTasks = interactiveFields.filter(
    (field) => taskValues[field.id] !== field.expectedValue
  );
  const taskHints = failedTasks.map((field) => `${field.label}: ${field.hintIfIncorrect}`);

  const missedRequired = discipline.checkOptions.filter(
    (opt) => opt.isRequired && !selectedCheckIds.includes(opt.id)
  );
  const selectedDistractors = discipline.checkOptions.filter(
    (opt) => !opt.isRequired && selectedCheckIds.includes(opt.id)
  );

  const checkHints: string[] = [
    ...missedRequired
      .map((opt) => opt.hintIfMissed)
      .filter((h): h is string => Boolean(h)),
    ...selectedDistractors
      .map((opt) => opt.hintIfSelectedWhenIncorrect)
      .filter((h): h is string => Boolean(h))
  ];

  const allHints = [...taskHints, ...checkHints];

  if (!chosenDecision.isExpected) {
    return {
      isApproved: false,
      headline: 'Review Evidence & Revise Decision',
      feedbackMessage: chosenDecision.feedbackWhenSelected,
      hints: allHints.slice(0, 3)
    };
  }

  if (failedTasks.length > 0 || missedRequired.length > 0 || selectedDistractors.length > 0) {
    return {
      isApproved: false,
      headline:
        failedTasks.length > 0
          ? 'Refine Step 1A Interactive Analysis & Step 1B Verification'
          : 'Refine Step 1 Selection',
      feedbackMessage: discipline.incompleteChecksFeedbackPrefix,
      hints: allHints.slice(0, 4)
    };
  }

  return {
    isApproved: true,
    headline: discipline.approvedHeadline || `${discipline.id} Verified`,
    feedbackMessage: discipline.approvedFeedback,
    hints: []
  };
}
