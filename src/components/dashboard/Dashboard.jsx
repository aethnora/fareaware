import React, { useState, useEffect } from 'react';
import LifetimeSavings from './LifetimeSavings';
import TripList from './TripList';
import Skeleton from '../ui/Skeleton';
import { useAuth } from '../../context/AuthContext';
import { getUserAccount } from '../../services/api'; 
// <<< MODIFIED: Import the new PlanStatus component >>>
import PlanStatus from './PlanStatus';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const [userAccount, setUserAccount] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            getUserAccount(currentUser.uid)
                .then(data => {
                    setUserAccount(data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error("Failed to fetch user account data:", error);
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, [currentUser]);

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                </div>
                <Skeleton className="h-56 w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <LifetimeSavings finalAmount={parseFloat(userAccount?.lifetime_savings) || 0} />
                
                {/* <<< MODIFIED: Use the new PlanStatus component >>> */}
                <PlanStatus accountData={userAccount} />
            </div>
            
            <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Active Flights</h2>
                <TripList />
            </div>
        </div>
    );
};

export default Dashboard;