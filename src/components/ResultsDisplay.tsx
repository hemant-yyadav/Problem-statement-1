import React from 'react';
import { EvaluationResult } from '../models/types';

interface ResultsDisplayProps {
    isEvaluated: boolean;
    results: EvaluationResult[];
    eligibleCount: number | null;
    ineligibleCount: number | null;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
    isEvaluated,
    results,
    eligibleCount,
    ineligibleCount,
}) => {
    if (!isEvaluated || results.length === 0) {
        return (
            <section className="card section-card placeholder-card">
                <div className="placeholder-content">
                    <span className="placeholder-icon">📋</span>
                    <h3>Board Evaluation Output</h3>
                    <p>Click <strong>"Evaluate Board"</strong> to validate records and view certificate eligibility results.</p>
                </div>
            </section>
        );
    }

    const ALL_CATEGORIES = ['LEARN', 'BUILD', 'SHARE'] as const;

    return (
        <section className="card section-card">
            <div className="section-header border-bottom pb-3 mb-3">
                <h2>Evaluation Results</h2>
                <div className="summary-pills">
                    <div className="summary-pill summary-eligible">
                        <span className="pill-dot"></span>
                        <strong>{eligibleCount ?? 0}</strong> Eligible
                    </div>
                    <div className="summary-pill summary-ineligible">
                        <span className="pill-dot"></span>
                        <strong>{ineligibleCount ?? 0}</strong> Ineligible
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="data-table results-table">
                    <thead>
                        <tr>
                            <th style={{ width: '80px' }}>ID</th>
                            <th style={{ width: '130px' }}>Name</th>
                            <th style={{ width: '110px' }} className="text-center">Points</th>
                            <th style={{ width: '220px' }}>Category Coverage</th>
                            <th style={{ width: '130px' }} className="text-center">Status</th>
                            <th>Failure Reasons</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((res) => (
                            <tr
                                key={res.participantId}
                                className={res.isEligible ? 'row-eligible' : 'row-ineligible'}
                            >
                                <td>
                                    <code className="code-tag font-bold">{res.participantId}</code>
                                </td>
                                <td className="font-semibold">{res.participantName}</td>
                                <td className="text-center">
                                    <span
                                        className={`points-badge ${res.totalPoints >= 6 ? 'points-pass' : 'points-fail'
                                            }`}
                                    >
                                        {res.totalPoints} pts
                                    </span>
                                </td>
                                <td>
                                    <div className="category-progress-group">
                                        {ALL_CATEGORIES.map((cat) => {
                                            const isCovered = res.coveredCategories.includes(cat);
                                            return (
                                                <span
                                                    key={cat}
                                                    className={`cat-indicator ${isCovered
                                                            ? `cat-${cat.toLowerCase()}-active`
                                                            : 'cat-inactive'
                                                        }`}
                                                    title={`${cat}: ${isCovered ? 'Covered' : 'Missing'}`}
                                                >
                                                    {cat} {isCovered ? '✓' : '✗'}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </td>
                                <td className="text-center">
                                    <span
                                        className={`status-badge ${res.isEligible ? 'status-eligible' : 'status-ineligible'
                                            }`}
                                    >
                                        {res.isEligible ? 'ELIGIBLE' : 'INELIGIBLE'}
                                    </span>
                                </td>
                                <td>
                                    {res.failureReasons.length === 0 ? (
                                        <span className="text-success text-sm flex align-center gap-1">
                                            <span>✓</span> Criteria met
                                        </span>
                                    ) : (
                                        <ul className="reason-tag-list">
                                            {res.failureReasons.map((reason, i) => (
                                                <li key={i} className="reason-tag">
                                                    {reason}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
