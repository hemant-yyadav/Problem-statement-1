import { FIXED_ACTIVITIES } from '../data/activities';
import { BUILTIN_PARTICIPANTS } from '../data/participants';
import { Activity, EvaluationResult, Participant, ValidationError } from '../models/types';
import { evaluateParticipant } from './evaluator';
import { sortEvaluationResults } from './sorter';
import { validateParticipants } from './validator';

export interface ApplicationBoardState {
    activities: readonly Activity[];
    participants: Participant[];
    validationErrors: ValidationError[];
    results: EvaluationResult[];
    eligibleCount: number | null;
    ineligibleCount: number | null;
    isEvaluated: boolean;
}

/**
 * Creates a fresh initial state containing built-in activities and participants,
 * with evaluation outputs cleared.
 */
export function createInitialBoardState(): ApplicationBoardState {
    return {
        activities: [...FIXED_ACTIVITIES],
        participants: BUILTIN_PARTICIPANTS.map((p) => ({
            ...p,
            completedActivityIds: [...p.completedActivityIds],
        })),
        validationErrors: [],
        results: [],
        eligibleCount: null,
        ineligibleCount: null,
        isEvaluated: false,
    };
}

/**
 * Triggers evaluation on the given application board state.
 * Validates participant records:
 * - If validation fails: exposes validation errors and clears results and counts.
 * - If validation succeeds: evaluates participants, applies deterministic sorting, and updates counts atomically.
 */
export function evaluateBoardState(state: ApplicationBoardState): ApplicationBoardState {
    const errors = validateParticipants(state.participants, state.activities);

    if (errors.length > 0) {
        return {
            ...state,
            validationErrors: errors,
            results: [],
            eligibleCount: null,
            ineligibleCount: null,
            isEvaluated: false,
        };
    }

    const rawResults = state.participants.map((p) =>
        evaluateParticipant(p, state.activities)
    );

    const sortedResults = sortEvaluationResults(rawResults);
    const eligibleCount = sortedResults.filter((r) => r.isEligible).length;
    const ineligibleCount = sortedResults.length - eligibleCount;

    return {
        ...state,
        validationErrors: [],
        results: sortedResults,
        eligibleCount,
        ineligibleCount,
        isEvaluated: true,
    };
}

/**
 * Resets the application board state back to initial built-in defaults
 * with all calculated results and validation errors cleared.
 */
export function resetBoardState(): ApplicationBoardState {
    return createInitialBoardState();
}
