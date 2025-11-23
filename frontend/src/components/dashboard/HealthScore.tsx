import React from 'react';

export const HealthScore = () => {
    return (
        <div className="bg-dashboard-card rounded-2xl p-6 border border-dashboard-accent">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-dashboard-text">Overall Health Score</h3>
                <span className="text-2xl font-bold text-dashboard-success">94/100</span>
            </div>

            <div className="w-full h-3 bg-dashboard-accent rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-dashboard-success/80 to-dashboard-success rounded-full w-[94%] shadow-[0_0_10px_rgba(52,199,89,0.3)]"
                ></div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-dashboard-textMuted">Status: <span className="text-dashboard-text font-medium">Excellent</span></span>
                <span className="text-dashboard-textMuted">Updated: <span className="text-dashboard-text font-medium">Just now</span></span>
            </div>
        </div>
    );
};
