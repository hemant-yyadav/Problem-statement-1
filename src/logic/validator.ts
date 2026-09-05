import { Activity, Participant, ValidationError } from '../models/types';

/**
 * Validates participant records against fixed activities and validation constraints.
 */
export function validateParticipants(
    participants: Participant[],
    activities: readonly Activity[]
): ValidationError[] {
    const errors: ValidationError[] = [];
    const validActivityIds = new Set(activities.map((a) => a.id));
    const seenParticipantIds = new Set<string>();

    for (const participant of participants) {
        const trimmedId = participant.id.trim();
        const trimmedName = participant.name.trim();

        // 1. Participant ID must be non-empty
        // 2. Participant Name must be non-empty
        if (!trimmedId || !trimmedName) {
            errors.push({
                code: 'INVALID_PARTICIPANT',
                message: `Participant record is invalid: ID '${participant.id}' and Name '${participant.name}' must be non-empty after trimming.`,
                participantId: participant.id,
            });
            // Skip further processing for invalid participant entity
            continue;
        }

        // 3. Participant IDs must be unique
        if (seenParticipantIds.has(trimmedId)) {
            errors.push({
                code: 'DUPLICATE_PARTICIPANT_ID',
                message: `Duplicate participant ID found: '${trimmedId}'.`,
                participantId: trimmedId,
            });
        } else {
            seenParticipantIds.add(trimmedId);
        }

        // Check completed activities
        const seenActivitiesForParticipant = new Set<string>();

        for (const actId of participant.completedActivityIds) {
            const trimmedActId = actId.trim();

            // 4. Activity must exist in fixed activity table
            if (!validActivityIds.has(trimmedActId)) {
                errors.push({
                    code: 'UNKNOWN_ACTIVITY',
                    message: `Unknown activity ID '${actId}' specified for participant '${trimmedId}'.`,
                    participantId: trimmedId,
                    activityId: actId,
                });
            }

            // 5. Duplicate activity IDs for the same participant are invalid
            if (seenActivitiesForParticipant.has(trimmedActId)) {
                errors.push({
                    code: 'DUPLICATE_PARTICIPATION',
                    message: `Duplicate participation in activity '${trimmedActId}' for participant '${trimmedId}'.`,
                    participantId: trimmedId,
                    activityId: trimmedActId,
                });
            } else {
                seenActivitiesForParticipant.add(trimmedActId);
            }
        }
    }

    return errors;
}
