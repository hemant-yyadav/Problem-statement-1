import React from 'react';
import { ActivityTableSkeleton } from './components/ActivityTableSkeleton';
import { ParticipantTableSkeleton } from './components/ParticipantTableSkeleton';

export const App: React.FC = () => {
    return (
        <div className="app-container">
            <h1>College Event Certificate Eligibility Board</h1>
            <p className="subtitle">
                Phase 1: Domain Setup & Skeleton Initialization
            </p>

            <ActivityTableSkeleton />
            <ParticipantTableSkeleton />

            <div className="card" style={{ backgroundColor: '#e0f2fe', borderColor: '#bae6fd' }}>
                <h3 style={{ margin: 0, color: '#0369a1' }}>Phase 1 Status</h3>
                <p style={{ margin: '0.5rem 0 0 0', color: '#0c4a6e' }}>
                    Domain models, fixed activity dataset, and built-in participant records initialized cleanly. Evaluation algorithm and UI controls deferred to later phases.
                </p>
            </div>
        </div>
    );
};

export default App;
