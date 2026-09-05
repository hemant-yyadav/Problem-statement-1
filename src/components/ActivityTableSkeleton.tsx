import React from 'react';
import { FIXED_ACTIVITIES } from '../data/activities';

export const ActivityTableSkeleton: React.FC = () => {
    return (
        <div className="card">
            <h2>Fixed Activity Definitions</h2>
            <table>
                <thead>
                    <tr>
                        <th>Activity ID</th>
                        <th>Activity Name</th>
                        <th>Category</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    {FIXED_ACTIVITIES.map((activity) => (
                        <tr key={activity.id}>
                            <td>{activity.id}</td>
                            <td>{activity.name}</td>
                            <td>
                                <span className={`badge badge-${activity.category.toLowerCase()}`}>
                                    {activity.category}
                                </span>
                            </td>
                            <td>{activity.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
