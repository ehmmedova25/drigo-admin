import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link as RouterLink } from 'react-router-dom';
import { useGetReferralSettingsQuery, useGetTopReferrersQuery, useSaveReferralSettingsMutation } from '@/api/endpoints/promotionsApi';
import { DataTable } from '@/components/common/data-table';
import { ErrorState } from '@/components/common/error-state';
import { FormCheckboxField } from '@/components/common/form-checkbox-field';
import { FormTextField } from '@/components/common/form-text-field';
import { Loader } from '@/components/common/loader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Grid } from '@/components/ui/grid';
import { Link } from '@/components/ui/link';
import { Paragraph } from '@/components/ui/paragraph';
import { Stack } from '@/components/ui/stack';
import { ROUTES } from '@/constants/paths';
import { TOP_REFERRERS } from '@/constants/promotions';
import { useAction } from '@/hooks/useAction';
import type { ReferralSettings } from '@/types/promotions.types';
import { getErrorMessage } from '@/utils/apiError';
import { formatDateTime, formatMoney } from '@/utils/format';
import { toListState } from '@/utils/queryState';
import { referralSettingsSchema, type ReferralSettingsFormValues } from '../promotions.schema';

export interface ReferralSettingsFormProps {
  settings: ReferralSettings;
}

const ReferralSettingsForm = ({ settings }: ReferralSettingsFormProps) => {
  const [saveReferralSettings] = useSaveReferralSettingsMutation();
  const { run, busy } = useAction();

  const form = useForm({
    resolver: yupResolver(referralSettingsSchema),
    defaultValues: {
      referrerBonus: settings.referrerBonus,
      refereeBonus: settings.refereeBonus,
      minRentalsToQualify: settings.minRentalsToQualify,
      isActive: settings.isActive,
    },
  });

  const save = (values: ReferralSettingsFormValues) => run(() => saveReferralSettings(values).unwrap(), 'Referral settings saved');

  return (
    <Form onSubmit={form.handleSubmit(save)}>
      <Stack gap="sm">
        <FormTextField
          name="referrerBonus"
          control={form.control}
          label={`Bonus for the inviter (${settings.currency})`}
          type="number"
          min={0}
        />
        <FormTextField
          name="refereeBonus"
          control={form.control}
          label={`Bonus for the new customer (${settings.currency})`}
          type="number"
          min={0}
        />
        <FormTextField name="minRentalsToQualify" control={form.control} label="Rentals needed to qualify" type="number" min={0} />
        <FormCheckboxField name="isActive" control={form.control} label="Program active" />
        <Paragraph color="var(--text-muted)">Last updated {formatDateTime(settings.updatedAt)}</Paragraph>
        <Stack direction="row">
          <Button type="submit" variant="primary" disabled={busy}>
            {busy ? 'Saving...' : 'Save'}
          </Button>
        </Stack>
      </Stack>
    </Form>
  );
};

export const ReferralsTab = () => {
  const settings = useGetReferralSettingsQuery();
  const top = toListState(useGetTopReferrersQuery());

  return (
    <Grid>
      <Card title="Referral program">
        {settings.error ? (
          <ErrorState error={getErrorMessage(settings.error)} onRetry={settings.refetch} />
        ) : !settings.data ? (
          <Loader />
        ) : (
          <ReferralSettingsForm key={settings.data.updatedAt} settings={settings.data} />
        )}
      </Card>
      <Card title={`Top ${TOP_REFERRERS} referrers`}>
        <DataTable
          rows={top.rows}
          loading={top.loading}
          error={top.error}
          onRetry={top.reload}
          rowKey={(referrer) => referrer.userId}
          columns={[
            {
              key: 'name',
              header: 'Customer',
              render: (referrer) => (
                <Link component={RouterLink} to={ROUTES.CUSTOMER(referrer.userId)}>
                  {referrer.fullName}
                </Link>
              ),
            },
            { key: 'count', header: 'Referred', render: (referrer) => referrer.referredCount },
            { key: 'bonus', header: 'Bonus earned', render: (referrer) => formatMoney(referrer.bonusEarned) },
          ]}
        />
      </Card>
    </Grid>
  );
};
