/**
 * App Settings
 */
export function getSettings(): Settings {
  const defaultSettings: Settings = {
    model: "gpt-3.5-turbo",
    enterBehaviour: "send",
    // Disabled by default, since token parsing requires downloading larger deps
    countTokens: false,
    justShowMeTheCode: false,
  };

  const settings = localStorage.getItem("settings");
  if (!settings) {
    return defaultSettings;
  }

  return { ...defaultSettings, ...JSON.parse(settings) };
}

export function setSettings(settings: Settings) {
  localStorage.setItem("settings", JSON.stringify(settings));
}

/**
 * GitHub OAuth App Token
 */
export function getToken(): string | undefined {
  const gh_token = localStorage.getItem("gh_token");
  if (!gh_token) {
    return;
  }

  return JSON.parse(gh_token) as string;
}

export function setToken(token: string) {
  localStorage.setItem("gh_token", JSON.stringify(token));
}

/**
 * GitHub User
 */
export function getUser(): User | undefined {
  const user = localStorage.getItem("gh_user");
  if (!user) {
    return;
  }

  return JSON.parse(user) as User;
}

export function setUser(user: User) {
  localStorage.setItem("gh_user", JSON.stringify(user));
}