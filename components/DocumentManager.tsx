
import React, { useState } from 'react';
import { LegalDocument } from '../types';
import { sha256, readFileAsText } from '../utils';

interface DocumentManagerProps {
  documents: LegalDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<LegalDocument[]>>;
  onNext: () => void;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({ documents, setDocuments, onNext }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const content = await readFileAsText(file);
      const hash = await sha256(content);
      
      const newDoc: LegalDocument = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        content: content.substring(0, 5000), // Limit content for session instruction
        hash,
        timestamp: Date.now()
      };
      
      setDocuments(prev => [...prev, newDoc]);
    }
    setIsUploading(false);
  };

  const removeDoc = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col p-6 pointer-events-auto bg-black/60 backdrop-blur-md">
      <div className="mt-12 mb-6">
        <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Legal Preparation</h2>
        <p className="text-xs text-gray-400 uppercase tracking-widest font-mono">
          Enhance your shield with local orders or IDs
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-2 custom-scrollbar">
        {documents.length === 0 ? (
          <div className="h-48 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-4">
            <i className="fa-solid fa-file-shield text-3xl mb-3 text-yellow-500/20"></i>
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">No documents uploaded</span>
            <span className="text-[10px] text-yellow-500/60 font-mono">"Default Shield: Street Vendors Act 2014" Active</span>
          </div>
        ) : (
          documents.map(doc => (
            <div key={doc.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center group">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white truncate max-w-[200px]">{doc.name}</span>
                <span className="text-[9px] font-mono text-gray-500 uppercase">SHA-256: {doc.hash.substring(0, 16)}...</span>
              </div>
              <button 
                onClick={() => removeDoc(doc.id)}
                className="text-gray-500 hover:text-red-500 transition-colors p-2"
              >
                <i className="fa-solid fa-trash-can text-sm"></i>
              </button>
            </div>
          ))
        )}
      </div>

      <div className="space-y-4">
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
           <div className="text-[10px] text-blue-400 font-bold uppercase mb-1 flex items-center gap-1">
             <i className="fa-solid fa-circle-info"></i> Pro Tip
           </div>
           <p className="text-[10px] text-blue-200/70 leading-tight">
             No documents? No problem. The Agent uses Federal Supremacy rules by default. Upload a <b>Vending ID</b> or <b>BBMP Circular</b> only if you have one.
           </p>
        </div>

        <label className="block">
          <div className="w-full py-4 border-2 border-yellow-500/30 bg-yellow-500/5 text-yellow-500 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-yellow-500/10 transition-all">
            <i className={`fa-solid ${isUploading ? 'fa-spinner animate-spin' : 'fa-cloud-arrow-up'} text-2xl mb-2`}></i>
            <span className="text-xs font-black uppercase tracking-widest">
              {isUploading ? 'Processing...' : 'Upload Legal Docs'}
            </span>
          </div>
          <input type="file" className="hidden" multiple onChange={handleFileUpload} accept=".txt,.json,.md" />
        </label>

        <button
          onClick={onNext}
          className="w-full py-4 bg-yellow-500 text-black font-black uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          {documents.length > 0 ? 'Use Enhanced Shield' : 'Use Default Shield'}
        </button>
      </div>
    </div>
  );
};

export default DocumentManager;
