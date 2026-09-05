import { Activity, EvaluationResult, EvaluationSummary, Participant, ValidationError } from '../models/types';
import { evaluateParticipant } from './evaluator';
import { validateParticipants } from './validator';

export interface BoardEvaluationOutput extends EvaluationSummary {
    validationErrors: ValidationError[];
    isValid: boolean;
}

/**
 * Main entry function for evaluating the board state.
 * Validates participant records and calculates eligibility results if valid.
 */
export function evaluateBoard(
    participants: Participant[],
    activities: readonly Activity[]
): BoardEvaluationOutput {
    const validationErrors = validateParticipants(participants, activities);

    if (validationErrors.length > 0) {
        // Validation failure clears calculated results and counts
        return {
            validationErrors,
            results: [],
            eligibleCount: 0,
            ineligibleCount: 0,
            isValid: false,
        };
    }

    // Evaluate each participant
    const results: EvaluationResult[] = participants.map((p) =>
        evaluateParticipant(p, activities)
    );

    // Sort results:
    // 1. Eligible participants appear before ineligible participants
    // 2. Within each status, participant ID ascending
    results.sort((a, b) => {
        if (a.isEligible !== b.isEligible) {
            return a.isEligible ? -1 : 1;
        }
        return a.participantId.localeCompare(b.participantId);
    });

    const eligibleCount = results.filter((r) => r.isEligible).length;
    const ineligibleCount = results.length - eligibleCount;

    return {
        validationErrors: [],
        results,
        eligibleCount,
        ineligibleCount,
        isValid: true,
    };
}
