
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { decode, decodeAudioData, encode, blobToBase64 } from './utils';

const MODEL_NAME = 'gemini-2.5-flash-native-audio-preview-12-2025';

export class GeminiLiveService {
  private ai: any;
  private session: any;
  private audioContext: AudioContext;
  private outputNode: GainNode;
  private nextStartTime: number = 0;
  private sources: Set<AudioBufferSourceNode> = new Set();
  
  onMessage?: (text: string) => void;
  onTranscription?: (text: string, isUser: boolean) => void;
  onSpatialData?: (data: any) => void;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    this.outputNode = this.audioContext.createGain();
    this.outputNode.connect(this.audioContext.destination);
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async connect(systemInstruction: string) {
    const sessionPromise = this.ai.live.connect({
      model: MODEL_NAME,
      config: {
        responseModalities: [Modality.AUDIO],
        systemInstruction,
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
        inputAudioTranscription: {},
        outputAudioTranscription: {},
      },
      callbacks: {
        onopen: () => console.log('Gemini Live session opened'),
        onmessage: async (message: LiveServerMessage) => {
          // Handle transcriptions
          if (message.serverContent?.inputTranscription) {
            this.onTranscription?.(message.serverContent.inputTranscription.text, true);
          }
          if (message.serverContent?.outputTranscription) {
            this.onTranscription?.(message.serverContent.outputTranscription.text, false);
          }

          // Handle audio output
          const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audioData) {
            await this.playAudio(audioData);
          }

          // Handle interruptions
          if (message.serverContent?.interrupted) {
            this.stopAllAudio();
          }

          // Simple text extraction for non-audio parts if they exist
          const textPart = message.serverContent?.modelTurn?.parts?.find(p => p.text)?.text;
          if (textPart) {
            this.onMessage?.(textPart);
          }
        },
        onerror: (e: any) => console.error('Gemini Live Error:', e),
        onclose: () => console.log('Gemini Live session closed'),
      },
    });

    this.session = await sessionPromise;
    return this.session;
  }

  private async playAudio(base64: string) {
    this.nextStartTime = Math.max(this.nextStartTime, this.audioContext.currentTime);
    const audioBuffer = await decodeAudioData(decode(base64), this.audioContext, 24000, 1);
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.outputNode);
    source.start(this.nextStartTime);
    this.nextStartTime += audioBuffer.duration;
    this.sources.add(source);
    source.onended = () => this.sources.delete(source);
  }

  private stopAllAudio() {
    this.sources.forEach(s => s.stop());
    this.sources.clear();
    this.nextStartTime = 0;
  }

  sendAudio(data: Float32Array) {
    if (!this.session) return;
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    this.session.sendRealtimeInput({
      media: {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
      },
    });
  }

  async sendFrame(canvas: HTMLCanvasElement) {
    if (!this.session) return;
    canvas.toBlob(async (blob) => {
      if (blob) {
        const base64 = await blobToBase64(blob);
        this.session.sendRealtimeInput({
          media: { data: base64, mimeType: 'image/jpeg' },
        });
      }
    }, 'image/jpeg', 0.6);
  }

  disconnect() {
    if (this.session) {
      this.session.close();
      this.session = null;
    }
    this.stopAllAudio();
  }
}
