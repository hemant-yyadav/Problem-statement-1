import React, { useState } from 'react';
import { ActivityTable } from './components/ActivityTable';
import { Header } from './components/Header';
import { ParticipantEditor } from './components/ParticipantEditor';
import { ResultsDisplay } from './components/ResultsDisplay';
import { ValidationBanner } from './components/ValidationBanner';
import { Participant } from './models/types';
import {
    createInitialBoardState,
    evaluateBoardState,
    resetBoardState,
} from './logic/state';

export const App: React.FC = () => {
    const [boardState, setBoardState] = useState(createInitialBoardState);

    const handleUpdateParticipants = (updatedParticipants: Participant[]) => {
        setBoardState((prev) => ({
            ...prev,
            participants: updatedParticipants,
            // Clear previous calculated outputs when input data changes
            results: [],
            eligibleCount: null,
            ineligibleCount: null,
            validationErrors: [],
            isEvaluated: false,
        }));
    };

    const handleEvaluate = () => {
        setBoardState((prev) => evaluateBoardState(prev));
    };

    const handleReset = () => {
        setBoardState(resetBoardState());
    };

    return (
        <div className="app-container">
            <Header />

            <main className="main-content flex-column gap-4">
                <ActivityTable />

                <ParticipantEditor
                    participants={boardState.participants}
                    onUpdateParticipants={handleUpdateParticipants}
                    onEvaluate={handleEvaluate}
                    onReset={handleReset}
                />

                <ValidationBanner errors={boardState.validationErrors} />

                <ResultsDisplay
                    isEvaluated={boardState.isEvaluated}
                    results={boardState.results}
                    eligibleCount={boardState.eligibleCount}
                    ineligibleCount={boardState.ineligibleCount}
                />
            </main>

            <footer className="app-footer">
                <p>College Event Certificate Eligibility Board &bull; In-Memory Evaluation Engine</p>
            </footer>
        </div>
    );
};

export default App;
