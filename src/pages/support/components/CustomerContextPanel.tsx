import { Link as RouterLink } from 'react-router-dom';
import { useGetTicketContextQuery } from '@/api/endpoints/supportApi';
import { FieldList } from '@/components/common/field-list';
import { Loader } from '@/components/common/loader';
import { Alert } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Link } from '@/components/ui/link';
import { ROUTES } from '@/constants/paths';
import { formatMoney, orDash } from '@/utils/format';

export interface CustomerContextPanelProps {
  ticketId: number;
}

export const CustomerContextPanel = ({ ticketId }: CustomerContextPanelProps) => {
  const { data: ctx } = useGetTicketContextQuery(ticketId);
  if (!ctx) return <Loader />;
  const docs = ctx.verification;

  return (
    <Card title="Customer context">
      {ctx.flags.hasDebt && (
        <Alert variant="warning">
          Unpaid debt: {formatMoney(ctx.outstandingDebt.total, ctx.outstandingDebt.currency)} ({ctx.outstandingDebt.count})
        </Alert>
      )}
      {ctx.flags.isBlocked && <Alert variant="error">Customer is blocked</Alert>}
      {ctx.flags.unverified && <Alert variant="info">Customer is not verified</Alert>}
      <FieldList
        items={[
          [
            'Customer',
            ctx.member && (
              <Link key="customer" component={RouterLink} to={ROUTES.CUSTOMER(ctx.member.id)}>
                {ctx.member.fullName}
              </Link>
            ),
          ],
          ['Phone', ctx.member?.phoneNumber],
          [
            'Documents',
            docs && `Passport ${orDash(docs.passport)} · Licence ${orDash(docs.driverLicense)} · Face ${orDash(docs.face)}`,
          ],
          [
            'Active rental',
            ctx.activeRental ? (
              <Link key="rental" component={RouterLink} to={ROUTES.RENTAL(ctx.activeRental.id)}>
                #{ctx.activeRental.id} · {ctx.activeRental.car}
              </Link>
            ) : (
              'None'
            ),
          ],
          ['Bonus', formatMoney(ctx.member?.bonusBalance)],
        ]}
      />
    </Card>
  );
};
