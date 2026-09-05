import React from 'react';
import { FIXED_ACTIVITIES } from '../data/activities';
import { Participant } from '../models/types';

interface ParticipantEditorProps {
    participants: Participant[];
    onUpdateParticipants: (updated: Participant[]) => void;
    onEvaluate: () => void;
    onReset: () => void;
}

export const ParticipantEditor: React.FC<ParticipantEditorProps> = ({
    participants,
    onUpdateParticipants,
    onEvaluate,
    onReset,
}) => {
    const handleIdChange = (index: number, newId: string) => {
        const updated = [...participants];
        updated[index] = { ...updated[index], id: newId };
        onUpdateParticipants(updated);
    };

    const handleNameChange = (index: number, newName: string) => {
        const updated = [...participants];
        updated[index] = { ...updated[index], name: newName };
        onUpdateParticipants(updated);
    };

    const handleToggleActivity = (index: number, actId: string) => {
        const updated = [...participants];
        const currentList = updated[index].completedActivityIds;
        const exists = currentList.includes(actId);

        const newList = exists
            ? currentList.filter((id) => id !== actId)
            : [...currentList, actId];

        updated[index] = { ...updated[index], completedActivityIds: newList };
        onUpdateParticipants(updated);
    };

    const handleAddParticipant = () => {
        const nextNum = participants.length + 1;
        const newId = `C${nextNum < 10 ? '0' + nextNum : nextNum}`;
        const newParticipant: Participant = {
            id: newId,
            name: `Participant ${nextNum}`,
            completedActivityIds: ['A01'],
        };
        onUpdateParticipants([...participants, newParticipant]);
    };

    const handleRemoveParticipant = (index: number) => {
        if (participants.length <= 1) return;
        const updated = participants.filter((_, i) => i !== index);
        onUpdateParticipants(updated);
    };

    return (
        <section className="card section-card">
            <div className="section-header border-bottom pb-3 mb-3">
                <div>
                    <h2>Participant Records</h2>
                    <span className="badge-subtitle">Edit participant details and activity completion</span>
                </div>
                <div className="action-button-group">
                    <button className="btn btn-secondary" onClick={onReset} type="button">
                        Reset to Sample
                    </button>
                    <button className="btn btn-primary" onClick={onEvaluate} type="button">
                        Evaluate Board
                    </button>
                </div>
            </div>

            <div className="table-responsive">
                <table className="data-table editor-table">
                    <thead>
                        <tr>
                            <th style={{ width: '120px' }}>ID</th>
                            <th style={{ width: '180px' }}>Name</th>
                            <th>Completed Activities</th>
                            <th style={{ width: '60px' }} className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {participants.map((p, idx) => (
                            <tr key={idx}>
                                <td>
                                    <input
                                        type="text"
                                        className="input-field text-code"
                                        value={p.id}
                                        onChange={(e) => handleIdChange(idx, e.target.value)}
                                        placeholder="ID"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        className="input-field"
                                        value={p.name}
                                        onChange={(e) => handleNameChange(idx, e.target.value)}
                                        placeholder="Name"
                                    />
                                </td>
                                <td>
                                    <div className="activity-chip-group">
                                        {FIXED_ACTIVITIES.map((act) => {
                                            const isSelected = p.completedActivityIds.includes(act.id);
                                            return (
                                                <button
                                                    key={act.id}
                                                    type="button"
                                                    className={`chip-btn ${isSelected ? 'chip-selected' : ''}`}
                                                    onClick={() => handleToggleActivity(idx, act.id)}
                                                    title={`${act.name} (${act.category}, ${act.points} pts)`}
                                                >
                                                    <span className="chip-check">{isSelected ? '✓' : '+'}</span>
                                                    {act.id} ({act.category})
                                                </button>
                                            );
                                        })}
                                    </div>
                                </td>
                                <td className="text-center">
                                    <button
                                        type="button"
                                        className="btn-icon btn-remove"
                                        onClick={() => handleRemoveParticipant(idx)}
                                        title="Remove participant"
                                        disabled={participants.length <= 1}
                                    >
                                        ×
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-3 flex justify-between align-center">
                <button type="button" className="btn btn-outline" onClick={handleAddParticipant}>
                    + Add Participant Row
                </button>
                <span className="text-muted text-sm">
                    {participants.length} participant record{participants.length !== 1 ? 's' : ''} loaded
                </span>
            </div>
        </section>
    );
};
