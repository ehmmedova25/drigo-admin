export type CleaningStatus = 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled';

export interface Cleaning {
  id: number;
  carId: number;
  plateNumber: string;
  carName: string;
  type: 'Interior' | 'Exterior' | 'Full' | 'Express';
  status: CleaningStatus;
  scheduledAt: string;
  assignedTo: string | null;
  cost: number;
  currency: string;
}

export interface CleaningStats {
  total: number;
  byStatus: Partial<Record<CleaningStatus, number>>;
  totalCost: number;
  currency: string;
}

export interface Media {
  id: number;
  url: string;
  type: string;
}

export type CarReportStatus = 'Pending' | 'Reviewed' | 'Rejected';
export interface CarReport {
  id: number;
  carId: number;
  plateNumber: string;
  userId: string;
  userName: string;
  type: string;
  description: string;
  status: CarReportStatus;
  reviewNote: string | null;
  media: Media[];
  createdAt: string;
}

export type ProblemStatus = 'Open' | 'InProgress' | 'Resolved' | 'Dismissed';
export interface ProblemReport {
  id: number;
  carId: number;
  plateNumber: string;
  userId: string;
  userName: string;
  category: string;
  description: string;
  status: ProblemStatus;
  severity: 'Low' | 'Medium' | 'High';
  note: string | null;
  photos: string[];
  createdAt: string;
}

export type ServiceStatus = 'Scheduled' | 'InProgress' | 'Completed';
export interface CarService {
  id: number;
  carId: number;
  plateNumber: string;
  type: string;
  status: ServiceStatus;
  odometer: number;
  cost: number;
  currency: string;
  scheduledAt: string;
  completedAt: string | null;
}

export interface Employee {
  id: number;
  fullName: string;
  role: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt: string;
}
export type EmployeePayload = Pick<Employee, 'fullName' | 'role' | 'phoneNumber'>;

export type InquiryStatus = 'New' | 'Contacted' | 'Qualified' | 'Closed' | 'Rejected';

export interface BusinessInquiry {
  id: number;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  fleetSize: number;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface ExitSurvey {
  id: number;
  userId: string;
  rating: number;
  reason: string;
  comment: string | null;
  createdAt: string;
}
