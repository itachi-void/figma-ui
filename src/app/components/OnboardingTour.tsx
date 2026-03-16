'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, Sparkles, Map, Bell, MessageSquare, Search, ClipboardList } from 'lucide-react';

interface TourStep {
  title: string;
  description: string;
  icon: typeof Sparkles;
  color: string;
  tip?: string;
}

const STEPS: TourStep[] = [
  {
    title: 'Welcome to RecycleHub! 🎉',
    description: 'Your smart dashboard for managing Egypt\'s bottle recycling network. Let\'s take a quick tour of the new features we just added.',
    icon: Sparkles,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    title: '🔍 Global Search (Ctrl+K)',
    description: 'Press Ctrl+K anytime to instantly search across all pages, drivers, routes, and citizens. No more hunting through menus!',
    icon: Search,
    color: 'from-blue-500 to-cyan-500',
    tip: 'Try it now: Press Ctrl+K',
  },
  {
    title: '🔔 Live Notifications',
    description: 'The bell icon in the top-right shows real-time notifications. New events appear automatically — driver updates, route completions, and system alerts.',
    icon: Bell,
    color: 'from-red-500 to-orange-500',
    tip: 'Click the bell icon to see all notifications',
  },
  {
    title: '💬 Driver Chat',
    description: 'Chat directly with drivers using the chat bubble next to the bell. Drivers auto-reply to keep you updated on their status.',
    icon: MessageSquare,
    color: 'from-purple-500 to-pink-500',
    tip: 'Click the chat icon to message drivers',
  },
  {
    title: '🗺️ Live Map with Routing',
    description: 'Go to Routes → switch to Map view to see all drivers on Cairo\'s map in real-time. Plan routes, simulate journeys, and track progress.',
    icon: Map,
    color: 'from-green-500 to-emerald-500',
    tip: 'Navigate to Routes → Live Map',
  },
  {
    title: '📋 Activity Log',
    description: 'Every action in the system is recorded in the Activity Log page. Filter by category, severity, or search specific events.',
    icon: ClipboardList,
    color: 'from-orange-500 to-amber-500',
    tip: 'Check the sidebar: Activity Log',
  },
  {
    title: 'You\'re all set! 🚀',
    description: 'You\'ve been introduced to the main features. Explore citizen loyalty points, driver ratings, analytics predictions, and much more.',
    icon: Sparkles,
    color: 'from-violet-500 to-purple-500',
    tip: 'Start exploring the dashboard!',
  },
];

const STORAGE_KEY = 'recyclehub-onboarding-done';

export function OnboardingTour() {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      setTimeout(() => setIsVisible(true), 1500);
    }
  }, []);

  const dismiss = () => {
    setIsVisible(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
    else dismiss();
  };

  const prev = () => setStep(s => Math.max(0, s - 1));

  const currentStep = STEPS[step];
  const Icon = currentStep.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) dismiss(); }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header Gradient */}
            <div className={`bg-gradient-to-br ${currentStep.color} p-8 text-white text-center relative overflow-hidden`}>
              <motion.button
                onClick={dismiss}
                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4 text-white" />
              </motion.button>

              <motion.div
                key={step}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4"
              >
                <Icon className="w-10 h-10 text-white" />
              </motion.div>

              {/* Step dots */}
              <div className="flex gap-2 justify-center mb-4">
                {STEPS.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setStep(i)}
                    animate={{ width: i === step ? 24 : 8, opacity: i === step ? 1 : 0.5 }}
                    className="h-2 bg-white rounded-full"
                  />
                ))}
              </div>

              <p className="text-white/70 text-sm">Step {step + 1} of {STEPS.length}</p>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-3">{currentStep.title}</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">{currentStep.description}</p>
                  {currentStep.tip && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 rounded-xl border border-amber-200">
                      <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                      <p className="text-sm text-amber-700 font-medium">{currentStep.tip}</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6">
                <motion.button
                  onClick={prev}
                  disabled={step === 0}
                  whileHover={{ scale: step === 0 ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </motion.button>

                <button onClick={dismiss} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                  Skip tour
                </button>

                <motion.button
                  onClick={next}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-5 py-2 text-white rounded-xl font-semibold bg-gradient-to-r ${currentStep.color} shadow-lg transition-all`}
                >
                  {isLast ? '🚀 Start!' : 'Next'}
                  {!isLast && <ChevronRight className="w-4 h-4" />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
