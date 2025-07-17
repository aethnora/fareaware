import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserAccount, createCustomerPortalSession, cancelSubscription } from '../services/api';
import { Loader2, User, CreditCard, XCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PlanUsageTracker from '../components/dashboard/PlanUsageTracker'; // <-- Import the new component

const AccountPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchAccountData = async () => {
      if (!currentUser) {
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const data = await getUserAccount(currentUser.uid);
        setAccount(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccountData();
  }, [currentUser]);

  const handleManageBilling = async () => {
    setIsProcessing(true);
    setError('');
    try {
      const { url } = await createCustomerPortalSession(currentUser.uid);
      window.location.href = url;
    } catch (err) {
      setError('Could not open billing portal. Please try again later.');
      setIsProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription? You will be reverted to the Free plan at the end of your billing period.')) {
        setIsProcessing(true);
        setError('');
        setFeedback({ type: '', message: '' });
        try {
            await cancelSubscription(currentUser.uid);
            setFeedback({ type: 'success', message: 'Your subscription has been cancelled. Your plan will be updated shortly.' });
            setTimeout(() => window.location.reload(), 3000);
        } catch (err) {
            setFeedback({ type: 'error', message: err.message });
        } finally {
            setIsProcessing(false);
        }
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600 bg-red-50 rounded-lg">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">My Account</h1>
      
      {/* <<< NEW COMPONENT INTEGRATION >>> */}
      <PlanUsageTracker accountData={account} />
      {/* <<< END OF NEW COMPONENT INTEGRATION >>> */}

      {feedback.message && (
        <div className={`p-4 mb-6 rounded-lg flex items-center gap-3 ${feedback.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {feedback.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <p>{feedback.message}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-4">
            <User className="w-10 h-10 text-primary" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Account Details</h2>
              <p className="text-gray-500">{account?.email}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
          {account?.subscription_plan !== 'free' && (
            <>
              <button
                onClick={handleManageBilling}
                disabled={isProcessing}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                Manage Billing
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={isProcessing}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-300"
              >
                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                Cancel Subscription
              </button>
            </>
          )}
          {account?.subscription_plan === 'free' && (
             <button
                onClick={() => navigate('/pricing')}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Upgrade Plan
              </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
