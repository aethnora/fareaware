import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { addTrip } from '../../services/api'; 

// --- Component Start ---

// A mapping of major airlines to their IATA codes and typical fare classes
const airlineData = {
    'AA': { name: 'American Airlines', fares: ['Basic Economy', 'Main Cabin', 'Business', 'First'] },
    'DL': { name: 'Delta Air Lines', fares: ['Basic Economy', 'Main Cabin', 'Comfort+', 'First Class', 'Delta One'] },
    'UA': { name: 'United Airlines', fares: ['Basic Economy', 'Economy', 'Economy Plus', 'First', 'Polaris'] },
    'AS': { name: 'Alaska Airlines', fares: ['Saver', 'Main', 'First Class'] },
    'B6': { name: 'JetBlue', fares: ['Blue Basic', 'Blue', 'Blue Plus', 'Mint'] },
    'WN': { name: 'Southwest Airlines', fares: ['Wanna Get Away', 'Wanna Get Away+', 'Anytime', 'Business Select'] },
    // Add more airlines as needed
};

// Maps our user-friendly fare names to Amadeus API travel class codes
const fareToAmadeusCode = {
    'Basic Economy': 'ECONOMY',
    'Main Cabin': 'ECONOMY',
    'Economy': 'ECONOMY',
    'Economy Plus': 'ECONOMY',
    'Comfort+': 'PREMIUM_ECONOMY',
    'Saver': 'ECONOMY',
    'Main': 'ECONOMY',
    'Blue Basic': 'ECONOMY',
    'Blue': 'ECONOMY',
    'Blue Plus': 'ECONOMY',
    'Wanna Get Away': 'ECONOMY',
    'Wanna Get Away+': 'ECONOMY',
    'Anytime': 'ECONOMY',
    'Business Select': 'BUSINESS',
    'Business': 'BUSINESS',
    'First Class': 'FIRST',
    'First': 'FIRST',
    'Delta One': 'BUSINESS',
    'Polaris': 'BUSINESS',
    'Mint': 'BUSINESS',
};


const AdvancedManualEntryPage = () => {
    const { currentUser } = useAuth();
    const [tripType, setTripType] = useState('roundtrip');
    const [formData, setFormData] = useState({
        bookingReference: '',
        airlineIataCode: 'AA', // Default to American Airlines
        departureAirport: '',
        arrivalAirport: '',
        departureDate: '',
        returnDate: '',
        serviceClass: 'Main Cabin', // Default fare
        totalPrice: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    const availableFares = useMemo(() => {
        return airlineData[formData.airlineIataCode]?.fares || [];
    }, [formData.airlineIataCode]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleTripTypeChange = (e) => {
        setTripType(e.target.value);
        // Clear return date if switching to one-way
        if (e.target.value === 'oneway') {
            setFormData(prev => ({ ...prev, returnDate: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFeedback({ type: '', message: '' });

        if (!currentUser) {
            setFeedback({ type: 'error', message: 'You must be logged in to add a trip.' });
            setIsLoading(false);
            return;
        }

        // --- Data preparation for the backend ---
        const allDates = [formData.departureDate];
        if (tripType === 'roundtrip' && formData.returnDate) {
            allDates.push(formData.returnDate);
        }

        const payload = {
            userId: currentUser.uid,
            bookingReference: formData.bookingReference.toUpperCase(),
            airline: airlineData[formData.airlineIataCode].name,
            airlineIataCode: formData.airlineIataCode,
            departureAirport: formData.departureAirport.toUpperCase(),
            arrivalAirport: formData.arrivalAirport.toUpperCase(),
            departureDate: formData.departureDate,
            arrivalDate: tripType === 'roundtrip' ? formData.returnDate : null,
            allDates: allDates,
            serviceClass: formData.serviceClass,
            // This maps the friendly name to the code Amadeus needs
            amadeusTravelClass: fareToAmadeusCode[formData.serviceClass] || 'ECONOMY',
            totalPrice: parseFloat(formData.totalPrice),
            currency: 'USD',
        };

        try {
            const response = await addTrip(payload); // Assuming addTrip API exists
            setFeedback({ type: 'success', message: 'Success! Your flight has been added and is now being tracked.' });
            // Optionally, clear the form
            // setFormData({ ...initial state... });
        } catch (error) {
            setFeedback({ type: 'error', message: error.message || 'An error occurred. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Track a New Flight</h1>
            <p className="text-gray-600 mb-6">Enter your flight details manually to start tracking for price drops.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Trip Type Selection */}
                <fieldset className="p-4 border rounded-lg">
                    <legend className="text-sm font-medium text-gray-600 px-1">Trip Type</legend>
                    <div className="flex items-center gap-x-8">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="tripType" value="roundtrip" checked={tripType === 'roundtrip'} onChange={handleTripTypeChange} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                            <span className="text-gray-700">Round Trip</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="tripType" value="oneway" checked={tripType === 'oneway'} onChange={handleTripTypeChange} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                            <span className="text-gray-700">One Way</span>
                        </label>
                    </div>
                </fieldset>

                {/* Core Flight Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="bookingReference" className="block text-sm font-medium text-gray-700">Booking Reference</label>
                        <input type="text" name="bookingReference" id="bookingReference" value={formData.bookingReference} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="e.g., R4ND0M" />
                    </div>
                    <div>
                        <label htmlFor="totalPrice" className="block text-sm font-medium text-gray-700">Total Price Paid ($)</label>
                        <input type="number" name="totalPrice" id="totalPrice" value={formData.totalPrice} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="e.g., 450.75" step="0.01"/>
                    </div>
                </div>

                {/* Route Information */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="departureAirport" className="block text-sm font-medium text-gray-700">Departure Airport</label>
                        <input type="text" name="departureAirport" id="departureAirport" value={formData.departureAirport} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="e.g., JFK" maxLength="3" style={{textTransform: 'uppercase'}} />
                    </div>
                    <div>
                        <label htmlFor="arrivalAirport" className="block text-sm font-medium text-gray-700">Arrival Airport</label>
                        <input type="text" name="arrivalAirport" id="arrivalAirport" value={formData.arrivalAirport} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="e.g., LAX" maxLength="3" style={{textTransform: 'uppercase'}} />
                    </div>
                </div>

                {/* Date Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700">Departure Date</label>
                        <input type="date" name="departureDate" id="departureDate" value={formData.departureDate} onChange={handleInputChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                    </div>
                    {tripType === 'roundtrip' && (
                        <div>
                            <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">Return Date</label>
                            <input type="date" name="returnDate" id="returnDate" value={formData.returnDate} onChange={handleInputChange} required={tripType === 'roundtrip'} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                        </div>
                    )}
                </div>

                {/* Airline and Fare Class */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="airlineIataCode" className="block text-sm font-medium text-gray-700">Airline</label>
                        <select id="airlineIataCode" name="airlineIataCode" value={formData.airlineIataCode} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                            {Object.entries(airlineData).map(([code, { name }]) => (
                                <option key={code} value={code}>{name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="serviceClass" className="block text-sm font-medium text-gray-700">Fare Class</label>
                        <select id="serviceClass" name="serviceClass" value={formData.serviceClass} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                            {availableFares.map(fare => (
                                <option key={fare} value={fare}>{fare}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Submission */}
                <div>
                    <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300">
                        {isLoading ? 'Tracking...' : 'Start Tracking Flight'}
                    </button>
                </div>
            </form>

            {/* Feedback Message */}
            {feedback.message && (
                <div className={`mt-6 p-4 rounded-md text-sm ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {feedback.message}
                </div>
            )}
        </div>
    );
};

export default AdvancedManualEntryPage;
