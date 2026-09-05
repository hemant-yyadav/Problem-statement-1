import { Activity, Category, EvaluationResult, FailureReason, Participant } from '../models/types';

/**
 * Evaluates a single valid participant's activity completion and determines eligibility.
 */
export function evaluateParticipant(
    participant: Participant,
    activities: readonly Activity[]
): EvaluationResult {
    const activityMap = new Map<string, Activity>(activities.map((a) => [a.id, a]));

    const trimmedId = participant.id.trim();
    const trimmedName = participant.name.trim();

    let totalPoints = 0;
    const categorySet = new Set<Category>();

    for (const actId of participant.completedActivityIds) {
        const trimmedActId = actId.trim();
        const activity = activityMap.get(trimmedActId);
        if (activity) {
            totalPoints += activity.points;
            categorySet.add(activity.category);
        }
    }

    const REQUIRED_CATEGORIES: Category[] = ['LEARN', 'BUILD', 'SHARE'];
    const coveredCategories = REQUIRED_CATEGORIES.filter((cat) => categorySet.has(cat));

    const hasAllCategories = REQUIRED_CATEGORIES.every((cat) => categorySet.has(cat));
    const hasMinPoints = totalPoints >= 6;
    const isEligible = hasAllCategories && hasMinPoints;

    const failureReasons: FailureReason[] = [];

    if (!isEligible) {
        if (!categorySet.has('LEARN')) {
            failureReasons.push('MISSING_CATEGORY: LEARN');
        }
        if (!categorySet.has('BUILD')) {
            failureReasons.push('MISSING_CATEGORY: BUILD');
        }
        if (!categorySet.has('SHARE')) {
            failureReasons.push('MISSING_CATEGORY: SHARE');
        }
        if (!hasMinPoints) {
            failureReasons.push('POINTS_BELOW_6');
        }
    }

    return {
        participantId: trimmedId,
        participantName: trimmedName,
        totalPoints,
        coveredCategories,
        isEligible,
        failureReasons,
    };
}
