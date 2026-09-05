import { EvaluationResult } from '../models/types';

/**
 * Deterministically sorts participant evaluation results.
 * Contract:
 * 1. Eligible participants first.
 * 2. Ineligible participants second.
 * 3. Within each eligibility status group, participant ID ascending (lexicographically).
 */
export function sortEvaluationResults(results: readonly EvaluationResult[]): EvaluationResult[] {
    return [...results].sort((a, b) => {
        // 1. Eligible participants before ineligible
        if (a.isEligible !== b.isEligible) {
            return a.isEligible ? -1 : 1;
        }
        // 2. Within each status group, participant ID ascending
        return a.participantId.localeCompare(b.participantId);
    });
}
