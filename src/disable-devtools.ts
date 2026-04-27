// Complete React DevTools Disabler for Figma Make Environment
// This prevents \"injectIntoGlobalHook is not a function\" error

(function () {
  if (typeof window === "undefined") return;

  const win = window as any;

  // Check if hook already exists
  if (win.__REACT_DEVTOOLS_GLOBAL_HOOK__?.isDisabled) {
    return; // Already disabled in HTML
  }

  // Create comprehensive no-op functions
  const noop = () => {};
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
    injectIntoGlobalHook: noop, // ? The function Figma needs!

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

  // Check if the property is writable before attempting to define or assign it
  const isWritable = (() => {
    try {
      Object.defineProperty(win, "__TEST_WRITABLE__", { value: true });
      delete win.__TEST_WRITABLE__;
      return true;
    } catch {
      return false;
    }
  })();

  if (isWritable) {
    try {
      Object.defineProperty(win, "__REACT_DEVTOOLS_GLOBAL_HOOK__", {
        configurable: false,
        enumerable: false,
        writable: false,
        value: Object.freeze(devtoolsHook),
      });
    } catch (error) {
      // Fallback: direct assignment and freeze
      try {
        win.__REACT_DEVTOOLS_GLOBAL_HOOK__ = Object.freeze(devtoolsHook);
      } catch (err) {
        console.warn(
          "[DevTools Blocker] Failed to assign hook even when writable check passed.",
        );
      }
    }
  } else {
    console.warn(
      "[DevTools Blocker] Unable to modify __REACT_DEVTOOLS_GLOBAL_HOOK__. Read-only environment detected.",
    );
  }
})();

export {};
