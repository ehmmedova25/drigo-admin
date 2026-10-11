export interface MonitoringOverview {
  api: { status: string; uptimeSeconds: number; requestsPerMinute: number; avgResponseMs: number; errorRate: number };
  database: { status: string; connections: number };
  redis: { status: string; memoryMb: number };
  teltonika: { status: string; onlineDevices: number; totalDevices: number };
}

export interface Container {
  name: string;
  status: string;
  cpu: number;
  memoryMb: number;
  uptime: string;
}

export interface DatabaseInfo {
  status: string;
  sizeMb: number;
  connections: number;
  tables: { name: string; rows: number }[];
}

export interface LogLine {
  id: number;
  level: 'INFO' | 'WARN' | 'ERROR';
  service: string;
  message: string;
  at: string;
}

export interface TelematicsDevice {
  id: number;
  carId: number;
  plateNumber: string;
  imei: string;
  deviceType: string;
  online: boolean;
  lastPingAt: string;
  signalStrength: number;
  firmwareVersion: string;
}
