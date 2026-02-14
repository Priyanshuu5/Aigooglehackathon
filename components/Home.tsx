
import React, { useRef } from 'react';
import { Scenario } from '../types';

interface HomeProps {
  onActivate: (scenario: Scenario, file?: File) => void;
}

export const PRESET_SCENARIOS: Scenario[] = [
  {
    id: 'chickpet',
    name: 'Chickpet Lane',
    desc: 'Conflict Zone (< 40ft)',
    img: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=800',
    icon: 'fa-triangle-exclamation',
    targetWidthFt: 22.5 // Demo target: Clearly violates circular
  },
  {
    id: 'malleshwaram',
    name: 'Malleshwaram Main',
    desc: 'Compliant Zone (> 40ft)',
    img: 'https://c8.alamy.com/comp/2S1Y2HJ/bengaluru-india-may-21-2021-vendors-on-a-street-in-malleshwaram-area-during-the-lockdown-imposed-to-curb-the-spread-of-the-covid-19-2S1Y2HJ.jpg',
    icon: 'fa-check-circle',
    targetWidthFt: 55.0 // Demo target: Safe
  },
  {
    id: 'custom',
    name: 'Upload Site Photo',
    desc: 'Analyze Your Location',
    img: '', // No default img
    icon: 'fa-camera',
    targetWidthFt: 40.0 // Default fallback
  }
];

const Home: React.FC<HomeProps> = ({ onActivate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const customScenario: Scenario = {
        ...PRESET_SCENARIOS[2],
        img: URL.createObjectURL(file)
      };
      onActivate(customScenario, file);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center pointer-events-auto overflow-y-auto custom-scrollbar">
      <div className="w-20 h-20 mb-4 rounded-full bg-gradient-to-tr from-yellow-500 to-yellow-200 flex items-center justify-center shadow-[0_0_50px_rgba(234,179,8,0.5)] flex-shrink-0">
        <i className="fa-solid fa-scale-balanced text-3xl text-black"></i>
      </div>
      
      <h1 className="text-3xl font-black tracking-tighter text-white mb-1 uppercase">
        Nyaya-<span className="text-yellow-500">Agent</span>
      </h1>
      <p className="text-gray-400 text-[10px] max-w-xs mb-6 leading-relaxed uppercase tracking-widest font-mono">
        Bengaluru Street Vendor Defense System
      </p>

      <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl mb-6 max-w-sm text-left relative overflow-hidden">
        <div className="absolute -right-2 -top-2 text-red-500/10 text-6xl">
          <i className="fa-solid fa-ban"></i>
        </div>
        <h3 className="text-[10px] font-bold text-red-400 uppercase mb-1">Jan 2026 Circular Alert</h3>
        <p className="text-[10px] text-gray-300 leading-tight">
          "No license renewals for vendors on roads narrower than <span className="text-white font-bold">40 feet</span>."
        </p>
        <p className="text-[9px] text-yellow-500 mt-2 font-mono">
          <i className="fa-solid fa-shield-halved mr-1"></i>
          Nyaya-Agent counters this using <b>Act 2014 Sec 3(3)</b>.
        </p>
      </div>

      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-[9px] text-yellow-500/60 font-black uppercase tracking-[0.2em]">Select Audit Scenario</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {PRESET_SCENARIOS.slice(0, 2).map((scene) => (
            <button
              key={scene.id}
              onClick={() => onActivate(scene)}
              className="group flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:border-yellow-500/50 hover:bg-white/10 transition-all text-left"
            >
              <div className="w-16 h-12 rounded-lg overflow-hidden bg-black flex-shrink-0 border border-white/10 relative">
                <img src={scene.img} alt={scene.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 right-0 bg-black/80 px-1 text-[8px] font-mono text-white border-tl border-white/20">
                  REF: {scene.targetWidthFt}FT
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-[11px] font-black text-white uppercase truncate">{scene.name}</div>
                <div className="text-[9px] text-gray-500 uppercase font-mono">{scene.desc}</div>
              </div>
              <i className={`fa-solid ${scene.icon} text-yellow-500/20 group-hover:text-yellow-500 transition-colors`}></i>
            </button>
          ))}
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="group flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:border-blue-500/50 hover:bg-white/10 transition-all text-left"
          >
             <div className="w-16 h-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                <i className="fa-solid fa-camera text-blue-400"></i>
             </div>
             <div className="flex-1">
                <div className="text-[11px] font-black text-white uppercase">Upload Own Photo</div>
                <div className="text-[9px] text-gray-500 uppercase font-mono">Real-time Analysis</div>
             </div>
          </button>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleCustomUpload} 
        />
      </div>

      <p className="mt-8 text-[8px] text-gray-700 uppercase font-mono tracking-tighter">
        Developed for Bengaluru Street Vendor Defense | v3.0.0
      </p>
    </div>
  );
};

export default Home;
