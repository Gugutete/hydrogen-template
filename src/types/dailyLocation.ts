export interface DailyLocation {
  date: string; // formato 'YYYY-MM-DD'
  location: string;
}

// Estendi l'interfaccia Tour esistente per includere le location giornaliere
export interface TourWithDailyLocations {
  id: string;
  title: string;
  start: string;
  end: string;
  busId: string;
  status: string;
  driverId?: string;
  driverName?: string;
  agencyId?: string;
  agencyName?: string;
  price?: number;
  passengers?: number;
  notes?: string;
  location?: string; // Location predefinita/principale
  dailyLocations?: DailyLocation[]; // Array di location giornaliere
}
