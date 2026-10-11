export interface ServiceFee {
  id: number;
  name: string;
  amount: number;
  currency: string;
  isPercentage: boolean;
  isActive: boolean;
  createdAt: string;
}
export type ServiceFeePayload = Pick<ServiceFee, 'name' | 'amount' | 'isPercentage' | 'isActive'>;

export interface TripFee {
  amount: number;
  currency: string;
  isActive: boolean;
  updatedAt: string;
}

export interface ExcessKmCharge {
  pricePerKm: number;
  currency: string;
  isActive: boolean;
  updatedAt: string;
}

export interface PenaltyConfig {
  id: number;
  name: string;
  amount: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
}
export type PenaltyConfigPayload = Pick<PenaltyConfig, 'name' | 'amount' | 'isActive'>;

export interface BlockedIp {
  entry: string;
  reason: string;
  blockedAt: string;
}

export interface BlockedCountry {
  countryCode: string;
  reason: string;
  blockedAt: string;
}

export interface SmsCountryMode {
  mode: string;
  countries: string[];
  updatedAt: string;
}
