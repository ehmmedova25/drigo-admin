import type { CarReportStatus, CleaningStatus, InquiryStatus, ProblemStatus, ServiceStatus } from '@/types/operations.types';

export const OPERATIONS_TABS = ['Cleanings', 'Car reports', 'Problem reports', 'Services', 'Employees', 'Business inquiries', 'Exit surveys'] as const;
export type OperationsTab = (typeof OPERATIONS_TABS)[number];

export const CLEANING_STATUSES: CleaningStatus[] = ['Scheduled', 'InProgress', 'Completed', 'Cancelled'];
export const CANCELLABLE_CLEANING: CleaningStatus[] = ['Scheduled', 'InProgress'];

export const CAR_REPORT_DECISIONS: CarReportStatus[] = ['Reviewed', 'Rejected'];
export const PROBLEM_STATUSES: ProblemStatus[] = ['Open', 'InProgress', 'Resolved', 'Dismissed'];
export const SERVICE_STATUSES: ServiceStatus[] = ['Scheduled', 'InProgress', 'Completed'];
export const INQUIRY_STATUSES: InquiryStatus[] = ['New', 'Contacted', 'Qualified', 'Closed', 'Rejected'];
export const EMPLOYEE_ROLES = ['Field Agent', 'Cleaner', 'Mechanic', 'Delivery Driver'];

export const MAX_RATING = 5;
