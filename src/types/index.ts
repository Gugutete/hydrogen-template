// Bus types
export interface Bus {
  id: string;
  name: string;
  plate: string;
  model: string;
  seats: number;
  year: number;
  status: 'active' | 'maintenance' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  busId: string;
  name: string;
  expiryDate: string;
  reminderDays: number;
  status: 'valid' | 'expiring' | 'expired';
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRecord {
  id: string;
  busId: string;
  date: string;
  description: string;
  cost: number;
  nextMaintenanceDate: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Driver types
export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  status: 'available' | 'driving' | 'rest' | 'unavailable';
  createdAt: string;
  updatedAt: string;
}

export interface DrivingHours {
  id: string;
  driverId: string;
  date: string;
  hours: number;
  tourId?: string;
  createdAt: string;
  updatedAt: string;
}

// Tour types
export interface Tour {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  busId: string;
  driverId: string;
  agencyId: string;
  status: 'preparation' | 'active' | 'empty' | 'stop';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Itinerary {
  id: string;
  tourId: string;
  date: string;
  location: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Agency types
export interface Agency {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'staff';
  createdAt: string;
  updatedAt: string;
}

// Calendar event type for FullCalendar
export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  resourceId: string; // busId
  extendedProps: {
    driverId: string;
    driverName: string;
    agencyId: string;
    agencyName: string;
    status: Tour['status'];
    locations: string[];
  };
  backgroundColor: string;
  borderColor: string;
}

// Form types
export type FormMode = 'create' | 'edit' | 'view';

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
