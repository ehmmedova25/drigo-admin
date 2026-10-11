import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useReviewCarReportMutation, useSetProblemReportNoteMutation } from '@/api/endpoints/operationsApi';
import { FormSelectField } from '@/components/common/form-select-field';
import { FormTextareaField } from '@/components/common/form-textarea-field';
import { FormModal } from '@/components/common/form-modal';
import { Paragraph } from '@/components/ui/paragraph';
import { Span } from '@/components/ui/span';
import { CAR_REPORT_DECISIONS } from '@/constants/operations';
import type { CarReport, ProblemReport } from '@/types/operations.types';
import { carReportReviewSchema, problemNoteSchema, type CarReportReviewFormValues, type ProblemNoteFormValues } from '../operations.schema';
import styles from './ReviewModals.module.scss';

export interface ReviewModalProps<T> {
  item: T;
  onClose: () => void;
}

export const CarReportReviewModal = ({ item: report, onClose }: ReviewModalProps<CarReport>) => {
  const [reviewCarReport] = useReviewCarReportMutation();

  const form = useForm({
    resolver: yupResolver(carReportReviewSchema),
    defaultValues: { status: CAR_REPORT_DECISIONS[0], note: report.reviewNote ?? '' },
  });
  const status = useWatch({ control: form.control, name: 'status' });

  const save = (values: CarReportReviewFormValues) =>
    reviewCarReport({ id: report.id, status: values.status, note: values.note }).unwrap();

  return (
    <FormModal
      title={`Car report #${report.id}`}
      submitText="Save decision"
      successMessage={`Report ${status.toLowerCase()}`}
      form={form}
      onSubmit={save}
      onClose={onClose}
    >
      <Paragraph>
        <Span weight="500" color="var(--text-primary)">
          {report.type}
        </Span>{' '}
        · {report.plateNumber} · {report.userName}
      </Paragraph>
      <Paragraph>{report.description}</Paragraph>
      <div className={styles.photos}>
        {report.media.map((media) => (
          <img key={media.id} className={styles.photo} src={media.url} alt={`Report photo ${media.id}`} />
        ))}
      </div>
      <FormSelectField name="status" control={form.control} label="Decision" options={CAR_REPORT_DECISIONS} />
      <FormTextareaField name="note" control={form.control} label="Note" />
    </FormModal>
  );
};

export const ProblemNoteModal = ({ item: report, onClose }: ReviewModalProps<ProblemReport>) => {
  const [setProblemReportNote] = useSetProblemReportNoteMutation();

  const form = useForm({
    resolver: yupResolver(problemNoteSchema),
    defaultValues: { note: report.note ?? '' },
  });

  const save = (values: ProblemNoteFormValues) => setProblemReportNote({ id: report.id, note: values.note }).unwrap();

  return (
    <FormModal
      title={`Note for problem #${report.id}`}
      submitText="Save"
      successMessage="Note saved"
      form={form}
      onSubmit={save}
      onClose={onClose}
    >
      <Paragraph>{report.description}</Paragraph>
      <FormTextareaField name="note" control={form.control} label="Internal note" />
    </FormModal>
  );
};
