/**
 * Vercel Speed Insights Initialization
 * This script loads and initializes Speed Insights for the application
 */

// Import and initialize Speed Insights
import { injectSpeedInsights } from './speed-insights.mjs';

// Initialize Speed Insights when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    injectSpeedInsights();
  });
} else {
  // DOM is already ready
  injectSpeedInsights();
}
