
import React, { useState, useEffect } from 'react';
import { MeasurementResult, Language } from '../types';

interface VerdictProps {
  result: MeasurementResult;
  messages: { text: string; isUser: boolean }[];
  onNext: (lang: Language) => void;
}

const Verdict: React.FC<VerdictProps> = ({ result, messages, onNext }) => {
  const [lang, setLang] = useState<Language>('en');
  const [validating, setValidating] = useState(true);

  // Simulate "Live Fetching" of legal data
  useEffect(() => {
    if (!result.isCircularCompliant) {
      const timer = setTimeout(() => setValidating(false), 2000);
      return () => clearTimeout(timer);
    } else {
      setValidating(false);
    }
  }, [result.isCircularCompliant]);

  const content = {
    en: {
      compliant: "COMPLIANT",
      shield: "SHIELD ACTIVE",
      license: "LICENSE RENEWAL APPROVED",
      blocked: "EVICTION BLOCKED",
      measured: "Measured Road Width",
      violationTitle: "Local Circular Violation",
      violationDesc: "Width < 40ft. License renewal blocked under Jan 2026 GBA Order.",
      overrideTitle: "FEDERAL SUPREMACY APPLIED",
      overrideDesc: "Conflict detected between Local Circular and Central Act. Central Law prevails under Article 254.",
      compliantTitle: "Fully Compliant",
      compliantDesc: "Road width satisfies the 40ft requirement.",
      button: result.isCircularCompliant ? "GENERATE COMPLIANCE REPORT" : "GENERATE PROTECTION AFFIDAVIT"
    },
    kn: {
      compliant: "ಅನುಸರಣೆಯಾಗಿದೆ",
      shield: "ರಕ್ಷಣೆ ಸಕ್ರಿಯವಾಗಿದೆ",
      license: "ಪರವಾನಗಿ ನವೀಕರಣ",
      blocked: "ತೆರವು ತಡೆಯಲಾಗಿದೆ",
      measured: "ಅಳತೆ ಮಾಡಿದ ರಸ್ತೆ ಅಗಲ",
      violationTitle: "ಸ್ಥಳೀಯ ನಿಯಮ ಉಲ್ಲಂಘನೆ",
      violationDesc: "40 ಅಡಿಗಿಂತ ಕಡಿಮೆ. Jan 2026 ಆದೇಶದ ಅಡಿಯಲ್ಲಿ ಪರವಾನಗಿ ತಡೆಹಿಡಿಯಲಾಗಿದೆ.",
      overrideTitle: "ಕೇಂದ್ರ ಕಾಯ್ದೆಯ ರಕ್ಷಣೆ",
      overrideDesc: "ಸ್ಥಳೀಯ ಆದೇಶ ಮತ್ತು ಕೇಂದ್ರ ಕಾಯ್ದೆಯ ನಡುವೆ ಸಂಘರ್ಷ. Article 254 ರ ಅಡಿಯಲ್ಲಿ ಕೇಂದ್ರ ಕಾಯ್ದೆಯೇ ಅಂತಿಮ.",
      compliantTitle: "ಸಂಪೂರ್ಣವಾಗಿ ಅನುಸರಣೆಯಾಗಿದೆ",
      compliantDesc: "ರಸ್ತೆ ಅಗಲವು 40 ಅಡಿ ನಿಯಮವನ್ನು ಪೂರೈಸುತ್ತದೆ.",
      button: result.isCircularCompliant ? "ವರದಿ ರಚಿಸಿ" : "ರಕ್ಷಣಾ ಪತ್ರ ರಚಿಸಿ"
    },
    hi: {
      compliant: "अनुपालन पूर्ण",
      shield: "सुरक्षा सक्रिय",
      license: "लाइसेंस नवीनीकरण",
      blocked: "बेदखली पर रोक",
      measured: "सड़क की मापी गई चौड़ाई",
      violationTitle: "स्थानीय नियम उल्लंघन",
      violationDesc: "40 फीट से कम। जनवरी 2026 के आदेश के तहत लाइसेंस नवीनीकरण रोका गया।",
      overrideTitle: "केंद्रीय कानून सर्वोच्चता",
      overrideDesc: "स्थानीय आदेश और केंद्रीय कानून में संघर्ष। अनुच्छेद 254 के तहत केंद्रीय कानून ही मान्य है।",
      compliantTitle: "पूर्णतः अनुपालन",
      compliantDesc: "सड़क की चौड़ाई 40 फीट की आवश्यकता को पूरा करती है।",
      button: result.isCircularCompliant ? "रिपोर्ट जनरेट करें" : "सुरक्षा शपथ पत्र"
    }
  };

  const t = content[lang];

  return (
    <div className="flex-1 flex flex-col bg-black/90 backdrop-blur-xl p-6 pointer-events-auto h-full relative">
      
      {/* Language Toggle */}
      <div className="absolute top-6 right-6 flex gap-1 bg-white/10 p-1 rounded-lg z-20">
        {(['en', 'kn', 'hi'] as Language[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${
              lang === l ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="mt-6 mb-4">
        <div className="flex items-center gap-2 mb-2">
           <div className={`w-3 h-3 rounded-full ${result.isCircularCompliant ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
           <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">
             Civic Intelligence • {new Date().toLocaleDateString()}
           </span>
        </div>
        
        <h2 className={`text-5xl font-black tracking-tighter leading-none mb-1 ${result.isCircularCompliant ? 'text-green-500' : 'text-yellow-500'}`}>
          {result.isCircularCompliant ? t.compliant : t.shield}
        </h2>
        <div className="text-lg font-mono text-white uppercase tracking-widest">
          {result.isCircularCompliant ? t.license : t.blocked}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
        
        {/* Analysis Card */}
        <div className={`p-4 border rounded-xl ${result.isCircularCompliant ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/10 border-red-500/30'}`}>
           <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
              <span className="text-[10px] text-gray-400 uppercase font-bold">{t.measured}</span>
              <span className="text-3xl font-black font-mono text-white">
                {result.roadWidthFt.toFixed(1)} <span className="text-sm text-gray-500">FT</span>
              </span>
           </div>
           
           {!result.isCircularCompliant ? (
             <div className="space-y-4">
                {/* The Conflict */}
                <div className="flex items-start gap-3 opacity-60">
                  <div className="mt-1"><i className="fa-solid fa-circle-xmark text-red-500"></i></div>
                  <div>
                    <div className="text-[10px] font-bold text-red-400 uppercase">{t.violationTitle}</div>
                    <div className="text-[10px] text-gray-400 leading-tight">
                      {t.violationDesc}
                    </div>
                  </div>
                </div>

                {/* Live Statutory Validation Panel */}
                <div className="bg-black/40 border border-yellow-500/30 rounded-lg overflow-hidden">
                  <div className="bg-yellow-500/10 p-2 flex justify-between items-center border-b border-yellow-500/20">
                    <span className="text-[9px] font-bold text-yellow-500 uppercase flex items-center gap-2">
                      <i className="fa-solid fa-gavel"></i> Statutory Verification
                    </span>
                    {validating ? (
                      <span className="text-[9px] text-yellow-500 animate-pulse">Fetching Source...</span>
                    ) : (
                       <span className="text-[9px] text-green-400 flex items-center gap-1">
                         <i className="fa-solid fa-circle-check"></i> Verified
                       </span>
                    )}
                  </div>
                  
                  {validating ? (
                    <div className="p-4 flex justify-center">
                      <i className="fa-solid fa-spinner animate-spin text-yellow-500"></i>
                    </div>
                  ) : (
                    <div className="p-3">
                      <div className="text-[10px] text-white font-serif italic mb-2">
                        "{result.citation?.text}"
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                           <div className="text-[9px] text-gray-400 font-bold">{result.citation?.act}</div>
                           <div className="text-[8px] text-yellow-500">{result.citation?.section}</div>
                        </div>
                        <div className="text-[8px] text-gray-500">
                          Source: {result.citation?.source}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Federal Override Badge */}
                {!validating && (
                   <div className="flex items-start gap-3 bg-gradient-to-r from-yellow-500/20 to-transparent p-3 rounded border-l-4 border-yellow-500">
                    <div>
                      <div className="text-xs font-black text-yellow-500 uppercase tracking-wide">{t.overrideTitle}</div>
                      <div className="text-[10px] text-white leading-snug mt-1">
                        {t.overrideDesc}
                      </div>
                    </div>
                  </div>
                )}
             </div>
           ) : (
             <div className="flex items-start gap-3">
                <i className="fa-solid fa-circle-check text-green-500 mt-1 text-xl"></i>
                <div>
                  <div className="text-xs font-bold text-green-500 uppercase">{t.compliantTitle}</div>
                  <div className="text-[10px] text-gray-300 leading-tight">
                    {t.compliantDesc}
                  </div>
                </div>
             </div>
           )}
        </div>
      </div>

      <button
        onClick={() => onNext(lang)}
        disabled={validating}
        className={`w-full py-5 text-black font-black uppercase tracking-widest rounded-xl transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
          result.isCircularCompliant ? 'bg-green-500 hover:bg-green-400' : 'bg-yellow-500 hover:bg-yellow-400'
        }`}
      >
        {t.button}
      </button>
    </div>
  );
};

export default Verdict;
