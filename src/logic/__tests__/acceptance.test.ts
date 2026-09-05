import { describe, it, expect } from 'vitest';
import { FIXED_ACTIVITIES } from '../../data/activities';
import {
    createInitialBoardState,
    evaluateBoardState,
    resetBoardState,
} from '../state';

describe('End-to-End Acceptance Scenarios', () => {

    it('Acceptance Scenario 1 — Built-in Oracle', () => {
        let state = createInitialBoardState();
        state = evaluateBoardState(state);

        expect(state.isEvaluated).toBe(true);
        expect(state.validationErrors).toEqual([]);
        expect(state.eligibleCount).toBe(2);
        expect(state.ineligibleCount).toBe(3);

        // Exact ordering: C01, C02, C03, C04, C05
        const resultIds = state.results.map((r) => r.participantId);
        expect(resultIds).toEqual(['C01', 'C02', 'C03', 'C04', 'C05']);

        const resultMap = new Map(state.results.map((r) => [r.participantId, r]));

        // C01 = 7, eligible
        const c01 = resultMap.get('C01')!;
        expect(c01.totalPoints).toBe(7);
        expect(c01.isEligible).toBe(true);
        expect(c01.failureReasons).toEqual([]);

        // C02 = 6, eligible
        const c02 = resultMap.get('C02')!;
        expect(c02.totalPoints).toBe(6);
        expect(c02.isEligible).toBe(true);
        expect(c02.failureReasons).toEqual([]);

        // C03 = 7, missing SHARE
        const c03 = resultMap.get('C03')!;
        expect(c03.totalPoints).toBe(7);
        expect(c03.isEligible).toBe(false);
        expect(c03.failureReasons).toEqual(['MISSING_CATEGORY: SHARE']);

        // C04 = 7, missing LEARN
        const c04 = resultMap.get('C04')!;
        expect(c04.totalPoints).toBe(7);
        expect(c04.isEligible).toBe(false);
        expect(c04.failureReasons).toEqual(['MISSING_CATEGORY: LEARN']);

        // C05 = 4, missing BUILD + POINTS_BELOW_6
        const c05 = resultMap.get('C05')!;
        expect(c05.totalPoints).toBe(4);
        expect(c05.isEligible).toBe(false);
        expect(c05.failureReasons).toEqual(['MISSING_CATEGORY: BUILD', 'POINTS_BELOW_6']);
    });

    it('Acceptance Scenario 2 — Add A04 to C05 (6-point boundary)', () => {
        let state = createInitialBoardState();

        // Modify C05 to A01, A03, A04
        const c05Idx = state.participants.findIndex((p) => p.id === 'C05');
        state.participants[c05Idx].completedActivityIds = ['A01', 'A03', 'A04'];

        state = evaluateBoardState(state);

        const c05Result = state.results.find((r) => r.participantId === 'C05')!;

        expect(c05Result.totalPoints).toBe(6);
        expect(c05Result.coveredCategories).toEqual(['LEARN', 'BUILD', 'SHARE']);
        expect(c05Result.isEligible).toBe(true);
        expect(c05Result.failureReasons).toEqual([]);

        expect(state.eligibleCount).toBe(3);
        expect(state.ineligibleCount).toBe(2);
    });

    it('Acceptance Scenario 3 — Empty C01 Activities', () => {
        let state = createInitialBoardState();

        // Clear C01's completed activities
        const c01Idx = state.participants.findIndex((p) => p.id === 'C01');
        state.participants[c01Idx].completedActivityIds = [];

        state = evaluateBoardState(state);

        const c01Result = state.results.find((r) => r.participantId === 'C01')!;

        expect(c01Result.totalPoints).toBe(0);
        expect(c01Result.coveredCategories).toEqual([]);
        expect(c01Result.isEligible).toBe(false);
        expect(c01Result.failureReasons).toEqual([
            'MISSING_CATEGORY: LEARN',
            'MISSING_CATEGORY: BUILD',
            'MISSING_CATEGORY: SHARE',
            'POINTS_BELOW_6',
        ]);

        expect(state.eligibleCount).toBe(1);
        expect(state.ineligibleCount).toBe(4);
    });

    it('Acceptance Scenario 4 — Duplicate Participation', () => {
        let state = createInitialBoardState();

        // Add a second A01 to C01
        const c01Idx = state.participants.findIndex((p) => p.id === 'C01');
        state.participants[c01Idx].completedActivityIds.push('A01');

        state = evaluateBoardState(state);

        expect(state.isEvaluated).toBe(false);
        expect(state.validationErrors).toHaveLength(1);
        expect(state.validationErrors[0].code).toBe('DUPLICATE_PARTICIPATION');
        expect(state.validationErrors[0].participantId).toBe('C01');
        expect(state.validationErrors[0].activityId).toBe('A01');

        // Calculated outputs cleared
        expect(state.results).toEqual([]);
        expect(state.eligibleCount).toBeNull();
        expect(state.ineligibleCount).toBeNull();
    });

    it('Additional Validation Scenarios', () => {
        // Blank participant ID
        let state = createInitialBoardState();
        state.participants[0].id = '   ';
        state = evaluateBoardState(state);
        expect(state.validationErrors[0].code).toBe('INVALID_PARTICIPANT');
        expect(state.results).toEqual([]);

        // Blank participant name
        state = createInitialBoardState();
        state.participants[0].name = '   ';
        state = evaluateBoardState(state);
        expect(state.validationErrors[0].code).toBe('INVALID_PARTICIPANT');
        expect(state.results).toEqual([]);

        // Duplicate participant ID
        state = createInitialBoardState();
        state.participants[1].id = 'C01';
        state = evaluateBoardState(state);
        expect(state.validationErrors[0].code).toBe('DUPLICATE_PARTICIPANT_ID');
        expect(state.results).toEqual([]);

        // Unknown activity ID
        state = createInitialBoardState();
        state.participants[0].completedActivityIds.push('UNKNOWN_X99');
        state = evaluateBoardState(state);
        expect(state.validationErrors[0].code).toBe('UNKNOWN_ACTIVITY');
        expect(state.results).toEqual([]);
    });

    it('Reset Verification', () => {
        let state = createInitialBoardState();
        state = evaluateBoardState(state);

        // Modify participant records and add errors
        state.participants[0].id = 'C01_MUTATED';
        state.participants[0].completedActivityIds.push('A99');
        state = evaluateBoardState(state);

        expect(state.validationErrors.length).toBeGreaterThan(0);

        // Perform Reset
        state = resetBoardState();

        expect(state.activities).toEqual(FIXED_ACTIVITIES);
        expect(state.participants).toHaveLength(5);
        expect(state.participants.map((p) => p.id)).toEqual(['C01', 'C02', 'C03', 'C04', 'C05']);
        expect(state.validationErrors).toEqual([]);
        expect(state.results).toEqual([]);
        expect(state.eligibleCount).toBeNull();
        expect(state.ineligibleCount).toBeNull();
        expect(state.isEvaluated).toBe(false);

        // Evaluate again
        state = evaluateBoardState(state);
        expect(state.eligibleCount).toBe(2);
        expect(state.ineligibleCount).toBe(3);
        expect(state.results.map((r) => r.participantId)).toEqual(['C01', 'C02', 'C03', 'C04', 'C05']);
    });

});
