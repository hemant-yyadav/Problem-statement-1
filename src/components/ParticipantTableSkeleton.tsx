import React from 'react';
import { BUILTIN_PARTICIPANTS } from '../data/participants';

export const ParticipantTableSkeleton: React.FC = () => {
    return (
        <div className="card">
            <h2>Built-in Participant Records</h2>
            <table>
                <thead>
                    <tr>
                        <th>Participant ID</th>
                        <th>Name</th>
                        <th>Completed Activity IDs</th>
                    </tr>
                </thead>
                <tbody>
                    {BUILTIN_PARTICIPANTS.map((participant) => (
                        <tr key={participant.id}>
                            <td>{participant.id}</td>
                            <td>{participant.name}</td>
                            <td>{participant.completedActivityIds.join(', ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
