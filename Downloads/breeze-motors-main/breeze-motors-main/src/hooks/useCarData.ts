
import { useOptimizedCarData } from './useOptimizedCarData';

// Legacy hook that now uses Supabase data
export const useCarData = () => {
  return useOptimizedCarData();
};

