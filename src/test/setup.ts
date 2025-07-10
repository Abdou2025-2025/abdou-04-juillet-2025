import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock IntersectionObserver  
Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  value: class IntersectionObserver {
    constructor(public callback: any, public options?: any) {}
    observe() {}
    unobserve() {}
    disconnect() {}
    get root() { return null }
    get rootMargin() { return '0px' }
    get thresholds() { return [] }
    takeRecords() { return [] }
  }
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})