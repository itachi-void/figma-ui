/**
 * React DevTools Blocker - Public Script
 * Loads before any module scripts to ensure DevTools hook is disabled
 * This prevents "injectIntoGlobalHook is not a function" error in Figma Make
 */

(function() {
  'use strict';
  
  if (typeof window === 'undefined') return;
  
  // Skip if already initialized
  if (window.__REACT_DEVTOOLS_INITIALIZED__) return;
  
  console.log('[DevTools Blocker] Initializing complete React DevTools blocker...');
  
  // Create comprehensive no-op functions
  var noop = function() {};
  var noopReturnsFalse = function() { return false; };
  var noopReturnsNull = function() { return null; };
  var noopReturnsTrue = function() { return true; };
  var noopReturnsMap = function() { return new Map(); };
  var noopReturnsSet = function() { return new Set(); };
  var noopReturnsEmptyArray = function() { return []; };
  var noopReturnsEmptyObject = function() { return {}; };
  
  // Complete DevTools hook implementation with ALL possible methods
  var devtoolsHook = {
    // === CORE PROPERTIES ===
    isDisabled: true,
    supportsFiber: true,
    renderers: new Map(),
    
    // === INJECTION METHODS (CRITICAL FOR FIGMA MAKE!) ===
    inject: noop,
    injectIntoGlobalHook: noop,  // ← THE KEY FUNCTION!
    injectIntoDevTools: noop,
    
    // === FIBER LIFECYCLE METHODS ===
    onCommitFiberRoot: noop,
    onPostCommitFiberRoot: noop,
    onCommitFiberUnmount: noop,
    onScheduleFiberRoot: noop,
    
    // === RENDERER METHODS ===
    checkDCE: noop,
    getFiberRoots: noopReturnsMap,
    resolveRendererId: noopReturnsNull,
    setRenderers: noop,
    
    // === INTERNAL STATE ===
    _renderers: new Map(),
    _fiberRoots: new Map(),
    _source: 'disabled',
    
    // === EVENT METHODS ===
    sub: noop,
    on: noop,
    off: noop,
    emit: noop,
    
    // === PROFILER METHODS ===
    getTimelineData: noopReturnsNull,
    toggleProfilingStatus: noop,
    profilingHook: noop,
    reactDevtoolsAgent: null,
    
    // === ADDITIONAL METHODS ===
    helpers: {},
    backends: new Map(),
    hasUnsupportedRendererAttached: false,
    
    // === INSPECTOR METHODS ===
    inspectElement: noop,
    selectElement: noop,
    
    // === REGISTRATION METHODS ===
    registerRenderer: noop,
    unregisterRenderer: noop,
    
    // === COMPATIBILITY METHODS ===
    supportsProfiling: noopReturnsFalse,
    supportsTracing: noopReturnsFalse,
    supportsTimeline: noopReturnsFalse,
  };
  
  // Freeze the hook object to prevent any modifications
  Object.freeze(devtoolsHook.renderers);
  Object.freeze(devtoolsHook._renderers);
  Object.freeze(devtoolsHook._fiberRoots);
  Object.freeze(devtoolsHook.helpers);
  Object.freeze(devtoolsHook.backends);
  Object.freeze(devtoolsHook);
  
  // Lock the hook to the window object
  try {
    Object.defineProperty(window, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: devtoolsHook
    });
    console.log('[DevTools Blocker] ✅ React DevTools successfully disabled!');
  } catch (error) {
    try {
      console.warn('[DevTools Blocker] Failed to use defineProperty, using fallback...');
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = devtoolsHook;
    } catch (e) {
      console.warn('[DevTools Blocker] Entirely failed to define hook (likely read-only environment like Figma). Skipping gracefully.');
    }
  }
  
  // Mark as initialized
  window.__REACT_DEVTOOLS_INITIALIZED__ = true;
  
  // Additional safety: Intercept any attempts to redefine the hook
  var originalDefineProperty = Object.defineProperty;
  Object.defineProperty = function(obj, prop, descriptor) {
    if (obj === window && prop === '__REACT_DEVTOOLS_GLOBAL_HOOK__') {
      console.warn('[DevTools Blocker] Blocked attempt to redefine DevTools hook');
      return obj;
    }
    return originalDefineProperty.call(this, obj, prop, descriptor);
  };
  
  console.log('[DevTools Blocker] Complete initialization finished.');
})();
