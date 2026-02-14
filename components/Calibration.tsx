
import React, { useState, useEffect } from 'react';

interface CalibrationProps {
  onComplete: () => void;
}

const Calibration: React.FC<CalibrationProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Simulate complex AI analysis steps
    const steps = [
      () => setStep(1), // Analyzing geometry
      () => setStep(2), // Fetching GIS
      () => setStep(3), // Establishing Scale
      () => onComplete()
    ];

    let delay = 0;
    steps.forEach((s, i) => {
      delay += 1000 + Math.random() * 500;
      setTimeout(s, delay);
    });
  }, [onComplete]);

  return (
    <div className="flex-1 flex flex-col justify-center items-center p-6 pointer-events-auto bg-black/40 backdrop-blur-sm">
      <div className="relative w-64 h-64 border border-green-500/30 rounded-full flex items-center justify-center animate-pulse">
        <div className="absolute inset-0 border-t-2 border-green-500 rounded-full animate-spin"></div>
        <div className="absolute inset-4 border-b-2 border-blue-500/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
        
        <div className="text-center z-10">
          <i className="fa-solid fa-satellite-dish text-4xl text-green-500 mb-4"></i>
          <div className="text-xs font-mono text-green-400 uppercase tracking-widest">
            {step === 0 && "Scanning Topology..."}
            {step === 1 && "Identifying Curb Edges..."}
            {step === 2 && "Fetching BBMP GIS Data..."}
            {step === 3 && "Calibrating 1:1 Scale..."}
          </div>
        </div>
      </div>

      <div className="mt-8 w-full max-w-xs space-y-2">
        <div className="flex justify-between text-[9px] uppercase font-bold text-gray-500">
          <span>Processing</span>
          <span>{step * 25}%</span>
        </div>
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-500 ease-out"
            style={{ width: `${step * 33}%` }}
          ></div>
        </div>
        
        <div className="pt-4 grid grid-cols-2 gap-2 opacity-70">
           <div className="bg-white/5 p-2 rounded border border-white/10">
             <div className="text-[8px] text-gray-500">REF OBJECT</div>
             <div className="text-[10px] text-white">LANE MARKER</div>
           </div>
           <div className="bg-white/5 p-2 rounded border border-white/10">
             <div className="text-[8px] text-gray-500">DEPTH MAP</div>
             <div className="text-[10px] text-white">GENERATED</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Calibration;
