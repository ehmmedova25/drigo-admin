export const RESERVATION_PIPELINE = ['Pending', 'Confirmed', 'DriverAssigned', 'PickingUp', 'InDelivery', 'Delivered', 'Completed'];
export const RESERVATION_STATUSES = [...RESERVATION_PIPELINE, 'Cancelled', 'Expired'];

export const FINISHED_STATUSES = ['Completed', 'Cancelled', 'Expired'];

export const RESERVATION_TABS = ['List', 'Active deliveries map'] as const;
export type ReservationTab = (typeof RESERVATION_TABS)[number];
