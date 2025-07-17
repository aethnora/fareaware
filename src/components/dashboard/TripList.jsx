import React, { useState, useEffect } from 'react';
import Skeleton from '../ui/Skeleton';
import { Plane, PlaneTakeoff, ArrowRight, ArrowDown, ArrowUp, Minus, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchTrips, deleteTrip } from '../../services/api';

// --- Sub-components for TripCard ---

const AirlineLogo = ({ airline }) => {
  const logos = { 'American Airlines': 'AA', 'Delta': 'DL', 'United': 'UA' };
  return (
    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
      {logos[airline] || (airline ? airline.charAt(0) : '?')}
    </div>
  );
};

const PriceDifference = ({ bought, current }) => {
  if (current === null || bought === null || current === 0) {
    return <div className="flex items-center gap-1 text-gray-500"><Minus className="w-4 h-4" /><span>N/A</span></div>;
  }
  const difference = current - bought;
  const percentage = bought > 0 ? ((difference / bought) * 100).toFixed(1) : 0;

  if (difference < 0) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <ArrowDown className="w-5 h-5 bg-green-100 rounded-full p-0.5" />
        <div><p className="font-bold">${Math.abs(difference).toFixed(2)}</p><p className="text-xs">({percentage}%)</p></div>
      </div>
    );
  }
  if (difference > 0) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <ArrowUp className="w-5 h-5 bg-red-100 rounded-full p-0.5" />
        <div><p className="font-bold">${difference.toFixed(2)}</p><p className="text-xs">(+{percentage}%)</p></div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 text-gray-500">
      <Minus className="w-5 h-5 bg-gray-100 rounded-full p-0.5" />
      <div><p className="font-bold">$0.00</p><p className="text-xs">(0.0%)</p></div>
    </div>
  );
};

// --- Main TripCard Component ---

const TripCard = ({ flight, onDelete, isDeleting }) => {
  // <<< THIS IS THE FIX: The check for departureDate has been removed >>>
  // The component will no longer hide if just the date is missing.
  if (!flight) {
    return null;
  }
  // <<< END OF FIX >>>

  const departureDate = flight.departureDate ? new Date(flight.departureDate).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  }) : 'Date Not Found';

  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden ${isDeleting ? 'opacity-50' : ''}`}>
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <AirlineLogo airline={flight.airline} />
            <div>
              <p className="font-bold text-lg text-gray-800">{flight.airline}</p>
              <p className="text-sm text-gray-500">Departing: {departureDate}</p>
            </div>
          </div>
          <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">Actively Tracking</div>
        </div>
        <div className="flex items-center justify-between mb-6">
          <div className="text-center"><p className="text-2xl font-bold text-gray-800">{flight.departureAirport}</p><p className="text-sm text-gray-500">{flight.departureTime}</p></div>
          <div className="flex items-center text-gray-400"><PlaneTakeoff className="w-5 h-5" /><div className="flex-grow border-t-2 border-dashed border-gray-300 mx-2" style={{width: '100px'}}></div><ArrowRight className="w-5 h-5" /></div>
          <div className="text-center"><p className="text-2xl font-bold text-gray-800">{flight.arrivalAirport}</p><p className="text-sm text-gray-500">{flight.arrivalTime}</p></div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center bg-gray-50 p-4 rounded-lg">
          <div><p className="text-sm text-gray-500">Bought Price</p><p className="text-lg font-bold text-gray-800">${(flight.boughtPrice || 0).toFixed(2)}</p></div>
          <div><p className="text-sm text-gray-500">Current Price</p><p className="text-lg font-bold text-primary">${(flight.currentPrice || 0).toFixed(2)}</p></div>
          <div><p className="text-sm text-gray-500">Difference</p><PriceDifference bought={flight.boughtPrice} current={flight.currentPrice} /></div>
        </div>
      </div>
      <div className="bg-gray-50 border-t border-gray-200 px-5 py-3 flex justify-between items-center">
        <p className="text-xs text-gray-500">Booking Ref: <span className="font-mono text-gray-700">{flight.bookingReference}</span></p>
        <button onClick={() => onDelete(flight.id)} disabled={isDeleting} className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-800 font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
          {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Delete
        </button>
      </div>
    </div>
  );
};

// --- Main TripList Component ---

const TripList = () => {
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }
    const loadTrips = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchTrips(currentUser.uid);
        const formattedTrips = data.flights.map(flight => ({
            id: flight.flight_id,
            airline: flight.airline,
            departureAirport: flight.departure_airport,
            arrivalAirport: flight.arrival_airport,
            departureDate: flight.departure_date,
            departureTime: flight.departure_time,
            arrivalTime: flight.arrival_time,
            boughtPrice: parseFloat(flight.original_price) || 0,
            currentPrice: parseFloat(flight.last_checked_price) || 0,
            bookingReference: flight.booking_reference,
        }));
        setTrips(formattedTrips);
      } catch (err) {
        console.error("Failed to fetch trips:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadTrips();
  }, [currentUser]);

  const handleDeleteTrip = async (flightId) => {
    if (window.confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      setDeletingId(flightId);
      try {
        await deleteTrip(flightId, currentUser.uid);
        setTrips(prevTrips => prevTrips.filter(trip => trip.id !== flightId));
      } catch (err) {
        setError(`Failed to delete trip: ${err.message}`);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-56 w-full rounded-xl" />
        <Skeleton className="h-56 w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 px-6 bg-red-50 text-red-700 rounded-xl">
        <h3 className="text-xl font-semibold">Error Loading Flights</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <Plane className="w-16 h-16 mx-auto text-gray-300" />
        <h3 className="mt-4 text-xl font-semibold text-gray-800">No Active Trips</h3>
        <p className="mt-2 text-gray-500">Once you add a flight, it will appear here ready for tracking.</p>
        <a href="/manual-entry" className="mt-6 inline-block bg-primary text-white font-bold px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors">
          Add a Trip Manually
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {trips.map(flight => (
        <TripCard
          key={flight.id}
          flight={flight}
          onDelete={handleDeleteTrip}
          isDeleting={deletingId === flight.id}
        />
      ))}
    </div>
  );
};

export default TripList;