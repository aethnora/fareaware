import React from 'react';
import { DownloadCloud, ArrowRight } from 'lucide-react';
import Dashboard from '../components/dashboard/Dashboard';
import { useAuth } from '../context/AuthContext'; // <-- CORRECT: Import the real useAuth hook

// Placeholder component for the logged-out user's call to action
const SignUpPrompt = () => (
    <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-3xl font-bold mb-2">See Your Dashboard</h2>
        <p className="mb-6">Sign up for a free FareAware account to start tracking flights and saving money!</p>
        <a href="/signup" className="inline-flex items-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors">
            Sign Up to Get Started <ArrowRight className="w-5 h-5" />
        </a>
    </div>
);

const HomePage = () => {
  const { isAuthenticated } = useAuth(); // <-- CORRECT: This now uses the real authentication state
  const CHROME_EXTENSION_URL = "https://chromewebstore.google.com";

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Section 1: Hero / Call to Action */}
      <section className="text-center mb-20">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4 leading-tight">
          Stop Overpaying for Flights.
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          FareAware automatically tracks your booked flights for price drops and notifies you when you can get money back. You keep 100% of the savings.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <a href={CHROME_EXTENSION_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-primary text-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            <DownloadCloud className="w-6 h-6" />
            Add to Chrome — It's Free
          </a>
        </div>
        <div className="mt-8 text-gray-500">
            <p>Don't use Chrome? No problem.</p>
            <a href="/manual-entry" className="font-semibold text-primary hover:underline">
                Use the manual entry form to start tracking.
            </a>
        </div>
      </section>

      {/* Section 2: Dynamic Dashboard Section */}
      <section>
        {isAuthenticated ? <Dashboard /> : <SignUpPrompt />}
      </section>
    </div>
  );
};

export default HomePage;
