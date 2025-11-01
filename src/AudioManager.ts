// Web Audio API Manager with SFX pooling and gain ducking

import { AUDIO } from './utils/constants';

interface SFXPool {
  available: AudioBufferSourceNode[];
  playing: Set<AudioBufferSourceNode>;
}

export class AudioManager {
  audioContext: AudioContext | null = null;
  masterGain: GainNode | null = null;
  musicGain: GainNode | null = null;
  sfxGain: GainNode | null = null;
  sfxPool: SFXPool = { available: [], playing: new Set() };
  musicSource: AudioBufferSourceNode | null = null;
  contextResumeAttempted = false;
  
  // Audio buffers (loaded on-demand)
  buffers: Map<string, AudioBuffer> = new Map();
  
  // Ducking state
  musicBaseGain = 0.5;
  musicDuckedGain = 0.3;
  duckingRampTime = 0.1; // seconds

  constructor() {
    this.tryInitContext();
  }

  private tryInitContext(): void {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.audioContext = audioContext;
      
      // Create gain nodes hierarchy
      this.masterGain = audioContext.createGain();
      this.masterGain.gain.value = AUDIO.masterGain;
      this.masterGain.connect(audioContext.destination);
      
      // Music channel
      this.musicGain = audioContext.createGain();
      this.musicGain.gain.value = this.musicBaseGain;
      this.musicGain.connect(this.masterGain);
      
      // SFX channel
      this.sfxGain = audioContext.createGain();
      this.sfxGain.gain.value = 0.8;
      this.sfxGain.connect(this.masterGain);
      
      // Pre-allocate SFX pool
      for (let i = 0; i < AUDIO.polyphonySfxLimit; i++) {
        const source = audioContext.createBufferSource();
        this.sfxPool.available.push(source);
      }
    } catch {
      // AudioContext not supported
    }
  }

  async resumeContext(): Promise<void> {
    if (this.contextResumeAttempted || !this.audioContext) return;

    this.contextResumeAttempted = true;

    try {
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
    } catch {
      // Failed to resume
    }
  }

  async loadAudio(url: string): Promise<AudioBuffer | null> {
    if (!this.audioContext) return null;

    try {
      const response = await window.fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      return await this.audioContext.decodeAudioData(arrayBuffer);
    } catch {
      return null;
    }
  }

  async loadAndCacheAudio(key: string, url: string): Promise<void> {
    if (this.buffers.has(key)) return;
    const buffer = await this.loadAudio(url);
    if (buffer) {
      this.buffers.set(key, buffer);
    }
  }

  playSfx(buffer: AudioBuffer): void {
    if (!this.audioContext || !this.sfxGain) return;

    // Get source from pool or create new
    let source = this.sfxPool.available.pop();
    if (!source) {
      source = this.audioContext.createBufferSource();
    }

    source.buffer = buffer;
    source.connect(this.sfxGain);
    this.sfxPool.playing.add(source);
    
    // Duck music when SFX starts
    this.applyMusicDucking(true);
    
    source.onended = () => {
      this.sfxPool.playing.delete(source!);
      this.sfxPool.available.push(source!);
      
      // Restore music gain when no SFX playing
      if (this.sfxPool.playing.size === 0) {
        this.applyMusicDucking(false);
      }
    };
    
    source.start();
  }
  
  playSfxByKey(key: string): void {
    const buffer = this.buffers.get(key);
    if (buffer) {
      this.playSfx(buffer);
    }
  }
  
  private applyMusicDucking(duck: boolean): void {
    if (!this.musicGain || !this.audioContext) return;
    
    const targetGain = duck ? this.musicDuckedGain : this.musicBaseGain;
    const currentTime = this.audioContext.currentTime;
    
    this.musicGain.gain.cancelScheduledValues(currentTime);
    this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, currentTime);
    this.musicGain.gain.exponentialRampToValueAtTime(
      targetGain,
      currentTime + this.duckingRampTime,
    );
  }

  playMusic(buffer: AudioBuffer, loop = true): void {
    if (!this.audioContext || !this.musicGain) return;

    if (this.musicSource) {
      this.musicSource.stop();
    }

    this.musicSource = this.audioContext.createBufferSource();
    this.musicSource.buffer = buffer;
    this.musicSource.loop = loop;
    this.musicSource.connect(this.musicGain);
    this.musicSource.start();
  }
  
  playMusicByKey(key: string, loop = true): void {
    const buffer = this.buffers.get(key);
    if (buffer) {
      this.playMusic(buffer, loop);
    }
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
