import { Link as RouterLink } from 'react-router-dom';
import {
  useGetDashboardFleetQuery,
  useGetDashboardKpisQuery,
  useGetDashboardRecentActivityQuery,
  useGetDashboardTrendsQuery,
  useGetOnlineUsersQuery,
} from '@/api/endpoints/dashboardApi';
import { DataTable } from '@/components/common/data-table';
import { EmptyState } from '@/components/common/empty-state';
import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { MetricCard } from '@/components/common/metric-card';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Grid } from '@/components/ui/grid';
import { Link } from '@/components/ui/link';
import { Span } from '@/components/ui/span';
import { ROUTES } from '@/constants/paths';
import { getErrorMessage } from '@/utils/apiError';
import { formatDateTime, formatMoney } from '@/utils/format';
import { combineQueries } from '@/utils/queryState';
import { FleetCard } from './components/FleetCard';
import { LatestRentals } from './components/LatestRentals';
import { TrendCharts } from './components/TrendCharts';
import { WelcomeBanner } from './components/WelcomeBanner';
import styles from './style.module.scss';

const ACTIVITY_LIMIT = 12;

const Dashboard = () => {
  const kpisQuery = useGetDashboardKpisQuery();
  const trendsQuery = useGetDashboardTrendsQuery();
  const fleetQuery = useGetDashboardFleetQuery();
  const activityQuery = useGetDashboardRecentActivityQuery();
  const onlineUsersQuery = useGetOnlineUsersQuery();
  const { loading, error, reload } = combineQueries([kpisQuery, trendsQuery, fleetQuery, activityQuery, onlineUsersQuery]);

  const kpis = kpisQuery.data;
  const trends = trendsQuery.data;
  const fleet = fleetQuery.data;
  const activity = activityQuery.data?.activity;
  const onlineUsers = onlineUsersQuery.data;

  if (error) return <ErrorState error={getErrorMessage(error)} onRetry={reload} />;
  if (!kpis || !trends || !fleet || !activity || !onlineUsers) return <Loader />;

  return (
    <>
      <PageHeader
        title="Dashboard"
        actions={
          <Button onClick={reload} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        }
      />

      <WelcomeBanner activeRentals={kpis.activeRentals} availableCars={fleet.available} />

      <Grid minItemWidth="sm">
        <MetricCard label="Active rentals" value={kpis.activeRentals} tone="accent" />
        <MetricCard label="Active reservations" value={kpis.activeReservations} tone="lavender" />
        <MetricCard label="Today revenue" value={formatMoney(kpis.todayRevenue)} tone="lilac" />
        <MetricCard label="Monthly revenue" value={formatMoney(kpis.monthlyRevenue)} tone="sky" />
        <MetricCard label="Total unpaid debt" value={formatMoney(kpis.totalDebt)} tone="rose" />
      </Grid>
      <Grid minItemWidth="sm">
        <MetricCard label="Open support tickets" value={kpis.openSupportTickets} />
        <MetricCard label="Pending verification" value={kpis.pendingVerificationCount} />
        <MetricCard label="Members" value={kpis.totalMembers} />
        <MetricCard label="Online users" value={onlineUsers.length} />
      </Grid>

      <TrendCharts trends={trends} />

      <Grid align="start">
        <FleetCard fleet={fleet} />
        <LatestRentals />
      </Grid>

      <Grid>
        <Card title="Recent activity">
          {activity.length === 0 ? (
            <EmptyState text="No activity yet. It appears while the backend simulation is running." />
          ) : (
            <div className={styles.activity}>
              {activity.slice(0, ACTIVITY_LIMIT).map((item) => (
                <div key={item.id} className={styles.activityItem}>
                  <Span color="var(--text-primary)" weight="400">
                    {item.message}
                  </Span>
                  <Span size="12px" className={styles.activityDate}>
                    {formatDateTime(item.at)}
                  </Span>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card title="Online users">
          <DataTable
            rows={onlineUsers}
            rowKey={(user) => user.userId}
            emptyText="Nobody is online right now"
            columns={[
              {
                key: 'name',
                header: 'Customer',
                render: (user) => (
                  <Link component={RouterLink} to={ROUTES.CUSTOMER(user.userId)}>
                    {user.fullName}
                  </Link>
                ),
              },
              { key: 'platform', header: 'Platform', render: (user) => user.platform },
              { key: 'login', header: 'Last login', render: (user) => formatDateTime(user.lastLoginAt) },
            ]}
          />
        </Card>
      </Grid>
    </>
  );
};

export default Dashboard;
