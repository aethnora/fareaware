import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createCheckoutSession } from '../services/api';
import { CheckCircle2, Loader2 } from 'lucide-react';

const plans = [
  { name: 'Free', price: '$0', flights: 2, priceId: null, features: ['2 Active Flights Tracked', 'Email Price Alerts'], buttonText: 'Get Started', buttonClass: 'bg-gray-200 text-gray-800 hover:bg-gray-300' },
  { name: 'Pro', price: '$4.99', flights: 4, priceId: 'price_1Rkck7P1BWtn2d85yJvvBspQ', features: ['4 Active Flights Tracked', 'Faster Price Checks', 'Priority Support'], buttonText: 'Select Plan', buttonClass: 'bg-primary text-white hover:bg-primary-dark' },
  { name: 'Max', price: '$9.99', flights: 8, priceId: 'price_1RkckIP1BWtn2d85qSZ82jBQ', features: ['8 Active Flights Tracked', 'Fastest Price Checks', 'Dedicated Support'], buttonText: 'Select Plan', buttonClass: 'bg-secondary text-white hover:opacity-90' },
];

const PricingPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState(null); // To show spinner on the correct button

  const handleSelectPlan = async (plan) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // For the free plan, just go to the dashboard
    if (!plan.priceId) {
      navigate('/dashboard');
      return;
    }

    setLoadingPlan(plan.name);
    try {
      const { url } = await createCheckoutSession(plan.priceId, currentUser.uid);
      // Redirect to Stripe's hosted checkout page
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Could not initiate payment. Please try again.');
      setLoadingPlan(null);
    }
  };

  return (
    <div className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Choose Your Plan</h2>
          <p className="mt-4 text-lg text-gray-500">Start tracking flights and saving money today.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.name} className="bg-white rounded-xl shadow-lg p-8 flex flex-col">
              <h3 className="text-2xl font-semibold text-gray-900">{plan.name}</h3>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                <span className="text-base font-medium text-gray-500">/month</span>
              </div>
              <ul className="mt-6 space-y-4 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="ml-3 text-base text-gray-700">{feature}</p>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={loadingPlan === plan.name}
                className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium transition-colors ${plan.buttonClass} disabled:bg-gray-400`}
              >
                {loadingPlan === plan.name ? <Loader2 className="animate-spin mx-auto" /> : plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;