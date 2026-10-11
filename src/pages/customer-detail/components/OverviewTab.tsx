import { useGetCustomerRevenueQuery } from '@/api/endpoints/customersApi';
import { FieldList } from '@/components/common/field-list';
import { Loader } from '@/components/common/loader';
import { StatusBadge } from '@/components/common/status-badge';
import { Card } from '@/components/ui/card';
import { Grid } from '@/components/ui/grid';
import { Heading } from '@/components/ui/heading';
import { Paragraph } from '@/components/ui/paragraph';
import { Span } from '@/components/ui/span';
import { Stack } from '@/components/ui/stack';
import type { CustomerDetail } from '@/types/customers.types';
import { formatDate, formatDateTime, formatMoney } from '@/utils/format';
import { DocumentCard } from './DocumentCard';
import styles from './OverviewTab.module.scss';

export interface OverviewTabProps {
  customer: CustomerDetail;
}

export const OverviewTab = ({ customer }: OverviewTabProps) => {
  const { data: revenue } = useGetCustomerRevenueQuery(customer.id);
  const face = customer.faceVerifyDetail;
  const referral = customer.referralDetail;

  return (
    <>
      <Grid>
        <Card title="Profile">
          <FieldList
            items={[
              ['Phone', customer.phoneNumber],
              ['Email', customer.email],
              ['Type', customer.userType],
              ['Birth date', formatDate(customer.birthDate)],
              ['Gender', customer.gender],
              ['Registered', formatDateTime(customer.createdAt)],
              ['Bonus balance', formatMoney(customer.bonusBalance)],
              [
                'Referral',
                referral && `${referral.code} · referred ${referral.referredCount} · earned ${formatMoney(referral.bonusEarned)}`,
              ],
            ]}
          />
        </Card>
        <Card title="Revenue">
          {revenue ? (
            <FieldList
              items={[
                ['Total revenue', formatMoney(revenue.totalRevenue)],
                ['Rentals', revenue.totalRentals],
                ['Average rental', formatMoney(revenue.averageRentalValue)],
              ]}
            />
          ) : (
            <Loader />
          )}
          <Heading as="h3" size="15px" lineHeight="22px" weight="500" className={styles.sectionTitle}>
            Face check
          </Heading>
          {face ? (
            <Stack direction="row" gap="sm" align="center">
              {face.selfieUrl && <img className={styles.avatar} src={face.selfieUrl} alt="selfie" loading="lazy" />}
              <Stack gap="2xs" align="start">
                <StatusBadge status={face.status} />
                <Span color="var(--text-muted)">Match score: {Math.round(face.matchScore * 100)}%</Span>
              </Stack>
            </Stack>
          ) : (
            <Paragraph color="var(--text-muted)">No selfie uploaded</Paragraph>
          )}
        </Card>
      </Grid>
      <Grid>
        <DocumentCard title="Passport" doc={customer.passportDetail} />
        <DocumentCard title="Driver licence" doc={customer.driverLicenseDetail} />
        <DocumentCard title="National ID" doc={customer.nationalIdentityDetail} />
      </Grid>
    </>
  );
};
