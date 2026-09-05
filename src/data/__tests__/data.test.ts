import { describe, it, expect } from 'vitest';
import { FIXED_ACTIVITIES } from '../activities';
import { BUILTIN_PARTICIPANTS } from '../participants';

describe('Phase 1 Data Structures', () => {
    it('contains exactly 4 fixed activities', () => {
        expect(FIXED_ACTIVITIES).toHaveLength(4);
        expect(FIXED_ACTIVITIES.map((a) => a.id)).toEqual(['A01', 'A02', 'A03', 'A04']);
    });

    it('contains exactly 5 built-in participants', () => {
        expect(BUILTIN_PARTICIPANTS).toHaveLength(5);
        expect(BUILTIN_PARTICIPANTS.map((p) => p.id)).toEqual(['C01', 'C02', 'C03', 'C04', 'C05']);
    });
});
