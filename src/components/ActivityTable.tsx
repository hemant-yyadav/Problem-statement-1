import React from 'react';
import { FIXED_ACTIVITIES } from '../data/activities';

export const ActivityTable: React.FC = () => {
    return (
        <section className="card section-card">
            <div className="section-header">
                <h2>Fixed Activity Catalog</h2>
                <span className="badge-subtitle">Immutable Activity Definitions</span>
            </div>

            <div className="table-responsive">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Activity Name</th>
                            <th>Category</th>
                            <th className="text-right">Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {FIXED_ACTIVITIES.map((act) => (
                            <tr key={act.id}>
                                <td>
                                    <code className="code-tag">{act.id}</code>
                                </td>
                                <td className="font-medium">{act.name}</td>
                                <td>
                                    <span className={`cat-badge cat-${act.category.toLowerCase()}`}>
                                        {act.category}
                                    </span>
                                </td>
                                <td className="text-right font-bold">{act.points} pts</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
