import React from 'react';
import { ValidationError } from '../models/types';

interface ValidationBannerProps {
    errors: ValidationError[];
}

export const ValidationBanner: React.FC<ValidationBannerProps> = ({ errors }) => {
    if (errors.length === 0) return null;

    return (
        <div className="validation-alert-card">
            <div className="alert-header">
                <span className="alert-icon">⚠️</span>
                <div>
                    <h3 className="alert-title">Input Validation Failure</h3>
                    <p className="alert-subtitle">
                        Evaluation halted. Please fix the following participant record issue{errors.length > 1 ? 's' : ''}:
                    </p>
                </div>
            </div>

            <ul className="error-list">
                {errors.map((err, idx) => (
                    <li key={idx} className="error-item">
                        <span className="error-code-badge">{err.code}</span>
                        <div className="error-details">
                            {err.participantId && (
                                <span className="error-context">
                                    Participant: <code>{err.participantId}</code>
                                </span>
                            )}
                            {err.activityId && (
                                <span className="error-context">
                                    Offending Activity: <code>{err.activityId}</code>
                                </span>
                            )}
                            <span className="error-message-text">{err.message}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
