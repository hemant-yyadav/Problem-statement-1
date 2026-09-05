/**
 * Domain Models for College Event Certificate Eligibility Board
 */

export type Category = 'LEARN' | 'BUILD' | 'SHARE';

export interface Activity {
    id: string;
    name: string;
    category: Category;
    points: number;
}

export interface Participant {
    id: string;
    name: string;
    completedActivityIds: string[];
}

export type FailureReason =
    | 'MISSING_CATEGORY: LEARN'
    | 'MISSING_CATEGORY: BUILD'
    | 'MISSING_CATEGORY: SHARE'
    | 'POINTS_BELOW_6';

export interface EvaluationResult {
    participantId: string;
    participantName: string;
    totalPoints: number;
    coveredCategories: Category[];
    isEligible: boolean;
    failureReasons: FailureReason[];
}

export type ValidationErrorCode =
    | 'INVALID_PARTICIPANT'
    | 'DUPLICATE_PARTICIPANT_ID'
    | 'UNKNOWN_ACTIVITY'
    | 'DUPLICATE_PARTICIPATION';

export interface ValidationError {
    code: ValidationErrorCode;
    message: string;
    participantId?: string;
    activityId?: string;
}

export interface EvaluationSummary {
    eligibleCount: number;
    ineligibleCount: number;
    results: EvaluationResult[];
}
