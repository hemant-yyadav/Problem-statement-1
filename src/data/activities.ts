import { Activity } from '../models/types';

/**
 * Fixed Activity Definitions
 * Activity definitions are fixed and unmodifiable.
 */
export const FIXED_ACTIVITIES: readonly Activity[] = [
    { id: 'A01', name: 'Emerging Tech Talk', category: 'LEARN', points: 2 },
    { id: 'A02', name: 'Soldering Mini Lab', category: 'BUILD', points: 3 },
    { id: 'A03', name: 'Project Pitch Circle', category: 'SHARE', points: 2 },
    { id: 'A04', name: 'Open Source Clinic', category: 'BUILD', points: 2 },
] as const;
