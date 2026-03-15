// Complete React DevTools Disabler for Figma Make Environment
// This prevents "injectIntoGlobalHook is not a function" error

(function() {
  if (typeof window === 'undefined') return;
  
  // Check if hook already exists
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__?.isDisabled) {
    return; // Already disabled in HTML
  }
  
  // Create comprehensive no-op functions
  const noop = () => {};
  const noopReturnsFalse = () => false;
  const noopReturnsNull = () => null;
  const noopReturnsMap = () => new Map();
  
  // Complete DevTools hook with ALL required methods
  const devtoolsHook = {
    // === CORE PROPERTIES ===
    isDisabled: true,
    supportsFiber: true,
    renderers: new Map(),
    
    // === INJECTION METHODS (CRITICAL!) ===
    inject: noop,
    injectIntoGlobalHook: noop,  // ← The function Figma needs!
    
    // === FIBER LIFECYCLE METHODS ===
    onCommitFiberRoot: noop,
    onPostCommitFiberRoot: noop,
    onCommitFiberUnmount: noop,
    
    // === RENDERER METHODS ===
    checkDCE: noop,
    getFiberRoots: noopReturnsMap,
    resolveRendererId: noopReturnsNull,
    
    // === INTERNAL STATE ===
    _renderers: new Map(),
    _fiberRoots: new Map(),
    
    // === EVENT METHODS ===
    sub: noop,
    on: noop,
    off: noop,
    emit: noop,
    
    // === PROFILER METHODS ===
    getTimelineData: noopReturnsNull,
    toggleProfilingStatus: noop,
    profilingHook: noop,
    
    // === ADDITIONAL METHODS ===
    helpers: {},
    backends: new Map(),
    hasUnsupportedRendererAttached: false,
  };
  
  // Make hook immutable and locked
  try {
    Object.defineProperty(window, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: Object.freeze(devtoolsHook)
    });
  } catch (error) {
    // Fallback: direct assignment and freeze
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = Object.freeze(devtoolsHook);
  }
})();

export {};