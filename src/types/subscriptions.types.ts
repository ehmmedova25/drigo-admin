export interface SubscriptionPlan {
  id: number;
  modelId: number;
  modelName: string;
  monthlyPrice: number;
  currency: string;
  includedKm: number;
  minMonths: number;
  isActive: boolean;
  createdAt: string;
}
export type SubscriptionPlanPayload = Pick<SubscriptionPlan, 'monthlyPrice' | 'includedKm' | 'minMonths'>;

export interface ModelPlanSummary {
  modelId: number;
  modelName: string;
  hasPlan: boolean;
  monthlyPrice: number | null;
}

export type ModelWithPlan = ModelPlanSummary & { plan: SubscriptionPlan | null };

export type BookingStatus = 'Pending' | 'Active' | 'Assigned' | 'Completed' | 'Cancelled';

export interface SubscriptionBooking {
  id: number;
  userId: string;
  customerName: string;
  modelId: number;
  modelName: string;
  carId: number | null;
  status: BookingStatus;
  months: number;
  monthlyPrice: number;
  currency: string;
  startDate: string;
  createdAt: string;
}

export interface AssignableCar {
  id: number;
  plateNumber: string;
  brandName: string;
  modelName: string;
  isActive: boolean;
}
