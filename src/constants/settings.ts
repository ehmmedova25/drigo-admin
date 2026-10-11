export const SETTINGS_TABS = ['Fees', 'Penalties', 'Security'] as const;
export type SettingsTab = (typeof SETTINGS_TABS)[number];

export const COUNTRY_CODE_LENGTH = 2;
