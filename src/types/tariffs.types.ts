export type TimeUnit = 'Hour' | 'Day' | 'Week' | 'Month';

export interface Country {
  id: number;
  name: string;
  code: string;
}

export interface TariffPackage {
  id: number;
  unitCount: number;
  timeUnit: TimeUnit;
  price: number;
  currency: string;
  isActive: boolean;
  countries: Country[];
  createdAt: string;
  updatedAt: string;
}
export type TariffPackagePayload = Pick<TariffPackage, 'unitCount' | 'timeUnit' | 'price' | 'isActive'>;

export interface TariffPlan {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}
export type TariffPlanPayload = Pick<TariffPlan, 'name' | 'description' | 'isActive'>;

export interface TemplateTariff {
  id: number;
  packageName: string;
  price: number;
}

export interface TariffTemplate {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  tariffs: TemplateTariff[];
  createdAt: string;
}
export type TariffTemplatePayload = Pick<TariffTemplate, 'name' | 'description'>;

export interface TariffDistance {
  id: number;
  includedKm: number;
  extraKmPrice: number;
  currency: string;
}

export interface Insurance {
  id: number;
  name: string;
  description: string;
  dailyPrice: number;
  currency: string;
  deductible: number;
  isActive: boolean;
}

export interface OverageCharge {
  id: number;
  name: string;
  pricePerKm: number;
  currency: string;
  thresholdKm: number;
  isActive: boolean;
  createdAt: string;
}
export type OverageChargePayload = Pick<OverageCharge, 'name' | 'pricePerKm' | 'thresholdKm' | 'isActive'>;
