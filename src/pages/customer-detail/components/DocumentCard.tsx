import { FieldList } from '@/components/common/field-list';
import { StatusBadge } from '@/components/common/status-badge';
import { Card } from '@/components/ui/card';
import { Paragraph } from '@/components/ui/paragraph';
import type { CustomerDocument } from '@/types/customers.types';
import { formatDate, formatDateTime } from '@/utils/format';
import styles from './DocumentCard.module.scss';

export interface DocumentCardProps {
  title: string;
  doc: CustomerDocument | null;
}

export const DocumentCard = ({ title, doc }: DocumentCardProps) => {
  return (
    <Card title={title} action={doc && <StatusBadge status={doc.status} />}>
      {!doc ? (
        <Paragraph color="var(--text-muted)">Not uploaded</Paragraph>
      ) : (
        <>
          <FieldList
            items={[
              ['Number', doc.ocr?.number],
              ['Name on doc', doc.ocr?.fullName],
              ['Expiry', formatDate(doc.ocr?.expiryDate)],
              ['Uploaded', formatDateTime(doc.uploadedAt)],
              ['Verified', formatDateTime(doc.verifiedAt)],
              ['Rejection', doc.rejectionReason],
            ]}
          />
          <div className={styles.photos}>
            {doc.frontUrl && <img className={styles.photo} src={doc.frontUrl} alt={`${title} front`} loading="lazy" />}
            {doc.backUrl && <img className={styles.photo} src={doc.backUrl} alt={`${title} back`} loading="lazy" />}
          </div>
        </>
      )}
    </Card>
  );
};
