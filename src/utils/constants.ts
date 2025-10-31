// Game Constants & Configuration
// WCAG AA verified colors, frame budget targets, input parameters

export const COLORS = {
  bg: '#0a0e27', // Deep navy
  ship: '#00ff88', // Bright cyan
  enemy: '#ff1744', // Neon red
  bullet: '#ffeb3b', // Bright yellow
  ui: '#ffffff', // White (4.5:1 contrast on bg)
  warning: '#ff6b6b', // Red for warnings
} as const;

export const FRAME_BUDGET = {
  target: 60, // FPS
  maxFrameTime: 16.67, // ms (1000/60)
  p95Threshold: 18, // ms (allow 1.33ms margin)
  renderBudget: 12, // ms
  updateBudget: 3, // ms
  audioBudget: 2, // ms
  reserveBudget: 1.67, // ms
} as const;

export const INPUT = {
  gamepadDeadzone: 0.15, // Radial deadzone (normalized)
  pollInterval: 16.67, // ms (match 60 FPS)
} as const;

export const AUDIO = {
  contextType: 'AudioContext',
  polyphonySfxLimit: 6, // Max simultaneous SFX sources
  gainDuckingValue: 0.3, // Music gain when SFX playing
  masterGain: 1.0, // Default master volume
} as const;

export const ENTITY = {
  playerPoolSize: 1,
  enemyPoolSize: 15,
  bulletPoolSize: 50,
  totalPoolSize: 66, // 1 + 15 + 50
} as const;

export const COLLISION = {
  aabbBroadPhaseBudget: 3, // ms
  spatialGridSize: 10, // Grid cells per axis
} as const;

export const MOBILE = {
  viewportFit: 'cover', // Enable safe-area-inset
  orientationLock: 'portrait-primary',
} as const;
