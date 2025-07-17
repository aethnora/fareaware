import React from 'react';
import { PlaneTakeoff, ArrowRight, ArrowDown, ArrowUp, Minus } from 'lucide-react';

const AirlineLogo = ({ airline }) => {
  // In a real app, this would map to actual logo image files
  const logos = {
    'American Airlines': 'AA',
    'Delta': 'DL',
    'United': 'UA'
  };
  return (
    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
      {logos[airline] || airline.charAt(0)}
    </div>
  );
};

const PriceDifference = ({ bought, current }) => {
  if (current === null || bought === null) {
    return (
      <div className="flex items-center gap-1 text-gray-500">
        <Minus className="w-4 h-4" />
        <span>N/A</span>
      </div>
    );
  }
  
  const difference = current - bought;
  const percentage = ((difference / bought) * 100).toFixed(1);

  if (difference < 0) {
    return (
      <div className="flex items-center gap-2 text-green-600">
        <ArrowDown className="w-5 h-5 bg-green-100 rounded-full p-0.5" />
        <div>
          <p className="font-bold">${Math.abs(difference).toFixed(2)}</p>
          <p className="text-xs">({percentage}%)</p>
        </div>
      </div>
    );
  }

  if (difference > 0) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <ArrowUp className="w-5 h-5 bg-red-100 rounded-full p-0.5" />
        <div>
          <p className="font-bold">${difference.toFixed(2)}</p>
          <p className="text-xs">(+{percentage}%)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-gray-500">
      <Minus className="w-5 h-5 bg-gray-100 rounded-full p-0.5" />
      <div>
        <p className="font-bold">$0.00</p>
        <p className="text-xs">(0.0%)</p>
      </div>
    </div>
  );
};

const TripCard = ({ flight }) => {
  const departureDate = new Date(flight.departureDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden">
      <div className="p-5">
        {/* Card Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <AirlineLogo airline={flight.airline} />
            <div>
              <p className="font-bold text-lg text-gray-800">{flight.airline}</p>
              <p className="text-sm text-gray-500">Departing: {departureDate}</p>
            </div>
          </div>
          <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            Actively Tracking
          </div>
        </div>

        {/* Route Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{flight.departureAirport}</p>
            <p className="text-sm text-gray-500">{flight.departureTime}</p>
          </div>
          <div className="flex items-center text-gray-400">
            <PlaneTakeoff className="w-5 h-5" />
            <div className="flex-grow border-t-2 border-dashed border-gray-300 mx-2" style={{width: '100px'}}></div>
            <ArrowRight className="w-5 h-5" />
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{flight.arrivalAirport}</p>
            <p className="text-sm text-gray-500">{flight.arrivalTime}</p>
          </div>
        </div>

        {/* Pricing Details */}
        <div className="grid grid-cols-3 gap-4 text-center bg-gray-50 p-4 rounded-lg">
          <div>
            <p className="text-sm text-gray-500">Bought Price</p>
            <p className="text-lg font-bold text-gray-800">${flight.boughtPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Current Price</p>
            <p className="text-lg font-bold text-primary">${flight.currentPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Difference</p>
            <PriceDifference bought={flight.boughtPrice} current={flight.currentPrice} />
          </div>
        </div>
      </div>
      <div className="bg-gray-50 border-t border-gray-200 px-5 py-3">
        <p className="text-xs text-gray-500">Booking Ref: <span className="font-mono text-gray-700">{flight.bookingReference}</span></p>
      </div>
    </div>
  );
};

export default TripCard;

