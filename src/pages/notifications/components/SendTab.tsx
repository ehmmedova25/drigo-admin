import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  usePreviewNotificationAudienceQuery,
  useSendBroadcastNotificationMutation,
  useSendMissingDocumentReminderMutation,
  useSendVerificationReminderMutation,
} from '@/api/endpoints/notificationsApi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Grid } from '@/components/ui/grid';
import { Paragraph } from '@/components/ui/paragraph';
import { Span } from '@/components/ui/span';
import { Stack } from '@/components/ui/stack';
import { EMPTY_MESSAGE } from '@/constants/notifications';
import { useAction } from '@/hooks/useAction';
import type { SendResult } from '@/types/notifications.types';
import { formatNumber } from '@/utils/format';
import { broadcastSchema, type BroadcastFormValues } from '../notifications.schema';
import { MessageFields } from './MessageFields';

const sentTo = (result: SendResult) => `Sent to ${formatNumber(result.recipientCount)} customers`;

export const SendTab = () => {
  const form = useForm({ resolver: yupResolver(broadcastSchema), defaultValues: EMPTY_MESSAGE });
  const targetAudience = useWatch({ control: form.control, name: 'targetAudience' });
  const { currentData: reach } = usePreviewNotificationAudienceQuery(targetAudience);
  const [sendBroadcast] = useSendBroadcastNotificationMutation();
  const [sendVerificationReminder] = useSendVerificationReminderMutation();
  const [sendMissingDocumentReminder] = useSendMissingDocumentReminderMutation();
  const { run, busy } = useAction();

  const send = async (values: BroadcastFormValues) => {
    if (await run(() => sendBroadcast(values).unwrap(), sentTo)) form.reset(EMPTY_MESSAGE);
  };

  return (
    <Grid align="start">
      <Card title="Broadcast push notification">
        <Form onSubmit={form.handleSubmit(send)}>
          <MessageFields control={form.control} />
          <Paragraph color="var(--text-muted)">
            Will reach about{' '}
            <Span weight="500" color="var(--text-primary)">
              {reach ? formatNumber(reach.estimatedRecipients) : '…'}
            </Span>{' '}
            customers.
          </Paragraph>
          <Stack direction="row">
            <Button type="submit" variant="primary" disabled={busy}>
              Send now
            </Button>
          </Stack>
        </Form>
      </Card>
      <Card title="Reminders" subtitle="Ready-made messages the app sends to customers who still need to act.">
        <Stack direction="row" gap="xs" align="center" wrap>
          <Button disabled={busy} onClick={() => run(() => sendVerificationReminder().unwrap(), sentTo)}>
            Remind unverified customers
          </Button>
          <Button disabled={busy} onClick={() => run(() => sendMissingDocumentReminder().unwrap(), sentTo)}>
            Ask for rejected documents
          </Button>
        </Stack>
      </Card>
    </Grid>
  );
};
