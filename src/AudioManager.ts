// Web Audio API Manager

import { AUDIO } from './utils/constants';

export class AudioManager {
  audioContext: AudioContext | null = null;
  masterGain: GainNode | null = null;
  sfxSources: AudioBufferSourceNode[] = [];
  musicSource: AudioBufferSourceNode | null = null;
  contextResumeAttempted = false;

  constructor() {
    this.tryInitContext();
  }

  private tryInitContext(): void {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.audioContext = audioContext;
      this.masterGain = audioContext.createGain();
      this.masterGain.gain.value = AUDIO.masterGain;
      this.masterGain.connect(audioContext.destination);
    } catch (e) {
      console.error('Failed to initialize AudioContext:', e);
    }
  }

  async resumeContext(): Promise<void> {
    if (this.contextResumeAttempted || !this.audioContext) return;

    this.contextResumeAttempted = true;

    try {
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
        console.log('AudioContext resumed');
      }
    } catch (e) {
      console.warn('Failed to resume AudioContext:', e);
    }
  }

  async decodeAudio(arrayBuffer: ArrayBuffer): Promise<AudioBuffer | null> {
    if (!this.audioContext) return null;

    try {
      return await this.audioContext.decodeAudioData(arrayBuffer);
    } catch (e) {
      console.error('Failed to decode audio:', e);
      return null;
    }
  }

  playSfx(buffer: AudioBuffer): void {
    if (!this.audioContext || !this.masterGain) return;

    // Reuse or create source
    let source = this.sfxSources.pop();
    if (!source) {
      source = this.audioContext.createBufferSource();
    }

    source.buffer = buffer;
    source.connect(this.masterGain);
    source.start();

    // Auto-recycle after playback
    source.onended = () => {
      this.sfxSources.push(source!);
    };
  }

  playMusic(buffer: AudioBuffer, loop = true): void {
    if (!this.audioContext || !this.masterGain) return;

    if (this.musicSource) {
      this.musicSource.stop();
    }

    this.musicSource = this.audioContext.createBufferSource();
    this.musicSource.buffer = buffer;
    this.musicSource.loop = loop;
    this.musicSource.connect(this.masterGain);
    this.musicSource.start();
  }

  stopMusic(): void {
    if (this.musicSource) {
      this.musicSource.stop();
      this.musicSource = null;
    }
  }

  setMasterGain(gain: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, gain));
    }
  }

  getMasterGain(): number {
    return this.masterGain?.gain.value || 0;
  }

  getContextState(): string {
    return this.audioContext?.state || 'closed';
  }
}
