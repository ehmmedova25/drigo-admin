export type AccidentStatus = 'Reported' | 'UnderReview' | 'Resolved' | 'Closed';
export type FaultParty = 'Customer' | 'ThirdParty' | 'Unknown';

export interface Accident {
  id: number;
  rentalId: number | null;
  carId: number | null;
  faultParty: FaultParty;
  status: AccidentStatus;
  description: string;
  estimatedCost: number;
  currency: string;
  location: string;
  accidentDate: string;
}

export type AccidentPayload = Pick<Accident, 'rentalId' | 'carId' | 'faultParty' | 'status' | 'description' | 'estimatedCost' | 'location'>;
