import React, { useState, useEffect } from 'react';
import { PiggyBank } from 'lucide-react';

const LifetimeSavings = ({ finalAmount = 0 }) => {
  const [count, setCount] = useState(0);

  // Animated counter effect
  useEffect(() => {
    let start = 0;
    const end = Math.floor(finalAmount);
    if (start === end) return;

    const duration = 1500;
    const incrementTime = (duration / end) || 50;

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [finalAmount]);

  return (
    // Restructured to be taller and match the new PlanStatus card
    <div className="bg-gradient-to-br from-green-400 to-primary p-6 rounded-xl shadow-lg text-white h-full flex flex-col">
        {/* Main content area, flex-grow allows it to expand */}
        <div className="flex-grow">
            <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                    <PiggyBank className="w-8 h-8" />
                </div>
                <div>
                    <p className="text-sm font-medium text-green-100 uppercase tracking-wider">Lifetime Savings</p>
                    <p className="text-5xl font-bold">
                        ${count.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
            </div>
        </div>
        
        {/* New footer section to add height and useful info */}
        <div className="mt-4 pt-4 border-t border-white/20 text-center">
            <p className="text-sm text-green-100">
                You're a smart traveler! We check for price drops automatically.
            </p>
        </div>
    </div>
  );
};

export default LifetimeSavings;