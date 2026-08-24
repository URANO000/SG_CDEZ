export type FontSizePreference = "normal" | "large" | "extra-large";

export interface AccessibilitySettings {
  fontSize: FontSizePreference;
  highContrast: boolean;
  reduceMotion: boolean;
}

const STORAGE_KEY = "sg-cdez-accessibility";

export const defaultAccessibilitySettings: AccessibilitySettings = {
  fontSize: "normal",
  highContrast: false,
  reduceMotion: false,
};

export function loadAccessibilitySettings(): AccessibilitySettings {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return defaultAccessibilitySettings;
  }

  try {
    return {
      ...defaultAccessibilitySettings,
      ...JSON.parse(saved),
    };
  } catch {
    return defaultAccessibilitySettings;
  }
}

export function applyAccessibilitySettings(settings: AccessibilitySettings) {
  const root = document.documentElement;

  root.dataset.accessibilityFont = settings.fontSize;

  root.dataset.accessibilityContrast = settings.highContrast
    ? "high"
    : "normal";

  root.dataset.accessibilityMotion = settings.reduceMotion
    ? "reduced"
    : "normal";
}

export function saveAccessibilitySettings(settings: AccessibilitySettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

  applyAccessibilitySettings(settings);
}
