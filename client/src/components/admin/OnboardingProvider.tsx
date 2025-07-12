import React, { createContext, useContext, useState, useEffect } from 'react';

interface OnboardingContextType {
  shouldShowTour: boolean;
  startTour: () => void;
  completeTour: () => void;
  skipTour: () => void;
  resetTour: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [shouldShowTour, setShouldShowTour] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('iskcon-admin-onboarding-completed');
    const hasSkippedOnboarding = localStorage.getItem('iskcon-admin-onboarding-skipped');
    
    if (!hasCompletedOnboarding && !hasSkippedOnboarding) {
      // Show tour after a short delay to let the page load
      setTimeout(() => setShouldShowTour(true), 1000);
    }
  }, []);

  const startTour = () => {
    setShouldShowTour(true);
  };

  const completeTour = () => {
    setShouldShowTour(false);
    localStorage.setItem('iskcon-admin-onboarding-completed', 'true');
    localStorage.removeItem('iskcon-admin-onboarding-skipped');
  };

  const skipTour = () => {
    setShouldShowTour(false);
    localStorage.setItem('iskcon-admin-onboarding-skipped', 'true');
  };

  const resetTour = () => {
    localStorage.removeItem('iskcon-admin-onboarding-completed');
    localStorage.removeItem('iskcon-admin-onboarding-skipped');
    setShouldShowTour(true);
  };

  return (
    <OnboardingContext.Provider
      value={{
        shouldShowTour,
        startTour,
        completeTour,
        skipTour,
        resetTour,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};