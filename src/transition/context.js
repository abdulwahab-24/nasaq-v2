import { createContext, useContext } from 'react';

export const TransitionContext = createContext({
  go: () => {},
  registerHero: () => {},
  whenSettled: () => Promise.resolve(),
  isTransitioning: () => false,
});

export const useTransition = () => useContext(TransitionContext);
