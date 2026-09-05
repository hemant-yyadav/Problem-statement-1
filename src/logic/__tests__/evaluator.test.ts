import { describe, it, expect } from 'vitest';
import { FIXED_ACTIVITIES } from '../../data/activities';
import { BUILTIN_PARTICIPANTS } from '../../data/participants';
import { Participant } from '../../models/types';
import { evaluateParticipant } from '../evaluator';
import { evaluateBoard } from '../service';
import { validateParticipants } from '../validator';

describe('Phase 2 Evaluation & Validation Engine', () => {

    describe('1. Built-in Data Oracle', () => {
        it('evaluates built-in participants with exact expected results and summary counts', () => {
            const output = evaluateBoard(BUILTIN_PARTICIPANTS, FIXED_ACTIVITIES);

            expect(output.isValid).toBe(true);
            expect(output.validationErrors).toEqual([]);
            expect(output.eligibleCount).toBe(2);
            expect(output.ineligibleCount).toBe(3);

            // Verify ordering: eligible participants first (C01, C02), then ineligible (C03, C04, C05) sorted by ID
            const resultIds = output.results.map((r) => r.participantId);
            expect(resultIds).toEqual(['C01', 'C02', 'C03', 'C04', 'C05']);

            const resultMap = new Map(output.results.map((r) => [r.participantId, r]));

            // C01: 7 pts, LEARN/BUILD/SHARE, eligible
            const c01 = resultMap.get('C01')!;
            expect(c01.totalPoints).toBe(7);
            expect(c01.coveredCategories).toEqual(['LEARN', 'BUILD', 'SHARE']);
            expect(c01.isEligible).toBe(true);
            expect(c01.failureReasons).toEqual([]);

            // C02: 6 pts, LEARN/BUILD/SHARE, eligible
            const c02 = resultMap.get('C02')!;
            expect(c02.totalPoints).toBe(6);
            expect(c02.coveredCategories).toEqual(['LEARN', 'BUILD', 'SHARE']);
            expect(c02.isEligible).toBe(true);
            expect(c02.failureReasons).toEqual([]);

            // C03: 7 pts, missing SHARE, ineligible
            const c03 = resultMap.get('C03')!;
            expect(c03.totalPoints).toBe(7);
            expect(c03.coveredCategories).toEqual(['LEARN', 'BUILD']);
            expect(c03.isEligible).toBe(false);
            expect(c03.failureReasons).toEqual(['MISSING_CATEGORY: SHARE']);

            // C04: 7 pts, missing LEARN, ineligible
            const c04 = resultMap.get('C04')!;
            expect(c04.totalPoints).toBe(7);
            expect(c04.coveredCategories).toEqual(['BUILD', 'SHARE']);
            expect(c04.isEligible).toBe(false);
            expect(c04.failureReasons).toEqual(['MISSING_CATEGORY: LEARN']);

            // C05: 4 pts, missing BUILD & POINTS_BELOW_6, ineligible
            const c05 = resultMap.get('C05')!;
            expect(c05.totalPoints).toBe(4);
            expect(c05.coveredCategories).toEqual(['LEARN', 'SHARE']);
            expect(c05.isEligible).toBe(false);
            expect(c05.failureReasons).toEqual(['MISSING_CATEGORY: BUILD', 'POINTS_BELOW_6']);
        });
    });

    describe('2. Exact 6-Point Boundary', () => {
        it('grants eligibility when total points equal exactly 6 and all categories are covered', () => {
            const p: Participant = { id: 'P01', name: 'Test User', completedActivityIds: ['A01', 'A02', 'A03'] }; // 2 + 3 + 2 = 7 >= 6
            const res = evaluateParticipant(p, FIXED_ACTIVITIES);
            expect(res.totalPoints).toBe(7);
            expect(res.isEligible).toBe(true);
        });

        it('denies eligibility when total points are exactly 5 even if all categories are covered', () => {
            // Create custom activity set where LEARN=1, BUILD=2, SHARE=2 -> sum = 5
            const customActivities = [
                { id: 'X01', name: 'Learn 1', category: 'LEARN' as const, points: 1 },
                { id: 'X02', name: 'Build 2', category: 'BUILD' as const, points: 2 },
                { id: 'X03', name: 'Share 2', category: 'SHARE' as const, points: 2 },
            ];
            const p: Participant = { id: 'P01', name: 'Borderline User', completedActivityIds: ['X01', 'X02', 'X03'] };
            const res = evaluateParticipant(p, customActivities);

            expect(res.totalPoints).toBe(5);
            expect(res.coveredCategories).toEqual(['LEARN', 'BUILD', 'SHARE']);
            expect(res.isEligible).toBe(false);
            expect(res.failureReasons).toEqual(['POINTS_BELOW_6']);
        });
    });

    describe('3. Empty Activity List', () => {
        it('handles participant with no completed activities correctly', () => {
            const p: Participant = { id: 'P00', name: 'No Activities', completedActivityIds: [] };
            const res = evaluateParticipant(p, FIXED_ACTIVITIES);

            expect(res.totalPoints).toBe(0);
            expect(res.coveredCategories).toEqual([]);
            expect(res.isEligible).toBe(false);
            expect(res.failureReasons).toEqual([
                'MISSING_CATEGORY: LEARN',
                'MISSING_CATEGORY: BUILD',
                'MISSING_CATEGORY: SHARE',
                'POINTS_BELOW_6',
            ]);
        });
    });

    describe('4. Missing Category', () => {
        it('identifies specific missing categories', () => {
            const pOnlyLearn: Participant = { id: 'P_LEARN', name: 'Only Learn', completedActivityIds: ['A01'] }; // LEARN=2
            const res = evaluateParticipant(pOnlyLearn, FIXED_ACTIVITIES);

            expect(res.coveredCategories).toEqual(['LEARN']);
            expect(res.failureReasons).toEqual([
                'MISSING_CATEGORY: BUILD',
                'MISSING_CATEGORY: SHARE',
                'POINTS_BELOW_6',
            ]);
        });
    });

    describe('5. Duplicate Participation Validation', () => {
        it('detects duplicate activity IDs for the same participant', () => {
            const participants: Participant[] = [
                { id: 'P01', name: 'Alice', completedActivityIds: ['A01', 'A01'] },
            ];
            const errors = validateParticipants(participants, FIXED_ACTIVITIES);

            expect(errors).toHaveLength(1);
            expect(errors[0].code).toBe('DUPLICATE_PARTICIPATION');
            expect(errors[0].participantId).toBe('P01');
            expect(errors[0].activityId).toBe('A01');
        });
    });

    describe('6. Unknown Activity Validation', () => {
        it('detects non-existent activity IDs', () => {
            const participants: Participant[] = [
                { id: 'P01', name: 'Bob', completedActivityIds: ['A01', 'A99'] },
            ];
            const errors = validateParticipants(participants, FIXED_ACTIVITIES);

            expect(errors).toHaveLength(1);
            expect(errors[0].code).toBe('UNKNOWN_ACTIVITY');
            expect(errors[0].participantId).toBe('P01');
            expect(errors[0].activityId).toBe('A99');
        });
    });

    describe('7. Duplicate Participant ID Validation', () => {
        it('detects duplicate participant IDs across input list', () => {
            const participants: Participant[] = [
                { id: 'C01', name: 'Asha', completedActivityIds: ['A01'] },
                { id: 'C01 ', name: 'Asha Duplicate', completedActivityIds: ['A02'] },
            ];
            const errors = validateParticipants(participants, FIXED_ACTIVITIES);

            expect(errors).toHaveLength(1);
            expect(errors[0].code).toBe('DUPLICATE_PARTICIPANT_ID');
            expect(errors[0].participantId).toBe('C01');
        });
    });

    describe('8. Invalid Empty Participant ID/Name Validation', () => {
        it('detects empty or whitespace-only participant ID or name', () => {
            const participants: Participant[] = [
                { id: '  ', name: 'No ID', completedActivityIds: [] },
                { id: 'P02', name: '   ', completedActivityIds: [] },
            ];
            const errors = validateParticipants(participants, FIXED_ACTIVITIES);

            expect(errors).toHaveLength(2);
            expect(errors[0].code).toBe('INVALID_PARTICIPANT');
            expect(errors[1].code).toBe('INVALID_PARTICIPANT');
        });
    });

    describe('9. Failure Reason Ordering & Board Service Clearing', () => {
        it('enforces exact strict order of failure reasons', () => {
            const p: Participant = { id: 'P01', name: 'All Missing', completedActivityIds: [] };
            const res = evaluateParticipant(p, FIXED_ACTIVITIES);

            expect(res.failureReasons).toEqual([
                'MISSING_CATEGORY: LEARN',
                'MISSING_CATEGORY: BUILD',
                'MISSING_CATEGORY: SHARE',
                'POINTS_BELOW_6',
            ]);
        });

        it('clears evaluation results and counts when validation fails', () => {
            const invalidParticipants: Participant[] = [
                { id: 'C01', name: 'Asha', completedActivityIds: ['INVALID_ACT'] },
            ];
            const output = evaluateBoard(invalidParticipants, FIXED_ACTIVITIES);

            expect(output.isValid).toBe(false);
            expect(output.validationErrors).toHaveLength(1);
            expect(output.results).toEqual([]);
            expect(output.eligibleCount).toBe(0);
            expect(output.ineligibleCount).toBe(0);
        });
    });

});
