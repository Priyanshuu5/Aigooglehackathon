
export enum AppState {
  HOME = 'HOME',
  DOCUMENTS = 'DOCUMENTS',
  CALIBRATION = 'CALIBRATION',
  MEASUREMENT = 'MEASUREMENT',
  VERDICT = 'VERDICT',
  CERTIFICATE = 'CERTIFICATE'
}

export type Language = 'en' | 'kn' | 'hi';

export interface LegalDocument {
  id: string;
  name: string;
  content: string;
  hash: string;
  timestamp: number;
}

export interface CalibrationData {
  pixelsPerMm: number;
  noteCoordinates?: { x: number; y: number; w: number; h: number };
}

export interface LegalCitation {
  source: string;
  act: string;
  section: string;
  url: string;
  text: string;
  verifiedAt: number;
}

export interface MeasurementResult {
  roadWidthFt: number;
  isCircularCompliant: boolean; // Is width >= 40ft?
  isActProtected: boolean; // Section 3(3) applies?
  thoughtSignature: string;
  auditHash: string;
  referencedDocs: string[];
  citation?: LegalCitation;
}

export interface LiveMessage {
  text?: string;
  sender: 'user' | 'ai';
  timestamp: number;
}

export interface Scenario {
  id: string;
  name: string;
  desc: string;
  img: string;
  icon: string;
  targetWidthFt: number; // The "real" width of this scenario for demo purposes
}
