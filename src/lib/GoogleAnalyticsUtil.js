import ReactGA from "react-ga4";

export const TrackGoogleAnalyticsEvent = (category, action, label) => {
  if (import.meta.env.MODE === "Production") {
    if (!category || !action) {
      console.error("trackEvent: category and action are required parameters");
      return;
    }

    ReactGA.event({
      category: category,
      action: action,
      label: label || undefined,
    });
    console.log("Event to be sent:", { category, action, label });
  } else {
    console.log(`Event tracked: ${category}`);
  }
};
