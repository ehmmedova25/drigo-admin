export interface ReservationListItem {
  id: number;
  customerName: string;
  carName: string;
  plateNumber: string;
  status: string;
  scheduledDeliveryDate: string | null;
  isImmediate: boolean;
  totalPrice: number;
  driverName: string | null;
}

export interface ReservationDetail extends ReservationListItem {
  customerPhone: string;
  reservationDate: string;
  user: { id: string; fullName: string } | null;
  car: { id: number } | null;
  deliveryAddress: { address: string; latitude: number | null; longitude: number | null };
  driver: { id: number; fullName: string; phoneNumber: string; currentLat: number; currentLng: number } | null;
}

export interface ActiveDelivery {
  id: number;
  customerName: string;
  status: string;
  deliveryAddress: string;
  deliveryLat: number;
  deliveryLng: number;
  driverName: string | null;
  driverLat: number | null;
  driverLng: number | null;
}
