import type { Permission } from '@/types/auth.types';
import { ROUTES } from './paths';

export interface NavItem {
  to: string;
  label: string;
  permission: Permission;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Overview',
    items: [{ to: ROUTES.DASHBOARD, label: 'Dashboard', permission: 'dashboard.view' }],
  },
  {
    title: 'Operations',
    items: [
      { to: ROUTES.RENTALS, label: 'Rentals', permission: 'rentals.view' },
      { to: ROUTES.CUSTOMERS, label: 'Customers', permission: 'customers.view' },
      { to: ROUTES.RESERVATIONS, label: 'Reservations', permission: 'reservations.view' },
      { to: ROUTES.DELIVERY, label: 'Drivers & zones', permission: 'delivery.view' },
      { to: ROUTES.SUPPORT, label: 'Support', permission: 'support.view' },
      { to: ROUTES.OPERATIONS, label: 'Field operations', permission: 'fleet.view' },
    ],
  },
  {
    title: 'Fleet',
    items: [
      { to: ROUTES.CARS, label: 'Cars', permission: 'cars.view' },
      { to: ROUTES.TRACKING, label: 'Live tracking', permission: 'cars.view' },
      { to: ROUTES.BRANDS, label: 'Brands', permission: 'cars.view' },
      { to: ROUTES.FLEET, label: 'Fleet planning', permission: 'fleet.view' },
      { to: ROUTES.GEO, label: 'Geo zones', permission: 'fleet.view' },
    ],
  },
  {
    title: 'Finance',
    items: [
      { to: ROUTES.DEBTS, label: 'Debts', permission: 'debts.view' },
      { to: ROUTES.FINES, label: 'Fines', permission: 'fines.view' },
      { to: ROUTES.ACCIDENTS, label: 'Accidents', permission: 'fines.view' },
      { to: ROUTES.TARIFFS, label: 'Tariffs', permission: 'tariffs.view' },
      { to: ROUTES.SUBSCRIPTIONS, label: 'Subscriptions', permission: 'tariffs.view' },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { to: ROUTES.PROMOTIONS, label: 'Promotions', permission: 'promotions.view' },
      { to: ROUTES.NOTIFICATIONS, label: 'Notifications', permission: 'promotions.view' },
    ],
  },
  {
    title: 'Reports',
    items: [
      { to: ROUTES.ANALYTICS, label: 'Analytics', permission: 'analytics.view' },
      { to: ROUTES.REPORTS, label: 'Monthly report', permission: 'analytics.view' },
      { to: ROUTES.SALIK_ENOC, label: 'Salik & ENOC', permission: 'analytics.view' },
    ],
  },
  {
    title: 'System',
    items: [
      { to: ROUTES.SETTINGS, label: 'Settings', permission: 'settings.view' },
      { to: ROUTES.MONITORING, label: 'Monitoring', permission: 'settings.view' },
      { to: ROUTES.ADMINS, label: 'Admins & permissions', permission: 'admins.view' },
    ],
  },
];
