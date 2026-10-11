import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSaveSmsCountriesMutation } from '@/api/endpoints/settingsApi';
import { FormTextField } from '@/components/common/form-text-field';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Paragraph } from '@/components/ui/paragraph';
import { Span } from '@/components/ui/span';
import { Stack } from '@/components/ui/stack';
import { COUNTRY_CODE_LENGTH } from '@/constants/settings';
import { useAction } from '@/hooks/useAction';
import type { SmsCountryMode } from '@/types/settings.types';
import { formatDateTime } from '@/utils/format';
import { smsCountriesSchema, type SmsCountriesFormValues } from '../settings.schema';

export interface SmsModeCardProps {
  settings: SmsCountryMode;
}

const toPayload = (values: SmsCountriesFormValues) =>
  values.countries
    .split(',')
    .map((code) => code.trim().toUpperCase())
    .filter((code) => code.length === COUNTRY_CODE_LENGTH);

export const SmsModeCard = ({ settings }: SmsModeCardProps) => {
  const [saveSmsCountries] = useSaveSmsCountriesMutation();
  const { run, busy } = useAction();
  const form = useForm({
    resolver: yupResolver(smsCountriesSchema),
    defaultValues: { countries: settings.countries.join(', ') },
  });

  const submit = (values: SmsCountriesFormValues) =>
    run(() => saveSmsCountries(toPayload(values)).unwrap(), 'SMS countries saved');

  return (
    <Card title="SMS (OTP) countries">
      <Form onSubmit={form.handleSubmit(submit)}>
        <Paragraph>
          Mode:{' '}
          <Span weight="500" color="var(--text-primary)">
            {settings.mode}
          </Span>
        </Paragraph>
        <FormTextField name="countries" control={form.control} label="Country codes, comma separated" placeholder="AE, AZ, TR" />
        <Paragraph color="var(--text-muted)">Last changed {formatDateTime(settings.updatedAt)}</Paragraph>
        <Stack direction="row">
          <Button type="submit" variant="primary" disabled={busy}>
            Save
          </Button>
        </Stack>
      </Form>
    </Card>
  );
};
