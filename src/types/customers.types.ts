export type CustomerState = 'Deleted' | 'Blocked' | 'Verified' | 'Pending';

export interface CustomerListItem {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string | null;
  createdAt: string;
  userType: string;
  platform: string;
  isApproved: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
}

export interface CustomerDocument {
  status: string;
  uploadedAt: string | null;
  verifiedAt: string | null;
  frontUrl: string | null;
  backUrl: string | null;
  rejectionReason: string | null;
  ocr: { number?: string; expiryDate?: string; fullName?: string } | null;
}

export interface CustomerDetail extends Omit<CustomerListItem, 'platform'> {
  birthDate: string | null;
  gender: string | null;
  bonusBalance: number;
  deletedAt: string | null;
  passportDetail: CustomerDocument | null;
  driverLicenseDetail: CustomerDocument | null;
  nationalIdentityDetail: CustomerDocument | null;
  faceVerifyDetail: { status: string; matchScore: number; selfieUrl: string | null } | null;
  referralDetail: { code: string; referredCount: number; bonusEarned: number } | null;
}

export interface CustomerRevenue {
  totalRevenue: number;
  totalRentals: number;
  averageRentalValue: number;
}

export interface RejectionReason {
  id: number;
  documentType: string;
  reason: string;
}

export interface Device {
  deviceId: string;
  model: string;
  platform: string;
  appVersion: string;
  lastSeenAt: string;
  isCurrent: boolean;
}

export interface LoginRecord {
  id: number;
  ip: string;
  device: string;
  platform: string;
  city: string;
  at: string;
  success: boolean;
}
