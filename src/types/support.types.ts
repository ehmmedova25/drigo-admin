export type TicketStatus = 'Open' | 'Pending' | 'Resolved' | 'Closed';

export interface TicketDetail {
  id: number;
  memberName: string;
  reasonName: string;
  status: TicketStatus;
  operatorName: string | null;
  isMuted: boolean;
}

export interface Ticket extends TicketDetail {
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

export interface Message {
  id: number;
  message: string;
  mediaUrl: string | null;
  createdAt: string;
  createdBy: string;
  isOperator: boolean;
  isBot: boolean;
}

export interface TicketContext {
  member: { id: string; fullName: string; phoneNumber: string; bonusBalance: number } | null;
  verification: { passport?: string; driverLicense?: string; face?: string } | null;
  activeRental: { id: number; car: string | null } | null;
  outstandingDebt: { total: number; count: number; currency: string };
  flags: { hasDebt: boolean; isBlocked: boolean; unverified: boolean };
}

export interface ReplyTemplate {
  id: number;
  title: string;
  body: string;
}

export interface ReplySuggestion {
  id: number;
  text: string;
}
