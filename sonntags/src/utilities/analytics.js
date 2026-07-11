// ponytail: no-op analytics stub; swap for @react-native-firebase/analytics if real tracking wanted
const Analytics = {
  logEvent(name, params) {
    if (__DEV__) {
      console.log("[analytics]", name, params || {});
    }
  },
  setEnabled(enabled) {
    if (__DEV__) {
      console.log("[analytics] setEnabled", enabled);
    }
  }
};

export default Analytics;
