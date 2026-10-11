import { Badge } from '@/components/ui/badge';
import type { Tone } from '@/types/style.types';

const TONES: Record<Exclude<Tone, 'neutral'>, readonly string[]> = {
  success: ['Active', 'Completed', 'Succeeded', 'Verified', 'Paid', 'Delivered', 'Online', 'Available', 'Resolved', 'Sent', 'Reviewed', 'Qualified', 'Success', 'healthy', 'running'],
  info: ['Started', 'Confirmed', 'DriverAssigned', 'PickingUp', 'InDelivery', 'Billed', 'Rented', 'Busy', 'Open', 'InProgress', 'Sending', 'Assigned', 'New', 'Contacted', 'Planned'],
  warning: ['Pending', 'PaymentPending', 'Review', 'UnderReview', 'Reported', 'Unpaid', 'Scheduled', 'Paused', 'Partial', 'WARN', 'Medium'],
  danger: ['Cancelled', 'Failed', 'Accident', 'Blocked', 'Rejected', 'Expired', 'Inactive', 'Dismissed', 'Offline', 'Deleted', 'Closed', 'Archived', 'ERROR', 'High'],
};

const toneOf = (status: string): Tone =>
  (Object.keys(TONES) as (keyof typeof TONES)[]).find((tone) => TONES[tone].includes(status)) ?? 'neutral';

export const StatusBadge = ({ status }: { status: string | null | undefined }) => {
  if (!status) return <Badge>—</Badge>;
  return <Badge tone={toneOf(status)}>{status}</Badge>;
};
