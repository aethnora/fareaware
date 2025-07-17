import React, { useState, useMemo, useEffect } from 'react';
// This will now correctly import from your project structure
import { useAuth } from '../context/AuthContext'; 
import { addTrip } from '../services/api';

// --- SVG Icon Components ---
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const PlaneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path></svg>;
const TicketIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M13 5v2"></path><path d="M13 17v2"></path><path d="M13 11v2"></path></svg>;
const DollarSignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const LoaderIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>;

// --- Data Configuration ---
const airlineData = {
  'AA': { name: 'American Airlines', fares: ['Basic Economy', 'Main Cabin', 'Business', 'First'] },
  'DL': { name: 'Delta Air Lines', fares: ['Basic Economy', 'Main Cabin', 'Comfort+', 'First Class', 'Delta One'] },
  'UA': { name: 'United Airlines', fares: ['Basic Economy', 'Economy', 'Economy Plus', 'First', 'Polaris'] },
  'AS': { name: 'Alaska Airlines', fares: ['Saver', 'Main', 'First Class'] },
  'B6': { name: 'JetBlue', fares: ['Blue Basic', 'Blue', 'Blue Plus', 'Mint'] },
  'WN': { name: 'Southwest Airlines', fares: ['Wanna Get Away', 'Wanna Get Away+', 'Anytime', 'Business Select'] },
};

const fareToAmadeusCode = {
  'Basic Economy': 'ECONOMY', 'Main Cabin': 'ECONOMY', 'Economy': 'ECONOMY', 'Economy Plus': 'ECONOMY',
  'Comfort+': 'PREMIUM_ECONOMY', 'Saver': 'ECONOMY', 'Main': 'ECONOMY', 'Blue Basic': 'ECONOMY',
  'Blue': 'ECONOMY', 'Blue Plus': 'ECONOMY', 'Wanna Get Away': 'ECONOMY', 'Wanna Get Away+': 'ECONOMY',
  'Anytime': 'ECONOMY', 'Business Select': 'BUSINESS', 'Business': 'BUSINESS', 'First Class': 'FIRST',
  'First': 'FIRST', 'Delta One': 'BUSINESS', 'Polaris': 'BUSINESS', 'Mint': 'BUSINESS',
};

// --- Main Component ---
const AdvancedManualEntryPage = () => {
  const { currentUser } = useAuth();
  const [tripType, setTripType] = useState('roundtrip');
  const [formData, setFormData] = useState({
    bookingReference: '', airlineIataCode: 'AA', departureAirport: '',
    arrivalAirport: '', departureDate: '', departureTime: '',
    returnDate: '', returnTime: '', serviceClass: 'Main Cabin', totalPrice: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const availableFares = useMemo(() => {
    return airlineData[formData.airlineIataCode]?.fares || [];
  }, [formData.airlineIataCode]);

  useEffect(() => {
    if (!availableFares.includes(formData.serviceClass)) {
      setFormData(prev => ({ ...prev, serviceClass: availableFares[0] }));
    }
  }, [availableFares, formData.serviceClass]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTripTypeChange = (newTripType) => {
    setTripType(newTripType);
    if (newTripType === 'oneway') {
      setFormData(prev => ({ ...prev, returnDate: '', returnTime: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.bookingReference || !formData.departureAirport || !formData.arrivalAirport || 
        !formData.departureDate || !formData.totalPrice || 
        (tripType === 'roundtrip' && !formData.returnDate)) {
      setFeedback({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    setIsLoading(true);
    setFeedback({ type: '', message: '' });

    if (!currentUser) {
      setFeedback({ type: 'error', message: 'You must be logged in to add a trip.' });
      setIsLoading(false);
      return;
    }

    const allDates = [formData.departureDate];
    if (tripType === 'roundtrip' && formData.returnDate) {
      allDates.push(formData.returnDate);
    }

    // <<< MODIFIED: Added user's email to the payload >>>
    const payload = {
      userId: currentUser.uid,
      email: currentUser.email, // <-- This is the crucial addition
      bookingReference: formData.bookingReference.toUpperCase(),
      airline: airlineData[formData.airlineIataCode].name,
      airlineIataCode: formData.airlineIataCode,
      departureAirport: formData.departureAirport.toUpperCase(),
      arrivalAirport: formData.arrivalAirport.toUpperCase(),
      departureDate: formData.departureDate,
      departureTime: formData.departureTime,
      arrivalDate: tripType === 'roundtrip' ? formData.returnDate : null,
      returnTime: tripType === 'roundtrip' ? formData.returnTime : null,
      allDates: allDates,
      serviceClass: formData.serviceClass,
      amadeusTravelClass: fareToAmadeusCode[formData.serviceClass] || 'ECONOMY',
      totalPrice: parseFloat(formData.totalPrice),
      currency: 'USD',
    };

    try {
      await addTrip(payload);
      setFeedback({ type: 'success', message: 'Success! Your flight has been added and is now being tracked.' });
      setTimeout(() => {
        setFormData({
            bookingReference: '', airlineIataCode: 'AA', departureAirport: '',
            arrivalAirport: '', departureDate: '', departureTime: '',
            returnDate: '', returnTime: '', serviceClass: 'Main Cabin', totalPrice: '',
        });
        setFeedback({ type: '', message: '' });
      }, 3000);
    } catch (error) {
      setFeedback({ type: 'error', message: error.message || 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Track a New Flight</h1>
          <p className="text-lg text-gray-600">Enter your flight details below to start tracking price drops</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <div className="space-y-8">
            <div className="flex gap-3 p-1 bg-gray-100 rounded-xl">
              <button type="button" onClick={() => handleTripTypeChange('roundtrip')} className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${tripType === 'roundtrip' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-600 hover:text-gray-800'}`}>Round Trip</button>
              <button type="button" onClick={() => handleTripTypeChange('oneway')} className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${tripType === 'oneway' ? 'bg-white text-blue-600 shadow-md' : 'text-gray-600 hover:text-gray-800'}`}>One Way</button>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b border-gray-200">Trip Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Booking Reference</label>
                  <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><TicketIcon /></div><input type="text" name="bookingReference" value={formData.bookingReference} onChange={handleInputChange} className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" placeholder="R4ND0M"/></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Price Paid</label>
                  <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><DollarSignIcon /></div><input type="number" name="totalPrice" value={formData.totalPrice} onChange={handleInputChange} className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" placeholder="450.75" step="0.01"/></div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b border-gray-200">Route & Dates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departure Airport</label>
                  <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><PlaneIcon /></div><input type="text" name="departureAirport" value={formData.departureAirport} onChange={handleInputChange} className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors uppercase" placeholder="JFK" maxLength="3"/></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Arrival Airport</label>
                  <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><PlaneIcon /></div><input type="text" name="arrivalAirport" value={formData.arrivalAirport} onChange={handleInputChange} className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors uppercase" placeholder="LAX" maxLength="3"/></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date</label>
                  <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><CalendarIcon /></div><input type="date" name="departureDate" value={formData.departureDate} onChange={handleInputChange} className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"/></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departure Time <span className="text-gray-400">(Optional)</span></label>
                  <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><ClockIcon /></div><input type="time" name="departureTime" value={formData.departureTime} onChange={handleInputChange} className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"/></div>
                </div>
                {tripType === 'roundtrip' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Return Date</label>
                      <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><CalendarIcon /></div><input type="date" name="returnDate" value={formData.returnDate} onChange={handleInputChange} className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"/></div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Return Time <span className="text-gray-400">(Optional)</span></label>
                      <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><ClockIcon /></div><input type="time" name="returnTime" value={formData.returnTime} onChange={handleInputChange} className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"/></div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b border-gray-200">Fare Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Airline</label>
                  <select name="airlineIataCode" value={formData.airlineIataCode} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors">{Object.entries(airlineData).map(([code, { name }]) => (<option key={code} value={code}>{name}</option>))}</select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fare Class</label>
                  <select name="serviceClass" value={formData.serviceClass} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors">{availableFares.map(fare => (<option key={fare} value={fare}>{fare}</option>))}</select>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button type="button" onClick={handleSubmit} disabled={isLoading} className="w-full flex justify-center items-center gap-3 py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
                {isLoading && <LoaderIcon />}
                {isLoading ? 'Adding Your Flight...' : 'Start Tracking Flight'}
              </button>
            </div>
          </div>
        </div>

        {feedback.message && (
          <div className={`mt-6 p-4 rounded-lg text-center font-medium transition-all duration-300 ${feedback.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {feedback.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedManualEntryPage;
