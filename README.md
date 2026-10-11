# DRIGO Admin Panel (frontend)

React + TypeScript + Vite admin panel for the DRIGO car-rental backend.

## Run

```bash
cp .env.example .env        # VITE_API_BASE_URL=http://localhost:4000
npm install
npm run dev                 # http://localhost:5173
```

The backend must be running on http://localhost:4000. Login: `admin` / `admin123`, OTP `123456`.

## Structure

```
src/
  main.tsx, App.tsx, index.scss
  api/                     baseApi.ts (RTK Query createApi, credentials: "include", 401 resets the cache), tags.ts,
                           endpoints/<domain>Api.ts (injectEndpoints per module, tag-based refetch)
  store/                   Redux store (index.ts) + typed hooks (hooks.ts)
  routes/                  AppRouter (lazy pages), PrivateRoute, PublicRoute, PermissionRoute
  components/
    ui/<Name>/             index.tsx + style.module.scss: Button, Input, Select, Textarea, Checkbox, Label, Form,
                           Card, Stack, Grid, Heading, Paragraph, Span, Link, Badge, Alert, Modal, Tabs, Table,
                           Pagination, Spinner, Code, Swatch
    common/<Name>/         DataTable/PagedTable, CrudTable, ActionModal, FormModal, DeleteModal, StatusChangeModal, FormField,
                           PageHeader, FieldList, MetricCard, ChartCard, MapView, StatusBadge, RowActions, Loader,
                           EmptyState, ErrorState, Toast, PaymentsTable, DebtPanel, DebtModals, CarFormModal
    layout/                MainLayout (sidebar + header), AuthLayout (login / verify)
  pages/<Page>/            index.tsx (+ style.module.scss, <Page>.schema.ts, components/<Name>.tsx + .module.scss)
  hooks/                   useAuth, usePagedQuery, useAction, useCrudModals, useDebounce, useToast
  constants/               paths, navigation, messages, config, env, _variables.scss (design tokens), <domain>.ts
  types/                   <domain>.types.ts (field names from the backend mappers)
  utils/                   cx, apiError, apiUrl, queryState, validation, format, sorting, status, carState, customerState, discountValue, polygon
```

Styling: SCSS modules only, colours/radii/shadows come from the CSS variables in `constants/_variables.scss`. Tables
are the project's own `Table` / `DataTable` components (no table library). Charts use Recharts, maps react-leaflet.
Data fetching uses RTK Query (Redux Toolkit); mutations invalidate tags so lists and details refetch on their own.
Every form uses react-hook-form + yup; schemas live in `pages/<Page>/<Page>.schema.ts`, messages in `FORM_MESSAGES`.

Every route has a required permission (`routes/AppRouter.tsx` → `PAGES`). The sidebar (`constants/navigation.ts`)
hides items the admin can't see, and `PermissionRoute` shows "No access" if the URL is opened directly.

No URLs, page sizes, timings or colors are hard-coded in components.

## Scripts

```bash
npm run dev       # dev server
npm run build     # type-check + production build (each page is its own chunk)
npx oxlint        # lint
```

## Core operations

| Operation | Where | Request |
|---|---|---|
| List + paginate + filter + search | every list page | `usePagedQuery` → `GET /x?page=&pageSize=&...` |
| Read a detail | rental / customer / car / reservation pages | `GET /x/:id` |
| Create | car, brand, debt, fine, accident, driver, zone | `POST` |
| Update | car, accident, driver, zone | `PUT` |
| Delete | car (409 if rented), brand (409 if it has cars), debt, accident, driver, zone | `DELETE` |
| End a rental | Rental detail | `GET /rentals/:id/end` |
| Retry a failed payment | Rental detail, Customer → Payments | `POST /users/:userId/payments/:paymentId/retry` |
| Verify a customer | Customer detail | `PUT /users/:id/verify` |
| Bill a fine → debt | Fines | `PUT /manual-fines/:id` (link rental/customer) then `POST /manual-fines/:id/bill-customer` |
| Collect a debt | Customer → Debt, Debts page | `POST /users/:id/debt/pay` / `pay-selected` / `:debtId/pay` |
| Assign a driver | Reservation detail | `POST /reservations/:id/assign-driver` |
| Send a car command | Car detail | `POST /cars/:id/send-command` |
| Send a campaign now | Notifications → Campaigns | `POST /notifications/campaigns/:id/execute` |
| Assign a car to a subscription | Subscriptions → Bookings | `PUT /subscription-bookings/:id/car` |
| Review a car report | Field operations → Car reports | `PUT /car-reports/:id/review` |
| Grant admin permissions | Admins & permissions | `PUT /permissions/admins/:id` |

After every mutation the affected data is re-fetched so the UI shows the new server state.
