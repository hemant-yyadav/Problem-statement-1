import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="header-container">
            <div className="header-content">
                <h1>College Event Certificate Eligibility Board</h1>
                <p className="header-subtitle">
                    Organizing team dashboard for evaluating participant activity completion and certificate eligibility.
                </p>
            </div>

            <div className="rule-banner">
                <div className="rule-badge">ELIGIBILITY RULE</div>
                <p className="rule-text">
                    A participant is eligible <strong>ONLY</strong> when all three categories (<strong>LEARN</strong>, <strong>BUILD</strong>, <strong>SHARE</strong>) are covered <em>AND</em> total points <strong>&ge; 6</strong>.
                </p>
            </div>
        </header>
    );
};
