import { useState, type ComponentType } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  useGetMonitoringContainersQuery,
  useGetMonitoringDatabaseQuery,
  useGetMonitoringLogsQuery,
  useGetMonitoringOverviewQuery,
  useGetTelematicsDevicesQuery,
} from '@/api/endpoints/monitoringApi';
import { DataTable, PagedTable } from '@/components/common/data-table';
import { ErrorState } from '@/components/common/error-state';
import { FieldList } from '@/components/common/field-list';
import { Loader } from '@/components/common/loader';
import { PageHeader } from '@/components/common/page-header';
import { StatusBadge } from '@/components/common/status-badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Code } from '@/components/ui/code';
import { Grid } from '@/components/ui/grid';
import { Link } from '@/components/ui/link';
import { Span } from '@/components/ui/span';
import { Stack } from '@/components/ui/stack';
import { Tabs } from '@/components/ui/tabs';
import { TIMING } from '@/constants/config';
import { LOGS_PAGE_SIZE, MAX_SIGNAL, MONITORING_TABS, SECONDS_PER_HOUR, type MonitoringTab } from '@/constants/monitoring';
import { ROUTES } from '@/constants/paths';
import { usePagedQuery } from '@/hooks/usePagedQuery';
import { getErrorMessage } from '@/utils/apiError';
import { formatDateTime, formatNumber, formatPercent } from '@/utils/format';

const OverviewTab = () => {
  const overview = useGetMonitoringOverviewQuery(undefined, { pollingInterval: TIMING.monitoringPollMs });
  const containers = useGetMonitoringContainersQuery(undefined, { pollingInterval: TIMING.monitoringPollMs });

  const retry = () => {
    overview.refetch();
    containers.refetch();
  };

  if (overview.isLoading || containers.isLoading) return <Loader />;
  if (overview.error || containers.error || !overview.data || !containers.data) {
    return <ErrorState error={getErrorMessage(overview.error ?? containers.error)} onRetry={retry} />;
  }
  const { api, database, redis, teltonika } = overview.data;

  return (
    <>
      <Grid>
        <Card title="API" action={<StatusBadge status={api.status} />}>
          <FieldList
            items={[
              ['Uptime', `${formatNumber(api.uptimeSeconds / SECONDS_PER_HOUR)} h`],
              ['Requests / min', api.requestsPerMinute],
              ['Avg response', `${api.avgResponseMs} ms`],
              ['Error rate', formatPercent(api.errorRate)],
            ]}
          />
        </Card>
        <Card title="Services">
          <FieldList
            items={[
              ['Database', <StatusBadge key="db" status={database.status} />],
              ['DB connections', database.connections],
              ['Redis', <StatusBadge key="redis" status={redis.status} />],
              ['Redis memory', `${redis.memoryMb} MB`],
              ['GPS gateway', <StatusBadge key="gps" status={teltonika.status} />],
              ['GPS devices online', `${teltonika.onlineDevices} / ${teltonika.totalDevices}`],
            ]}
          />
        </Card>
      </Grid>
      <Card title="Containers">
        <DataTable
          rows={containers.data}
          rowKey={(container) => container.name}
          columns={[
            { key: 'name', header: 'Name', render: (container) => <Code>{container.name}</Code> },
            { key: 'status', header: 'Status', render: (container) => <StatusBadge status={container.status} /> },
            { key: 'cpu', header: 'CPU', render: (container) => formatPercent(container.cpu) },
            { key: 'memory', header: 'Memory', render: (container) => `${container.memoryMb} MB` },
            { key: 'uptime', header: 'Uptime', render: (container) => container.uptime },
          ]}
        />
      </Card>
    </>
  );
};

const LogsTab = () => {
  const list = usePagedQuery(useGetMonitoringLogsQuery, {}, LOGS_PAGE_SIZE);

  return (
    <Card
      action={
        <Button onClick={list.reload} disabled={list.loading}>
          Refresh
        </Button>
      }
    >
      <PagedTable
        list={list}
        rowKey={(log) => log.id}
        columns={[
          { key: 'at', header: 'Time', render: (log) => formatDateTime(log.at) },
          { key: 'level', header: 'Level', render: (log) => <StatusBadge status={log.level} /> },
          { key: 'service', header: 'Service', render: (log) => log.service },
          { key: 'message', header: 'Message', render: (log) => <Code>{log.message}</Code> },
        ]}
      />
    </Card>
  );
};

const DatabaseTab = () => {
  const { data, isLoading, error, refetch } = useGetMonitoringDatabaseQuery();

  if (isLoading) return <Loader />;
  if (error || !data) return <ErrorState error={getErrorMessage(error)} onRetry={refetch} />;

  return (
    <Card>
      <Stack direction="row" gap="xs" align="center" wrap>
        <StatusBadge status={data.status} />
        <Span>
          {formatNumber(data.sizeMb)} MB · {data.connections} connections
        </Span>
      </Stack>
      <DataTable
        rows={data.tables}
        rowKey={(table) => table.name}
        columns={[
          { key: 'name', header: 'Table', render: (table) => <Code>{table.name}</Code> },
          { key: 'rows', header: 'Rows', render: (table) => formatNumber(table.rows) },
        ]}
      />
    </Card>
  );
};

const DevicesTab = () => {
  const list = usePagedQuery(useGetTelematicsDevicesQuery);

  return (
    <Card>
      <PagedTable
        list={list}
        rowKey={(device) => device.id}
        columns={[
          {
            key: 'car',
            header: 'Car',
            render: (device) => (
              <Link component={RouterLink} to={ROUTES.CAR(device.carId)}>
                {device.plateNumber}
              </Link>
            ),
          },
          { key: 'imei', header: 'IMEI', render: (device) => <Code>{device.imei}</Code> },
          { key: 'type', header: 'Device', render: (device) => device.deviceType },
          { key: 'firmware', header: 'Firmware', render: (device) => device.firmwareVersion },
          { key: 'signal', header: 'Signal', render: (device) => `${device.signalStrength} / ${MAX_SIGNAL}` },
          { key: 'ping', header: 'Last ping', render: (device) => formatDateTime(device.lastPingAt) },
          {
            key: 'online',
            header: 'Status',
            render: (device) => <StatusBadge status={device.online ? 'Online' : 'Offline'} />,
          },
        ]}
      />
    </Card>
  );
};

const TAB_CONTENT: Record<MonitoringTab, ComponentType> = {
  Overview: OverviewTab,
  Logs: LogsTab,
  Database: DatabaseTab,
  'GPS devices': DevicesTab,
};

const Monitoring = () => {
  const [tab, setTab] = useState<MonitoringTab>(MONITORING_TABS[0]);
  const Content = TAB_CONTENT[tab];

  return (
    <>
      <PageHeader title="System monitoring" />
      <Tabs tabs={MONITORING_TABS} active={tab} onChange={setTab} />
      <Content />
    </>
  );
};

export default Monitoring;
