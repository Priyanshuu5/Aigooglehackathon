
import React, { useState, useEffect } from 'react';
import { Scenario } from '../types';

interface MeasurementHUDProps {
  scenario: Scenario;
  onFinalize: (ftDistance: number) => void;
}

const MeasurementHUD: React.FC<MeasurementHUDProps> = ({ scenario, onFinalize }) => {
  // Initialize lines to approx 30% and 70% of screen
  const [lineAPos, setLineAPos] = useState(25);
  const [lineBPos, setLineBPos] = useState(75);
  const [calculatedFt, setCalculatedFt] = useState(0);

  useEffect(() => {
    // Demo Logic: Map the screen percentage distance to the scenario's "Real" width
    // If lines are 50% apart (75-25), that equals the scenario.targetWidthFt
    const pixelGap = Math.abs(lineBPos - lineAPos);
    const standardGap = 50; // The "ideal" gap for the photo
    
    // Calculate simulated feet based on how wide the user spreads the lines vs the "standard"
    const ratio = pixelGap / standardGap;
    setCalculatedFt(scenario.targetWidthFt * ratio);
  }, [lineAPos, lineBPos, scenario]);

  return (
    <div className="flex-1 flex flex-col pointer-events-none">
      <div className="absolute top-4 left-0 right-0 text-center">
        <div className="inline-block bg-black/80 backdrop-blur border border-yellow-500/50 px-4 py-2 rounded-full">
           <span className="text-yellow-500 text-[10px] uppercase font-bold tracking-widest animate-pulse">
             Align Lines to Road Curbs
           </span>
        </div>
      </div>

      {/* HUD Lines */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-red-500 hud-line pointer-events-auto cursor-ew-resize group"
        style={{ left: `${lineAPos}%` }}
        onMouseDown={(e) => {
          const move = (em: MouseEvent) => setLineAPos((em.clientX / window.innerWidth) * 100);
          window.addEventListener('mousemove', move);
          window.addEventListener('mouseup', () => window.removeEventListener('mousemove', move), { once: true });
        }}
        onTouchMove={(e) => setLineAPos((e.touches[0].clientX / window.innerWidth) * 100)}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.5)]">
          <i className="fa-solid fa-chevron-left text-xs text-white"></i>
        </div>
        <div className="absolute bottom-32 -left-8 text-xs font-mono bg-black/50 px-2 rounded text-red-400">CURB A</div>
      </div>

      <div 
        className="absolute top-0 bottom-0 w-1 bg-red-500 hud-line pointer-events-auto cursor-ew-resize"
        style={{ left: `${lineBPos}%` }}
        onMouseDown={(e) => {
          const move = (em: MouseEvent) => setLineBPos((em.clientX / window.innerWidth) * 100);
          window.addEventListener('mousemove', move);
          window.addEventListener('mouseup', () => window.removeEventListener('mousemove', move), { once: true });
        }}
        onTouchMove={(e) => setLineBPos((e.touches[0].clientX / window.innerWidth) * 100)}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.5)]">
          <i className="fa-solid fa-chevron-right text-xs text-white"></i>
        </div>
        <div className="absolute bottom-32 -left-8 text-xs font-mono bg-black/50 px-2 rounded text-red-400">CURB B</div>
      </div>

      {/* Measurement Display */}
      <div className="mt-auto p-6 flex flex-col gap-4 pointer-events-auto bg-gradient-to-t from-black via-black/90 to-transparent">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div>
            <div className="text-[10px] text-gray-400 font-mono uppercase">Measured Road Width</div>
            <div className={`text-5xl font-black font-mono tracking-tighter ${
              calculatedFt < 40 ? 'text-red-500' : 'text-green-500'
            }`}>
              {calculatedFt.toFixed(1)} <span className="text-xl">FT</span>
            </div>
          </div>
          <div className="text-right opacity-80">
            <div className="text-[10px] text-gray-400 font-mono uppercase">Circular Limit</div>
            <div className="text-2xl font-bold text-white font-mono">
              40.0 <span className="text-sm">FT</span>
            </div>
          </div>
        </div>

        {calculatedFt < 40 && (
          <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg flex items-center gap-3">
             <i className="fa-solid fa-triangle-exclamation text-red-500 text-xl"></i>
             <div>
               <div className="text-[10px] font-bold text-red-400 uppercase">Warning: Width &lt; 40ft</div>
               <div className="text-[10px] text-gray-300">Violates Jan 2026 Circular. Legal Shield required.</div>
             </div>
          </div>
        )}

        <button
          onClick={() => onFinalize(calculatedFt)}
          className={`w-full py-4 text-black font-black uppercase tracking-widest rounded-xl shadow-lg transition-all ${
            calculatedFt < 40 
              ? 'bg-yellow-500 hover:bg-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.3)]' 
              : 'bg-green-500 hover:bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
          }`}
        >
          {calculatedFt < 40 ? 'ACTIVATE LEGAL DEFENSE' : 'VERIFY COMPLIANCE'}
        </button>
      </div>
    </div>
  );
};

export default MeasurementHUD;
