import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

// --- LocalStorage Mock with state isolation ---
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string): string | null => store[key] ?? null),
    setItem: vi.fn((key: string, value: string): void => {
      store[key] = String(value);
    }),
    removeItem: vi.fn((key: string): void => {
      delete store[key];
    }),
    clear: vi.fn((): void => {
      store = {};
    }),
    key: vi.fn((index: number): string | null => Object.keys(store)[index] ?? null),
    get length(): number {
      return Object.keys(store).length;
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

// --- AudioContext / webkitAudioContext Mock ---
class MockAudioParam {
  value: number = 0;
  setValueAtTime = vi.fn().mockReturnThis();
  exponentialRampToValueAtTime = vi.fn().mockReturnThis();
  linearRampToValueAtTime = vi.fn().mockReturnThis();
}

class MockAudioNode {
  connect = vi.fn().mockReturnThis();
  disconnect = vi.fn().mockReturnThis();
}

class MockOscillatorNode extends MockAudioNode {
  type: string = 'sine';
  frequency = new MockAudioParam();
  start = vi.fn();
  stop = vi.fn();
}

class MockGainNode extends MockAudioNode {
  gain = new MockAudioParam();
}

class MockBiquadFilterNode extends MockAudioNode {
  type: string = 'lowpass';
  frequency = new MockAudioParam();
}

class MockAudioContext {
  state: 'suspended' | 'running' | 'closed' = 'suspended';
  currentTime: number = 0;
  destination = {};

  resume = vi.fn().mockImplementation(() => {
    this.state = 'running';
    return Promise.resolve();
  });

  suspend = vi.fn().mockImplementation(() => {
    this.state = 'suspended';
    return Promise.resolve();
  });

  close = vi.fn().mockImplementation(() => {
    this.state = 'closed';
    return Promise.resolve();
  });

  createOscillator = vi.fn(() => new MockOscillatorNode());
  createGain = vi.fn(() => new MockGainNode());
  createBiquadFilter = vi.fn(() => new MockBiquadFilterNode());
}

(window as any).AudioContext = MockAudioContext;
(window as any).webkitAudioContext = MockAudioContext;

// --- Navigator.vibrate Mock ---
if (typeof navigator !== 'undefined') {
  Object.defineProperty(navigator, 'vibrate', {
    value: vi.fn(),
    writable: true,
    configurable: true,
  });
}

// --- Window.matchMedia Mock ---
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// --- HTMLCanvasElement.prototype.getContext Mock ---
HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation(() => ({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(() => ({ data: new Array(4) })),
  putImageData: vi.fn(),
  createImageData: vi.fn(() => []),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  fillText: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  transform: vi.fn(),
  rect: vi.fn(),
  clip: vi.fn(),
})) as any;

// --- Canvas Confetti Mock ---
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));
