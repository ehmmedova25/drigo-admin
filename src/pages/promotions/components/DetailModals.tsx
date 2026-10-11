import { useGetDiscountAnalyticsQuery, useGetDiscountUsageQuery, useGetStoryAnalyticsQuery } from '@/api/endpoints/promotionsApi';
import { DataTable } from '@/components/common/data-table';
import { ErrorState } from '@/components/common/error-state';
import { Loader } from '@/components/common/loader';
import { MetricCard } from '@/components/common/metric-card';
import { Grid } from '@/components/ui/grid';
import { Heading } from '@/components/ui/heading';
import { Modal } from '@/components/ui/modal';
import { Paragraph } from '@/components/ui/paragraph';
import { Span } from '@/components/ui/span';
import type { Discount, Story } from '@/types/promotions.types';
import { getErrorMessage } from '@/utils/apiError';
import { formatDateTime, formatMoney, formatNumber, formatPercent, orDash } from '@/utils/format';
import styles from './DetailModals.module.scss';

const PERCENT = 100;

export interface DiscountDetailsModalProps {
  discount: Discount;
  onClose: () => void;
}

export const DiscountDetailsModal = ({ discount, onClose }: DiscountDetailsModalProps) => {
  const analytics = useGetDiscountAnalyticsQuery(discount.id);
  const usage = useGetDiscountUsageQuery(discount.id);
  const error = analytics.error ?? usage.error;
  const retry = () => {
    analytics.refetch();
    usage.refetch();
  };

  return (
    <Modal title={`Discount ${discount.name}`} onClose={onClose} wide>
      {error ? (
        <ErrorState error={getErrorMessage(error)} onRetry={retry} />
      ) : !analytics.data || !usage.data ? (
        <Loader />
      ) : (
        <>
          <Grid minItemWidth="sm">
            <MetricCard label="Total uses" value={formatNumber(analytics.data.totalUses)} />
            <MetricCard label="Unique users" value={formatNumber(analytics.data.uniqueUsers)} />
            <MetricCard label="Total discounted" value={formatMoney(analytics.data.totalDiscounted, analytics.data.currency)} />
            <MetricCard label="Conversion" value={formatPercent(analytics.data.conversionRate * PERCENT)} />
          </Grid>
          <Heading as="h3" size="15px" lineHeight="22px" weight="500">
            Recent usage
          </Heading>
          <DataTable
            rows={usage.data}
            rowKey={(usage) => usage.id}
            emptyText="Not used yet"
            columns={[
              { key: 'user', header: 'Customer', render: (usage) => usage.userName },
              { key: 'amount', header: 'Amount', render: (usage) => formatNumber(usage.amount) },
              { key: 'at', header: 'Used at', render: (usage) => formatDateTime(usage.usedAt) },
            ]}
          />
        </>
      )}
    </Modal>
  );
};

export interface StoryAnalyticsModalProps {
  story: Story;
  onClose: () => void;
}

export const StoryAnalyticsModal = ({ story, onClose }: StoryAnalyticsModalProps) => {
  const { data, error, refetch } = useGetStoryAnalyticsQuery(story.id);
  const itemById = new Map(story.items.map((item) => [item.id, item]));

  return (
    <Modal title={`Story "${story.title}"`} onClose={onClose} wide>
      {error ? (
        <ErrorState error={getErrorMessage(error)} onRetry={refetch} />
      ) : !data ? (
        <Loader />
      ) : (
        <>
          <Paragraph>
            Total views:{' '}
            <Span weight="500" color="var(--text-primary)">
              {formatNumber(data.totalViews)}
            </Span>
          </Paragraph>
          <DataTable
            rows={data.items}
            rowKey={(slide) => slide.itemId}
            emptyText="This story has no slides"
            columns={[
              {
                key: 'media',
                header: 'Slide',
                render: (slide) => {
                  const item = itemById.get(slide.itemId);
                  return item ? <img className={styles.thumb} src={item.mediaUrl} alt={`Slide ${slide.itemId}`} /> : `#${slide.itemId}`;
                },
              },
              { key: 'type', header: 'Type', render: (slide) => orDash(itemById.get(slide.itemId)?.mediaType) },
              { key: 'views', header: 'Views', render: (slide) => formatNumber(slide.views) },
              { key: 'completion', header: 'Watched to end', render: (slide) => formatPercent(slide.completionRate) },
            ]}
          />
        </>
      )}
    </Modal>
  );
};
