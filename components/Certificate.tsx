
import React, { useState } from 'react';
import { MeasurementResult, Language } from '../types';

interface CertificateProps {
  result: MeasurementResult;
  onReset: () => void;
  initialLang: Language;
}

const Certificate: React.FC<CertificateProps> = ({ result, onReset, initialLang }) => {
  const [lang, setLang] = useState<Language>(initialLang);

  const content = {
    en: {
      title: "Legal Protection Affidavit",
      subtitle: "Pursuant to Street Vendors Act, 2014",
      toWhom: "TO WHOM IT MAY CONCERN:",
      intro: "This automated spatial audit certifies that the vending location at GPS Coordinates (Simulated) has been analyzed for compliance with the Jan 31, 2026 GBA Circular.",
      measured: "MEASURED WIDTH:",
      required: "REQUIRED WIDTH:",
      status: "STATUS:",
      statusText: result.isCircularCompliant ? "COMPLIANT" : "CIRCULAR VIOLATION",
      defenseTitle: "LEGAL DEFENSE CITED:",
      defenseBody: "Notwithstanding the measured width, this vendor asserts protection under Section 3(3) of the Central Act.",
      defenseQuote: result.citation?.text || "",
      footer: "This digital record is hashed on the audit log and serves as a formal notice of rights.",
      buttonSave: "Save to Phone",
      buttonScan: "Scan New Location",
      verifiedAt: "Verified at source:"
    },
    kn: {
      title: "ಕಾನೂನು ರಕ್ಷಣಾ ಪತ್ರ",
      subtitle: "ಬೀದಿ ಬದಿ ವ್ಯಾಪಾರಿಗಳ ಕಾಯ್ದೆ 2014 ರ ಅಡಿಯಲ್ಲಿ",
      toWhom: "ಸಂಬಂಧಪಟ್ಟವರಿಗೆ:",
      intro: "ಈ ಸ್ವಯಂಚಾಲಿತ ಸಮೀಕ್ಷೆಯು ಈ ಸ್ಥಳವನ್ನು Jan 31, 2026 ರ GBA ಆದೇಶದ ಅನುಸರಣೆಗಾಗಿ ವಿಶ್ಲೇಷಿಸಿದೆ ಎಂದು ಪ್ರಮಾಣೀಕರಿಸುತ್ತದೆ.",
      measured: "ಅಳತೆ ಮಾಡಿದ ಅಗಲ:",
      required: "ಅಗತ್ಯವಿರುವ ಅಗಲ:",
      status: "ಸ್ಥಿತಿ:",
      statusText: result.isCircularCompliant ? "ಅನುಸರಣೆಯಾಗಿದೆ" : "ನಿಯಮ ಉಲ್ಲಂಘನೆ (Circular Violation)",
      defenseTitle: "ಕಾನೂನು ರಕ್ಷಣೆ:",
      defenseBody: "ಅಳತೆ ಏನೇ ಇರಲಿ, ಕೇಂದ್ರ ಕಾಯ್ದೆಯ (Central Act) ಸೆಕ್ಷನ್ 3(3) ರ ಅಡಿಯಲ್ಲಿ ಈ ವ್ಯಾಪಾರಿಯು ರಕ್ಷಣೆಯನ್ನು ಪಡೆಯುತ್ತಾರೆ.",
      defenseQuote: "\"ಸಮೀಕ್ಷೆ ಪೂರ್ಣಗೊಳ್ಳುವವರೆಗೆ ಮತ್ತು ವ್ಯಾಪಾರ ಪ್ರಮಾಣಪತ್ರ ನೀಡುವವರೆಗೆ ಯಾವುದೇ ಬೀದಿ ವ್ಯಾಪಾರಿಯನ್ನು ಒಕ್ಕಲೆಬ್ಬಿಸುವಂತಿಲ್ಲ.\"",
      footer: "ಈ ಡಿಜಿಟಲ್ ದಾಖಲೆಯು ಹಕ್ಕುಗಳ ಔಪಚಾರಿಕ ಸೂಚನೆಯಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.",
      buttonSave: "ಮೊಬೈಲ್‌ಗೆ ಉಳಿಸಿ",
      buttonScan: "ಹೊಸ ಸ್ಕ್ಯಾನ್",
      verifiedAt: "ಮೂಲ ಪರಿಶೀಲಿಸಲಾಗಿದೆ:"
    },
    hi: {
      title: "कानूनी सुरक्षा शपथ पत्र",
      subtitle: "स्ट्रीट वेंडर्स एक्ट 2014 के अंतर्गत",
      toWhom: "संबंधित अधिकारियों के लिए:",
      intro: "यह स्वचालित ऑडिट प्रमाणित करता है कि इस स्थान का विश्लेषण 31 जनवरी 2026 के GBA आदेश के अनुपालन के लिए किया गया है।",
      measured: "मापी गई चौड़ाई:",
      required: "आवश्यक चौड़ाई:",
      status: "स्थिति:",
      statusText: result.isCircularCompliant ? "अनुपालन पूर्ण" : "नियम उल्लंघन (Circular Violation)",
      defenseTitle: "कानूनी बचाव:",
      defenseBody: "मापी गई चौड़ाई के बावजूद, यह विक्रेता केंद्रीय कानून (Central Act) की धारा 3(3) के तहत सुरक्षा का दावा करता है।",
      defenseQuote: "\"सर्वेक्षण पूरा होने और वेंडिंग प्रमाण पत्र जारी होने तक किसी भी स्ट्रीट वेंडर को बेदखल नहीं किया जाएगा।\"",
      footer: "यह डिजिटल रिकॉर्ड अधिकारों की औपचारिक सूचना के रूप में कार्य करता है।",
      buttonSave: "फोन में सेव करें",
      buttonScan: "नई स्कैनिंग",
      verifiedAt: "स्रोत सत्यापित:"
    }
  };

  const t = content[lang];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-900 pointer-events-auto h-full overflow-y-auto relative">
      
      {/* Language Toggle */}
      <div className="absolute top-4 right-4 flex gap-1 bg-white/10 p-1 rounded-lg z-20">
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

      {/* The Paper Document */}
      <div className="w-full max-w-sm bg-[#fffdf0] text-black p-8 rounded-sm shadow-2xl relative mt-8">
        
        {/* Stamp Effect */}
        {!result.isCircularCompliant && (
          <div className="absolute top-10 right-6 w-24 h-24 border-4 border-red-700 rounded-full flex items-center justify-center opacity-80 rotate-[-15deg] pointer-events-none mix-blend-multiply">
            <div className="text-center">
              <div className="text-[8px] font-black text-red-800 uppercase">Sec 3(3)</div>
              <div className="text-xs font-black text-red-800 uppercase">PROTECTED</div>
              <div className="text-[8px] font-black text-red-800 uppercase">Act 2014</div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="border-b-4 border-double border-black pb-4 mb-6 text-center">
          <div className="w-16 h-16 mx-auto mb-3 text-4xl flex items-center justify-center">
            ⚖️
          </div>
          <h1 className="text-xl font-black uppercase tracking-tighter font-serif">{t.title}</h1>
          <p className="text-[8px] font-mono text-gray-600 uppercase tracking-widest mt-1">{t.subtitle}</p>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs font-serif leading-relaxed text-justify">
          <p>
            <b>{t.toWhom}</b>
          </p>
          <p>
            {t.intro}
          </p>
          
          <div className="bg-gray-100 border border-black p-3 my-2 font-mono text-[10px]">
            <div className="flex justify-between">
              <span>{t.measured}</span>
              <span className="font-bold">{result.roadWidthFt.toFixed(1)} FT</span>
            </div>
            <div className="flex justify-between">
              <span>{t.required}</span>
              <span className="font-bold">40.0 FT</span>
            </div>
            <div className="flex justify-between mt-1 pt-1 border-t border-gray-300">
              <span>{t.status}</span>
              <span className={`font-bold ${result.isCircularCompliant ? 'text-green-700' : 'text-red-700'}`}>
                {t.statusText}
              </span>
            </div>
          </div>

          {!result.isCircularCompliant && result.citation && (
            <div className="pl-3 border-l-2 border-black">
              <p className="font-bold mb-1">{t.defenseTitle}</p>
              <p>
                {t.defenseBody}
              </p>
              <p className="mt-2 text-[10px] italic">
                "{t.defenseQuote}"
              </p>
              <div className="mt-2 pt-2 border-t border-gray-300">
                 <div className="text-[8px] text-gray-500 uppercase">{t.verifiedAt}</div>
                 <a href={result.citation.url} target="_blank" rel="noopener noreferrer" className="text-[8px] text-blue-600 underline block truncate">
                   {result.citation.source} (Govt. of India)
                 </a>
                 <div className="text-[8px] text-gray-400">
                   Timestamp: {new Date(result.citation.verifiedAt).toLocaleString()}
                 </div>
              </div>
            </div>
          )}

          <p className="mt-4">
            {t.footer}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-black flex justify-between items-end">
          <div className="text-[8px] uppercase tracking-widest">
            Hash: {result.auditHash.substring(0, 12)}...
          </div>
          <div className="text-right">
            <div className="font-bold font-serif italic text-sm">Nyaya-Agent</div>
            <div className="text-[8px] text-gray-500">AI Legal Guardian</div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 w-full max-w-sm pb-8">
        <button
          className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-all uppercase tracking-widest text-xs shadow-lg flex items-center justify-center gap-2"
          onClick={() => window.print()}
        >
          <i className="fa-solid fa-download"></i> {t.buttonSave}
        </button>
        <button
          className="w-full py-2 text-gray-500 font-bold hover:text-white transition-all uppercase tracking-widest text-[10px]"
          onClick={onReset}
        >
          <i className="fa-solid fa-rotate-right mr-1"></i> {t.buttonScan}
        </button>
      </div>
    </div>
  );
};

export default Certificate;
