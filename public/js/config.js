const API_URL = "https://coop-backend-hecq.onrender.com";

(() => {
  if (document.head.querySelector('script[data-vercel-speed-insights="true"]')) {
    return;
  }

  window.si = window.si || function (...params) {
    window.siq = window.siq || [];
    window.siq.push(params);
  };

  const script = document.createElement("script");
  script.defer = true;
  script.src = "/_vercel/speed-insights/script.js";
  script.dataset.sdkn = "@vercel/speed-insights";
  script.dataset.sdkv = "2.0.0";
  script.dataset.vercelSpeedInsights = "true";

  document.head.appendChild(script);
})();
