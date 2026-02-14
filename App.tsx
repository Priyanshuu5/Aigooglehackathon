
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AppState, CalibrationData, MeasurementResult, LegalDocument, Scenario, Language } from './types';
import { GeminiLiveService } from './geminiService';
import { sha256 } from './utils';

// Components
import Home, { PRESET_SCENARIOS } from './components/Home';
import Calibration from './components/Calibration';
import MeasurementHUD from './components/MeasurementHUD';
import Verdict from './components/Verdict';
import Certificate from './components/Certificate';
import DocumentManager from './components/DocumentManager';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.HOME);
  const [result, setResult] = useState<MeasurementResult | null>(null);
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [selectedLang, setSelectedLang] = useState<Language>('en');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const geminiService = useRef<GeminiLiveService | null>(null);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);

  // Initialize Gemini Service
  const initGemini = useCallback(async () => {
    if (!geminiService.current) {
      geminiService.current = new GeminiLiveService();
      geminiService.current.onTranscription = (text, isUser) => {
        setMessages(prev => [...prev.slice(-15), { text, isUser }]);
      };
    }
    
    const docContext = documents.length > 0 
      ? `\nUPLOADED DOCS:\n${documents.map(d => `- ${d.name}`).join('\n')}`
      : "No extra docs.";

    const sysInstruction = `
      You are NYAYA-AGENT, a legal shield for Bengaluru street vendors.
      Current Context:
      - The user is analyzing a road for compliance with the Jan 2026 Circular (40ft rule).
      - If road < 40ft, you must aggressively cite Section 3(3) of Street Vendors Act 2014 to prevent eviction.
      - If road > 40ft, confirm safety.
      - Speak in Kannada/Hindi mixed with English Legal terms.
      - Be reassuring but authoritative against police/officials.
      ${docContext}
    `;
    
    await geminiService.current.connect(sysInstruction);
  }, [documents]);

  const handleActivation = async (scenario: Scenario, file?: File) => {
    setActiveScenario(scenario);
    setState(AppState.DOCUMENTS);
  };

  const proceedToCalibration = async () => {
    try {
      await initGemini();
      setState(AppState.CALIBRATION);
    } catch (err) {
      console.error("Gemini init failed", err);
      // Fallback for demo if mic fails
      setState(AppState.CALIBRATION);
    }
  };

  const onCalibrationComplete = () => {
    setState(AppState.MEASUREMENT);
  };

  const onMeasurementFinalized = async (roadWidthFt: number) => {
    const isCircularCompliant = roadWidthFt >= 40;
    // Section 3(3) applies if they are non-compliant with circular but hold ground
    const isActProtected = !isCircularCompliant; 

    const thoughtSignature = `NYAYA-SIG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const auditHash = await sha256(thoughtSignature + roadWidthFt.toString() + documents.map(d => d.hash).join(''));

    // Inject Authoritative Citation Data
    const citation = !isCircularCompliant ? {
      source: "Ministry of Housing & Urban Affairs (MoHUA)",
      act: "Street Vendors (Protection of Livelihood) Act, 2014",
      section: "Section 3(3)",
      url: "https://mohua.gov.in/upload/uploadfiles/files/Street%20Vendors%20Act%202014.pdf",
      text: "No street vendor shall be evicted or relocated till the survey has been completed and the certificate of vending has been issued to all street vendors.",
      verifiedAt: Date.now()
    } : undefined;

    setResult({
      roadWidthFt,
      isCircularCompliant,
      isActProtected,
      thoughtSignature,
      auditHash,
      referencedDocs: documents.map(d => d.name),
      citation
    });
    setState(AppState.VERDICT);
  };

  const closeVerdict = (lang: Language) => {
    setSelectedLang(lang);
    setState(AppState.CERTIFICATE);
  };

  const resetApp = () => {
    setDocuments([]);
    setActiveScenario(null);
    setResult(null);
    setState(AppState.HOME);
    if (geminiService.current) {
      geminiService.current.disconnect();
      geminiService.current = null;
    }
  };

  // Video/Demo frame capture loop
  useEffect(() => {
    if (!activeScenario || !geminiService.current || state === AppState.HOME) return;

    const interval = setInterval(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = activeScenario.img;
      
      img.onload = () => {
        canvas.width = 640; 
        canvas.height = 480;
        ctx.drawImage(img, 0, 0, 640, 480);
        geminiService.current?.sendFrame(canvas);
      };
    }, 2000); // Slow frame rate for static image is fine

    return () => clearInterval(interval);
  }, [state, activeScenario]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none font-sans">
      {/* Background Layer */}
      {activeScenario && (
        <img
          src={activeScenario.img}
          alt="Scenario Background"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            state === AppState.HOME || state === AppState.DOCUMENTS || state === AppState.CERTIFICATE
              ? 'opacity-20 blur-sm grayscale' 
              : 'opacity-100'
          }`}
        />
      )}
      <canvas ref={canvasRef} className="hidden" />

      {/* Main UI Layer */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {state === AppState.HOME && <Home onActivate={handleActivation} />}
        
        {state === AppState.DOCUMENTS && (
          <DocumentManager 
            documents={documents} 
            setDocuments={setDocuments} 
            onNext={proceedToCalibration} 
          />
        )}
        
        {state === AppState.CALIBRATION && (
          <Calibration onComplete={onCalibrationComplete} />
        )}
        
        {state === AppState.MEASUREMENT && activeScenario && (
          <MeasurementHUD 
            scenario={activeScenario} 
            onFinalize={onMeasurementFinalized} 
          />
        )}
        
        {state === AppState.VERDICT && result && (
          <Verdict result={result} messages={messages} onNext={closeVerdict} />
        )}
        
        {state === AppState.CERTIFICATE && result && (
          <Certificate result={result} onReset={resetApp} initialLang={selectedLang} />
        )}
      </div>

      {/* Status Bar */}
      {state !== AppState.HOME && state !== AppState.DOCUMENTS && state !== AppState.CERTIFICATE && (
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none z-20">
          <div className="bg-black/60 border border-yellow-500/50 p-2 rounded backdrop-blur-md shadow-lg">
            <div className="text-[10px] text-yellow-500 font-mono tracking-tighter uppercase">
              Nyaya-Agent v3.0
            </div>
            <div className="text-white text-xs font-bold font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              LIVE SHIELD ACTIVE
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
