import { useState, type ComponentType } from 'react';
import {
  useBlockCountryMutation,
  useBlockIpMutation,
  useGetBlockedCountriesQuery,
  useGetBlockedIpsQuery,
  useGetExcessKmChargeQuery,
  useGetPenaltyConfigsQuery,
  useGetServiceFeesQuery,
  useGetSmsCountryModeQuery,
  useGetTripFeeQuery,
  useSaveExcessKmChargeMutation,
  useSaveTripFeeMutation,
  useUnblockCountryMutation,
  useUnblockIpMutation,
} from '@/api/endpoints/settingsApi';
import { CrudTable } from '@/components/common/crud-table';
import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { PageHeader } from '@/components/common/page-header';
import { StatusBadge } from '@/components/common/status-badge';
import { Grid } from '@/components/ui/grid';
import { Tabs } from '@/components/ui/tabs';
import { SETTINGS_TABS, type SettingsTab } from '@/constants/settings';
import { getErrorMessage } from '@/utils/apiError';
import { formatDate, formatMoney } from '@/utils/format';
import { toListState } from '@/utils/queryState';
import { activeStatus } from '@/utils/status';
import { BlockListCard } from './components/BlockListCard';
import { PenaltyFormModal, ServiceFeeFormModal } from './components/SettingsFormModals';
import { SingleValueCard } from './components/SingleValueCard';
import { SmsModeCard } from './components/SmsModeCard';
import { blockCountrySchema, blockIpSchema } from './settings.schema';

const FeesTab = () => {
  const serviceFees = toListState(useGetServiceFeesQuery());
  const tripFee = useGetTripFeeQuery();
  const excessKm = useGetExcessKmChargeQuery();
  const [saveTripFee] = useSaveTripFeeMutation();
  const [saveExcessKmCharge] = useSaveExcessKmChargeMutation();
  const singleError = tripFee.error ?? excessKm.error;

  const retrySingle = () => {
    tripFee.refetch();
    excessKm.refetch();
  };

  return (
    <>
      <CrudTable
        list={serviceFees}
        entity="service fee"
        rowKey={(fee) => fee.id}
        nameOf={(fee) => fee.name}
        columns={[
          { key: 'name', header: 'Name', render: (fee) => fee.name },
          {
            key: 'amount',
            header: 'Amount',
            render: (fee) => (fee.isPercentage ? `${fee.amount}%` : formatMoney(fee.amount, fee.currency)),
          },
          { key: 'status', header: 'Status', render: (fee) => <StatusBadge status={activeStatus(fee.isActive)} /> },
          { key: 'created', header: 'Created', render: (fee) => formatDate(fee.createdAt) },
        ]}
        renderForm={(props) => <ServiceFeeFormModal {...props} />}
      />
      {singleError ? (
        <ErrorState error={getErrorMessage(singleError)} onRetry={retrySingle} />
      ) : !tripFee.data || !excessKm.data ? (
        <Loader />
      ) : (
        <Grid>
          <SingleValueCard
            key={`trip-${tripFee.data.updatedAt}`}
            title="Trip fee"
            label={`Per trip (${tripFee.data.currency})`}
            value={tripFee.data.amount}
            isActive={tripFee.data.isActive}
            updatedAt={tripFee.data.updatedAt}
            onSave={(amount, isActive) => saveTripFee({ amount, isActive }).unwrap()}
          />
          <SingleValueCard
            key={`km-${excessKm.data.updatedAt}`}
            title="Excess km charge"
            label={`Per km over the package (${excessKm.data.currency})`}
            value={excessKm.data.pricePerKm}
            isActive={excessKm.data.isActive}
            updatedAt={excessKm.data.updatedAt}
            onSave={(pricePerKm, isActive) => saveExcessKmCharge({ pricePerKm, isActive }).unwrap()}
          />
        </Grid>
      )}
    </>
  );
};

const PenaltiesTab = () => {
  const list = toListState(useGetPenaltyConfigsQuery());

  return (
    <CrudTable
      list={list}
      entity="penalty"
      emptyText="No penalties"
      rowKey={(penalty) => penalty.id}
      nameOf={(penalty) => penalty.name}
      columns={[
        { key: 'name', header: 'Penalty', render: (penalty) => penalty.name },
        { key: 'amount', header: 'Amount', render: (penalty) => formatMoney(penalty.amount, penalty.currency) },
        { key: 'status', header: 'Status', render: (penalty) => <StatusBadge status={activeStatus(penalty.isActive)} /> },
      ]}
      renderForm={(props) => <PenaltyFormModal {...props} />}
    />
  );
};

const SecurityTab = () => {
  const ipsQuery = useGetBlockedIpsQuery();
  const countriesQuery = useGetBlockedCountriesQuery();
  const sms = useGetSmsCountryModeQuery();
  const [blockIp] = useBlockIpMutation();
  const [unblockIp] = useUnblockIpMutation();
  const [blockCountry] = useBlockCountryMutation();
  const [unblockCountry] = useUnblockCountryMutation();

  const ips = toListState({
    ...ipsQuery,
    data: ipsQuery.data?.map((row) => ({ value: row.entry, reason: row.reason, blockedAt: row.blockedAt })),
  });
  const countries = toListState({
    ...countriesQuery,
    data: countriesQuery.data?.map((row) => ({ value: row.countryCode, reason: row.reason, blockedAt: row.blockedAt })),
  });

  return (
    <Grid>
      <BlockListCard
        title="Blocked IP addresses"
        label="IP address"
        placeholder="e.g. 203.0.113.7"
        list={ips}
        schema={blockIpSchema}
        onBlock={(entry, reason) => blockIp({ entry, reason }).unwrap()}
        onUnblock={(entry) => unblockIp(entry).unwrap()}
      />
      <BlockListCard
        title="Blocked countries"
        label="Country code"
        placeholder="Country code, e.g. XX"
        list={countries}
        schema={blockCountrySchema}
        onBlock={(countryCode, reason) => blockCountry({ countryCode, reason }).unwrap()}
        onUnblock={(code) => unblockCountry(code).unwrap()}
      />
      {sms.error ? (
        <ErrorState error={getErrorMessage(sms.error)} onRetry={sms.refetch} />
      ) : !sms.data ? (
        <Loader />
      ) : (
        <SmsModeCard key={sms.data.updatedAt} settings={sms.data} />
      )}
    </Grid>
  );
};

const TAB_CONTENT: Record<SettingsTab, ComponentType> = {
  Fees: FeesTab,
  Penalties: PenaltiesTab,
  Security: SecurityTab,
};

const Settings = () => {
  const [tab, setTab] = useState<SettingsTab>(SETTINGS_TABS[0]);
  const Content = TAB_CONTENT[tab];

  return (
    <>
      <PageHeader title="Settings" />
      <Tabs tabs={SETTINGS_TABS} active={tab} onChange={setTab} />
      <Content />
    </>
  );
};

export default Settings;
