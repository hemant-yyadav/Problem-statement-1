import { describe, it, expect } from 'vitest';
import { FIXED_ACTIVITIES } from '../../data/activities';
import { EvaluationResult } from '../../models/types';
import { sortEvaluationResults } from '../sorter';
import {
    createInitialBoardState,
    evaluateBoardState,
    resetBoardState,
} from '../state';

describe('Phase 3 State Model & Ordering Engine', () => {

    describe('1. Deterministic Ordering', () => {
        it('orders eligible participants first, then ineligible, each sorted by participant ID ascending', () => {
            const mockResults: EvaluationResult[] = [
                { participantId: 'C05', participantName: 'Eshan', totalPoints: 4, coveredCategories: ['LEARN'], isEligible: false, failureReasons: ['POINTS_BELOW_6'] },
                { participantId: 'C02', participantName: 'Bilal', totalPoints: 6, coveredCategories: ['LEARN', 'BUILD', 'SHARE'], isEligible: true, failureReasons: [] },
                { participantId: 'C04', participantName: 'Divya', totalPoints: 7, coveredCategories: ['BUILD', 'SHARE'], isEligible: false, failureReasons: ['MISSING_CATEGORY: LEARN'] },
                { participantId: 'C01', participantName: 'Asha', totalPoints: 7, coveredCategories: ['LEARN', 'BUILD', 'SHARE'], isEligible: true, failureReasons: [] },
                { participantId: 'C03', participantName: 'Chen', totalPoints: 7, coveredCategories: ['LEARN', 'BUILD'], isEligible: false, failureReasons: ['MISSING_CATEGORY: SHARE'] },
            ];

            const sorted = sortEvaluationResults(mockResults);
            const sortedIds = sorted.map((r) => r.participantId);

            // Eligible first: C01, C02 (sorted by ID: C01 then C02)
            // Ineligible second: C03, C04, C05 (sorted by ID: C03 then C04 then C05)
            expect(sortedIds).toEqual(['C01', 'C02', 'C03', 'C04', 'C05']);
        });

        it('sorts participant IDs ascending within the eligible group specifically', () => {
            const eligibleResults: EvaluationResult[] = [
                { participantId: 'C10', participantName: 'Zack', totalPoints: 8, coveredCategories: ['LEARN', 'BUILD', 'SHARE'], isEligible: true, failureReasons: [] },
                { participantId: 'C02', participantName: 'Aaron', totalPoints: 6, coveredCategories: ['LEARN', 'BUILD', 'SHARE'], isEligible: true, failureReasons: [] },
            ];

            const sorted = sortEvaluationResults(eligibleResults);
            expect(sorted.map((r) => r.participantId)).toEqual(['C02', 'C10']);
        });

        it('sorts participant IDs ascending within the ineligible group specifically', () => {
            const ineligibleResults: EvaluationResult[] = [
                { participantId: 'C09', participantName: 'Yash', totalPoints: 3, coveredCategories: ['LEARN'], isEligible: false, failureReasons: ['POINTS_BELOW_6'] },
                { participantId: 'C03', participantName: 'Ben', totalPoints: 4, coveredCategories: ['BUILD'], isEligible: false, failureReasons: ['POINTS_BELOW_6'] },
            ];

            const sorted = sortEvaluationResults(ineligibleResults);
            expect(sorted.map((r) => r.participantId)).toEqual(['C03', 'C09']);
        });
    });

    describe('2. State Evaluation & Validation Failure Behavior', () => {
        it('clears previous successful results and counts when validation fails', () => {
            // 1. Initial valid evaluation
            let state = createInitialBoardState();
            state = evaluateBoardState(state);

            expect(state.isEvaluated).toBe(true);
            expect(state.results).toHaveLength(5);
            expect(state.eligibleCount).toBe(2);
            expect(state.ineligibleCount).toBe(3);

            // 2. Introduce an invalid participant (unknown activity)
            state.participants[0].completedActivityIds.push('UNKNOWN_A99');

            // 3. Evaluate again with invalid participant data
            state = evaluateBoardState(state);

            expect(state.isEvaluated).toBe(false);
            expect(state.validationErrors).toHaveLength(1);
            expect(state.validationErrors[0].code).toBe('UNKNOWN_ACTIVITY');
            expect(state.results).toEqual([]);
            expect(state.eligibleCount).toBeNull();
            expect(state.ineligibleCount).toBeNull();
        });
    });

    describe('3. Reset Behavior & Recovery', () => {
        it('restores built-in activities, participants, and clears calculated output on reset', () => {
            let state = createInitialBoardState();

            // Mutate state (evaluate & alter participant name)
            state = evaluateBoardState(state);
            expect(state.results).toHaveLength(5);

            state.participants[0].name = 'Modified Name';
            state.participants.push({ id: 'C99', name: 'New Participant', completedActivityIds: [] });

            // Trigger reset
            state = resetBoardState();

            expect(state.activities).toEqual(FIXED_ACTIVITIES);
            expect(state.participants).toHaveLength(5);
            expect(state.participants[0].name).toBe('Asha');
            expect(state.validationErrors).toEqual([]);
            expect(state.results).toEqual([]);
            expect(state.eligibleCount).toBeNull();
            expect(state.ineligibleCount).toBeNull();
            expect(state.isEvaluated).toBe(false);
        });

        it('produces expected oracle results again when evaluate is run after reset', () => {
            let state = createInitialBoardState();
            state = evaluateBoardState(state);
            expect(state.eligibleCount).toBe(2);

            // Reset
            state = resetBoardState();
            expect(state.results).toEqual([]);

            // Evaluate again
            state = evaluateBoardState(state);

            expect(state.validationErrors).toEqual([]);
            expect(state.isEvaluated).toBe(true);
            expect(state.eligibleCount).toBe(2);
            expect(state.ineligibleCount).toBe(3);
            expect(state.results.map((r) => r.participantId)).toEqual(['C01', 'C02', 'C03', 'C04', 'C05']);
        });
    });

});
