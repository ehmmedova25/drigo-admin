import { useEffect, useRef } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  useAssignTicketToMeMutation,
  useGetReplyTemplatesQuery,
  useGetTicketMessagesQuery,
  useGetTicketQuery,
  useGetTicketSuggestionsQuery,
  useMarkTicketReadMutation,
  useReplyToTicketMutation,
  useSetTicketMutedMutation,
  useSetTicketStatusMutation,
} from '@/api/endpoints/supportApi';
import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Paragraph } from '@/components/ui/paragraph';
import { Select } from '@/components/ui/select';
import { Stack } from '@/components/ui/stack';
import { Textarea } from '@/components/ui/textarea';
import { TIMING } from '@/constants/config';
import { SUGGESTION_PREVIEW_LENGTH, TICKET_STATUSES } from '@/constants/support';
import { useAction } from '@/hooks/useAction';
import type { TicketStatus } from '@/types/support.types';
import { getErrorMessage } from '@/utils/apiError';
import { cx } from '@/utils/cx';
import { formatDateTime } from '@/utils/format';
import { replySchema, type ReplyFormValues } from '../support.schema';
import styles from './TicketChat.module.scss';

export interface TicketChatProps {
  ticketId: number;
}

export const TicketChat = ({ ticketId }: TicketChatProps) => {
  const ticket = useGetTicketQuery(ticketId);
  const messages = useGetTicketMessagesQuery(ticketId, { pollingInterval: TIMING.chatPollMs });
  const templates = useGetReplyTemplatesQuery();
  const suggestions = useGetTicketSuggestionsQuery(ticketId);
  const [markTicketRead] = useMarkTicketReadMutation();
  const [replyToTicket] = useReplyToTicketMutation();
  const [setTicketStatus] = useSetTicketStatusMutation();
  const [assignTicketToMe] = useAssignTicketToMeMutation();
  const [setTicketMuted] = useSetTicketMutedMutation();
  const chatRef = useRef<HTMLDivElement>(null);
  const { run, busy } = useAction();

  const form = useForm({ resolver: yupResolver(replySchema), defaultValues: { message: '' } });
  const draft = useWatch({ control: form.control, name: 'message' });

  useEffect(() => {
    markTicketRead(ticketId);
  }, [ticketId, markTicketRead]);

  const count = messages.data?.length ?? 0;
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight });
  }, [count]);

  if (ticket.isLoading) return <Loader />;
  if (ticket.error || !ticket.data) return <ErrorState error={getErrorMessage(ticket.error)} onRetry={ticket.refetch} />;
  const t = ticket.data;

  const send = async (values: ReplyFormValues) => {
    if (await run(() => replyToTicket({ id: ticketId, message: values.message }).unwrap(), 'Message sent')) form.reset();
  };
  const insertDraft = (text: string) => form.setValue('message', text);

  return (
    <Card
      title={`#${t.id} · ${t.memberName}`}
      subtitle={t.reasonName}
      action={
        <Stack direction="row" gap="xs" align="center" wrap>
          <Select
            value={t.status}
            disabled={busy}
            options={TICKET_STATUSES}
            onChange={(status) => run(() => setTicketStatus({ id: ticketId, status: status as TicketStatus }).unwrap(), 'Status updated')}
          />
          <Button size="sm" disabled={busy} onClick={() => run(() => assignTicketToMe(ticketId).unwrap(), 'Assigned to you')}>
            Assign to me
          </Button>
          <Button
            size="sm"
            disabled={busy}
            onClick={() => run(() => setTicketMuted({ id: ticketId, isMuted: !t.isMuted }).unwrap(), t.isMuted ? 'Unmuted' : 'Muted')}
          >
            {t.isMuted ? 'Unmute' : 'Mute'}
          </Button>
        </Stack>
      }
    >
      <Paragraph color="var(--text-muted)">Operator: {t.operatorName ?? 'unassigned'}</Paragraph>

      <div className={styles.chat} ref={chatRef}>
        {!messages.data && <Loader />}
        {messages.data?.map((m) => (
          <div key={m.id} className={cx(styles.message, m.isOperator && styles.operator)}>
            {m.message}
            {m.mediaUrl && <img src={m.mediaUrl} alt="attachment" className={styles.media} loading="lazy" />}
            <div className={styles.meta}>
              {m.isBot ? 'Bot' : m.createdBy} · {formatDateTime(m.createdAt)}
            </div>
          </div>
        ))}
      </div>

      <Stack direction="row" gap="xs" align="center" wrap>
        <Select
          value=""
          onChange={insertDraft}
          placeholder="Insert template…"
          options={(templates.data ?? []).map((tp) => ({ value: tp.body, label: tp.title }))}
        />
        {suggestions.data?.map((s) => (
          <Button key={s.id} size="sm" onClick={() => insertDraft(s.text)} title={s.text}>
            {s.text.slice(0, SUGGESTION_PREVIEW_LENGTH)}…
          </Button>
        ))}
      </Stack>
      <Form onSubmit={form.handleSubmit(send)}>
        <Stack direction="row" gap="xs" align="center">
          <Controller
            name="message"
            control={form.control}
            render={({ field }) => (
              <Textarea
                className={styles.reply}
                rows={2}
                placeholder="Type a reply"
                name={field.name}
                ref={field.ref}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
          <Button type="submit" variant="primary" disabled={busy || !draft.trim()}>
            Send
          </Button>
        </Stack>
      </Form>
    </Card>
  );
};
