
export type ExtensionId = 'linkem' | 'showem';

export type BrowserId = 'edge' | 'firefox' | 'chrome';

export function getBrowserId() {
  const ua = navigator.userAgent;
  // Edge must be checked BEFORE Chrome!
  if (ua.includes("Edg/")) return "edge";
  if (ua.includes("Firefox/")) return "firefox";
  if (ua.includes("Chrome/")) return "chrome";
  return null;
}

export interface ExtensionInfo {
  id: ExtensionId;

  // General info
  displayName: string;
  logoUrl?: string;

  // Install links
  installLinks: { [key in BrowserId]?: string }
}

export const KNOWN_EXTENSIONS: { [key in ExtensionId]: ExtensionInfo } = {
  'linkem': {
    id: 'linkem',
    displayName: "Link'em",
    installLinks: {
      'edge': 'https://microsoftedge.microsoft.com/addons/detail/linkem/bbhhinakjmmlhnlofjojomdjpncamdbo',
      'chrome': 'https://chromewebstore.google.com/detail/linkem/gnpjkejilcbnhiohfbamleiajfakoamn',
      'firefox': 'https://addons.mozilla.org/en-US/firefox/addon/linkem/',
    }
  },
  'showem': {
    id: 'showem',
    displayName: "Show'em",
    installLinks: {}
  }
}
