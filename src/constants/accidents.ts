import type { AccidentStatus, FaultParty } from '@/types/accidents.types';

export const ACCIDENT_STATUSES: AccidentStatus[] = ['Reported', 'UnderReview', 'Resolved', 'Closed'];
export const FAULT_PARTIES: FaultParty[] = ['Customer', 'ThirdParty', 'Unknown'];
