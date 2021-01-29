export const HMT = {
  eventTrigged(module: string, method: string, content: string) {
    if ("_hmt" in window && location.protocol === "https:") window._hmt.push(["_trackEvent", module, method, content]);
  },
  pageViewed(path: string) {
    if ("_hmt" in window && location.protocol === "https:") window._hmt.push(["_trackPageview", path]);
  },
};

declare interface HMTStatic {
  id: string;
  cmd: { [key: string]: { push: Function } };
  push: (param: any[]) => void;
}

declare global {
  interface Window {
    _hmt: HMTStatic;
  }
}
