import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  useGetCarReportsQuery,
  useGetProblemReportsQuery,
  useSetProblemReportStatusMutation,
} from '@/api/endpoints/operationsApi';
import { CrudTable } from '@/components/common/crud-table';
import { StatusBadge } from '@/components/common/status-badge';
import { StatusChangeModal } from '@/components/common/status-change-modal';
import { Link } from '@/components/ui/link';
import { Select } from '@/components/ui/select';
import { COMMON_MESSAGES } from '@/constants/messages';
import { PROBLEM_STATUSES } from '@/constants/operations';
import { ROUTES } from '@/constants/paths';
import { usePagedQuery } from '@/hooks/usePagedQuery';
import type { CarReport, ProblemReport } from '@/types/operations.types';
import { formatDateTime, orDash } from '@/utils/format';
import { CarReportReviewModal, ProblemNoteModal } from './ReviewModals';
import styles from './ReportsTabs.module.scss';

type ProblemModal = { kind: 'status' | 'note'; report: ProblemReport } | null;

export const CarReportsTab = () => {
  const list = usePagedQuery(useGetCarReportsQuery);
  const [reviewing, setReviewing] = useState<CarReport | null>(null);

  return (
    <>
      <CrudTable
        list={list}
        entity="car report"
        rowKey={(report) => report.id}
        nameOf={(report) => `#${report.id}`}
        onRowClick={setReviewing}
        columns={[
          { key: 'date', header: 'Date', render: (report) => formatDateTime(report.createdAt) },
          {
            key: 'car',
            header: 'Car',
            render: (report) => (
              <Link component={RouterLink} to={ROUTES.CAR(report.carId)}>
                {report.plateNumber}
              </Link>
            ),
          },
          {
            key: 'customer',
            header: 'Customer',
            render: (report) => (
              <Link component={RouterLink} to={ROUTES.CUSTOMER(report.userId)}>
                {report.userName}
              </Link>
            ),
          },
          { key: 'type', header: 'Type', render: (report) => report.type },
          { key: 'photos', header: 'Photos', render: (report) => report.media.length },
          { key: 'note', header: 'Review note', render: (report) => orDash(report.reviewNote) },
          { key: 'status', header: 'Status', render: (report) => <StatusBadge status={report.status} /> },
        ]}
        rowActions={(report) => [{ label: 'Review', onClick: () => setReviewing(report) }]}
      />
      {reviewing && <CarReportReviewModal item={reviewing} onClose={() => setReviewing(null)} />}
    </>
  );
};

export const ProblemReportsTab = () => {
  const [status, setStatus] = useState('');
  const list = usePagedQuery(useGetProblemReportsQuery, { status });
  const [setProblemReportStatus] = useSetProblemReportStatusMutation();
  const [modal, setModal] = useState<ProblemModal>(null);
  const close = () => setModal(null);

  return (
    <>
      <CrudTable
        list={list}
        entity="problem report"
        rowKey={(report) => report.id}
        nameOf={(report) => `#${report.id}`}
        toolbar={<Select value={status} onChange={setStatus} options={PROBLEM_STATUSES} placeholder={COMMON_MESSAGES.ALL_STATUSES} />}
        columns={[
          { key: 'date', header: 'Date', render: (report) => formatDateTime(report.createdAt) },
          {
            key: 'car',
            header: 'Car',
            render: (report) => (
              <Link component={RouterLink} to={ROUTES.CAR(report.carId)}>
                {report.plateNumber}
              </Link>
            ),
          },
          {
            key: 'customer',
            header: 'Reported by',
            render: (report) => (
              <Link component={RouterLink} to={ROUTES.CUSTOMER(report.userId)}>
                {report.userName}
              </Link>
            ),
          },
          { key: 'category', header: 'Category', render: (report) => report.category },
          { key: 'severity', header: 'Severity', render: (report) => <StatusBadge status={report.severity} /> },
          {
            key: 'description',
            header: 'Description',
            render: (report) => <span className={styles.ellipsis}>{report.description}</span>,
          },
          { key: 'note', header: 'Note', render: (report) => orDash(report.note) },
          { key: 'status', header: 'Status', render: (report) => <StatusBadge status={report.status} /> },
        ]}
        rowActions={(report) => [
          { label: 'Status', onClick: () => setModal({ kind: 'status', report }) },
          { label: 'Note', onClick: () => setModal({ kind: 'note', report }) },
        ]}
      />
      {modal?.kind === 'status' && (
        <StatusChangeModal
          title={`Problem #${modal.report.id}`}
          current={modal.report.status}
          options={PROBLEM_STATUSES}
          onSubmit={(nextStatus) => setProblemReportStatus({ id: modal.report.id, status: nextStatus }).unwrap()}
          onClose={close}
        />
      )}
      {modal?.kind === 'note' && <ProblemNoteModal item={modal.report} onClose={close} />}
    </>
  );
};
