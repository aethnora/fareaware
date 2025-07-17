import React from 'react';
import { BarChart2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const planDetails = {
    free: { name: 'Free', limit: 2 },
    pro: { name: 'Pro', limit: 4 },
    max: { name: 'Max', limit: 8 },
};

const PlanUsageTracker = ({ accountData }) => {
    if (!accountData) {
        return null; // Don't render if there's no account data
    }

    const plan = planDetails[accountData.subscription_plan] || planDetails.free;
    const usage = accountData.active_flights;
    const limit = plan.limit;
    const remaining = limit - usage;
    const usagePercentage = limit > 0 ? (usage / limit) * 100 : 0;

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 mb-8">
            <div className="flex items-center gap-4 mb-4">
                <BarChart2 className="w-8 h-8 text-primary" />
                <div>
                    <h3 className="text-xl font-bold text-gray-800">{plan.name} Plan Usage</h3>
                    <p className="text-gray-500">You are tracking {usage} of {limit} available flights.</p>
                </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                    className={`h-4 rounded-full transition-all duration-500 ${usagePercentage >= 100 ? 'bg-red-500' : 'bg-primary'}`}
                    style={{ width: `${usagePercentage}%` }}
                ></div>
            </div>
            <div className="mt-3 flex justify-between items-center text-sm text-gray-600">
                <span>{usage} Used</span>
                <span>{remaining} Remaining</span>
            </div>

            {remaining <= 0 && (
                <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 border-l-4 border-yellow-400 rounded-r-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    <div>
                        <p className="font-semibold">You've reached your flight limit.</p>
                        <p>To track more flights, please <Link to="/pricing" className="font-bold underline hover:text-yellow-900">upgrade your plan</Link>.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanUsageTracker;
