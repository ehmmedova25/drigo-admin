export const FLEET_TABS = ['City targets', 'Car moves', 'Utilization'] as const;
export type FleetTab = (typeof FLEET_TABS)[number];
