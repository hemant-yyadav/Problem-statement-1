import { Participant } from '../models/types';

/**
 * Built-in Participant Records
 * Initial sample records provided by the system.
 */
export const BUILTIN_PARTICIPANTS: Participant[] = [
    { id: 'C01', name: 'Asha', completedActivityIds: ['A01', 'A02', 'A03'] },
    { id: 'C02', name: 'Bilal', completedActivityIds: ['A01', 'A03', 'A04'] },
    { id: 'C03', name: 'Chen', completedActivityIds: ['A01', 'A02', 'A04'] },
    { id: 'C04', name: 'Divya', completedActivityIds: ['A02', 'A03', 'A04'] },
    { id: 'C05', name: 'Eshan', completedActivityIds: ['A01', 'A03'] },
];
