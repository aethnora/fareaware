import React from 'react';
import { Rocket, Star, Crown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Enhanced details for each plan, including a unique icon and gradient style
const planDetails = {
    free: { name: 'Free', limit: 2, Icon: Rocket, gradient: 'from-gray-700 to-gray-900' },
    pro: { name: 'Pro', limit: 4, Icon: Star, gradient: 'from-blue-500 to-indigo-600' },
    max: { name: 'Max', limit: 8, Icon: Crown, gradient: 'from-purple-500 to-violet-700' },
};

const PlanStatus = ({ accountData }) => {
    if (!accountData) {
        return <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-full"></div>;
    }

    const plan = planDetails[accountData.subscription_plan] || planDetails.free;
    const usage = accountData.active_flights;
    const limit = plan.limit;

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col overflow-hidden h-full">
            {/* --- Adaptive Gradient Header --- */}
            <div className={`bg-gradient-to-r ${plan.gradient} p-4 flex justify-between items-center`}>
                <h3 className="text-2xl font-bold text-white">{plan.name} Plan</h3>
                <plan.Icon className="w-8 h-8 text-white opacity-70" />
            </div>

            {/* --- Usage Stats and Call to Action --- */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="text-center flex-grow">
                    <p className="text-gray-600">You are currently tracking</p>
                    <div className="my-2">
                        <span className="text-6xl font-extrabold text-gray-800">{usage}</span>
                        <span className="text-2xl font-bold text-gray-500"> / {limit}</span>
                    </div>
                    <p className="text-gray-600">active flights.</p>
                </div>
                
                <Link to="/pricing" className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-gray-800 text-white font-bold px-4 py-3 rounded-lg hover:bg-black transition-colors transform hover:-translate-y-0.5">
                    {usage >= limit ? "Upgrade to Add More" : "Upgrade Your Plan"}
                    <ArrowRight className="w-5 h-5" />
                </Link>
            </div>
        </div>
    );
};

export default PlanStatus;