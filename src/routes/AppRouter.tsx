import { lazy, Suspense, type ComponentType } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Loader } from '@/components/common/loader';
import { AuthLayout } from '@/components/layout/auth-layout';
import { MainLayout } from '@/components/layout/main-layout';
import { ROUTES } from '@/constants/paths';
import type { Permission } from '@/types/auth.types';
import { PermissionRoute } from './PermissionRoute';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';

const Login = lazy(() => import('@/pages/login'));
const VerifyOtp = lazy(() => import('@/pages/verify-otp'));
const NotFound = lazy(() => import('@/pages/not-found'));
const Dashboard = lazy(() => import('@/pages/dashboard'));
const RentalsList = lazy(() => import('@/pages/rentals-list'));
const RentalDetail = lazy(() => import('@/pages/rental-detail'));
const CustomersList = lazy(() => import('@/pages/customers-list'));
const CustomerDetail = lazy(() => import('@/pages/customer-detail'));
const CarsList = lazy(() => import('@/pages/cars-list'));
const CarDetail = lazy(() => import('@/pages/car-detail'));
const Tracking = lazy(() => import('@/pages/tracking'));
const Brands = lazy(() => import('@/pages/brands'));
const ReservationsList = lazy(() => import('@/pages/reservations-list'));
const ReservationDetail = lazy(() => import('@/pages/reservation-detail'));
const Delivery = lazy(() => import('@/pages/delivery'));
const Debts = lazy(() => import('@/pages/debts'));
const Fines = lazy(() => import('@/pages/fines'));
const Accidents = lazy(() => import('@/pages/accidents'));
const Support = lazy(() => import('@/pages/support'));
const MonthlyReport = lazy(() => import('@/pages/monthly-report'));
const Analytics = lazy(() => import('@/pages/analytics'));
const SalikEnoc = lazy(() => import('@/pages/salik-enoc'));
const Tariffs = lazy(() => import('@/pages/tariffs'));
const Subscriptions = lazy(() => import('@/pages/subscriptions'));
const Promotions = lazy(() => import('@/pages/promotions'));
const Notifications = lazy(() => import('@/pages/notifications'));
const Fleet = lazy(() => import('@/pages/fleet'));
const Geo = lazy(() => import('@/pages/geo'));
const Operations = lazy(() => import('@/pages/operations'));
const Monitoring = lazy(() => import('@/pages/monitoring'));
const Settings = lazy(() => import('@/pages/settings'));
const Admins = lazy(() => import('@/pages/admins'));

const PAGES: { path: string; permission: Permission; Page: ComponentType }[] = [
  { path: ROUTES.DASHBOARD, permission: 'dashboard.view', Page: Dashboard },
  { path: ROUTES.RENTALS, permission: 'rentals.view', Page: RentalsList },
  { path: ROUTES.RENTAL(':id'), permission: 'rentals.view', Page: RentalDetail },
  { path: ROUTES.CUSTOMERS, permission: 'customers.view', Page: CustomersList },
  { path: ROUTES.CUSTOMER(':id'), permission: 'customers.view', Page: CustomerDetail },
  { path: ROUTES.CARS, permission: 'cars.view', Page: CarsList },
  { path: ROUTES.CAR(':id'), permission: 'cars.view', Page: CarDetail },
  { path: ROUTES.TRACKING, permission: 'cars.view', Page: Tracking },
  { path: ROUTES.BRANDS, permission: 'cars.view', Page: Brands },
  { path: ROUTES.RESERVATIONS, permission: 'reservations.view', Page: ReservationsList },
  { path: ROUTES.RESERVATION(':id'), permission: 'reservations.view', Page: ReservationDetail },
  { path: ROUTES.DELIVERY, permission: 'delivery.view', Page: Delivery },
  { path: ROUTES.DEBTS, permission: 'debts.view', Page: Debts },
  { path: ROUTES.FINES, permission: 'fines.view', Page: Fines },
  { path: ROUTES.ACCIDENTS, permission: 'fines.view', Page: Accidents },
  { path: ROUTES.SUPPORT, permission: 'support.view', Page: Support },
  { path: ROUTES.REPORTS, permission: 'analytics.view', Page: MonthlyReport },
  { path: ROUTES.ANALYTICS, permission: 'analytics.view', Page: Analytics },
  { path: ROUTES.SALIK_ENOC, permission: 'analytics.view', Page: SalikEnoc },
  { path: ROUTES.TARIFFS, permission: 'tariffs.view', Page: Tariffs },
  { path: ROUTES.SUBSCRIPTIONS, permission: 'tariffs.view', Page: Subscriptions },
  { path: ROUTES.PROMOTIONS, permission: 'promotions.view', Page: Promotions },
  { path: ROUTES.NOTIFICATIONS, permission: 'promotions.view', Page: Notifications },
  { path: ROUTES.FLEET, permission: 'fleet.view', Page: Fleet },
  { path: ROUTES.GEO, permission: 'fleet.view', Page: Geo },
  { path: ROUTES.OPERATIONS, permission: 'fleet.view', Page: Operations },
  { path: ROUTES.MONITORING, permission: 'settings.view', Page: Monitoring },
  { path: ROUTES.SETTINGS, permission: 'settings.view', Page: Settings },
  { path: ROUTES.ADMINS, permission: 'admins.view', Page: Admins },
];

export const AppRouter = () => (
  <BrowserRouter>
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.VERIFY} element={<VerifyOtp />} />
          </Route>
        </Route>
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            {PAGES.map(({ path, permission, Page }) => (
              <Route key={path} element={<PermissionRoute permission={permission} />}>
                <Route path={path} element={<Page />} />
              </Route>
            ))}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  </BrowserRouter>
);
