import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          borderRadius: '1rem',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        },
      }}
    />
  );
}
