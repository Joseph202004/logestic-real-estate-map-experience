export interface Property {
  id: string;
  name: string;
  market: string;
  submarket: string;
  country: string;
  sizeSqft: number;
  landSizeAcres?: number;
  availableFrom: string;
  availabilityStatus: 'available' | 'under_negotiation' | 'coming_soon';
  leaseTermOptions: string[];
  clearHeightFt: number;
  dockDoors: number;
  driveInDoors?: number;
  columnSpacing?: string;
  powerCapacityAmps?: number;
  railAccess: boolean;
  coldStorageReady: boolean;
  btsAvailable: boolean;
  map: { lat: number; lng: number };
  locationSignals: {
    airportDistanceMiles?: number;
    seaportDistanceMiles?: number;
    highwayAccess: string;
    intermodalDistanceMiles?: number;
    laborPoolScore: number;
    sameDayReach: string;
  };
  essentials: {
    racking: boolean;
    automation: boolean;
    moveInMoveOut: boolean;
    software: boolean;
    energy: boolean;
    evCharging: boolean;
    workforce: boolean;
  };
  sustainability: {
    solarReady: boolean;
    evReady: boolean;
    certification?: string;
    carbonScore: number;
    energyScore: number;
  };
  bestFor: string[];
  images: string[];
  rentPsf?: number;
}

export const properties: Property[] = [
  {
    id: 'prop-001',
    name: 'Prologis Park Chicago I',
    market: 'Chicago',
    submarket: 'I-55 Corridor',
    country: 'US',
    sizeSqft: 245000,
    landSizeAcres: 12.5,
    availableFrom: '2026-06-01',
    availabilityStatus: 'available',
    leaseTermOptions: ['3 Year', '5 Year', '7 Year', '10 Year'],
    clearHeightFt: 36,
    dockDoors: 48,
    driveInDoors: 2,
    columnSpacing: '52\' x 60\'',
    powerCapacityAmps: 4000,
    railAccess: false,
    coldStorageReady: false,
    btsAvailable: false,
    map: { lat: 41.75, lng: -87.85 },
    locationSignals: {
      airportDistanceMiles: 8,
      highwayAccess: 'I-55, I-294',
      intermodalDistanceMiles: 12,
      laborPoolScore: 87,
      sameDayReach: '32M consumers'
    },
    essentials: { racking: true, automation: true, moveInMoveOut: true, software: false, energy: true, evCharging: true, workforce: true },
    sustainability: { solarReady: true, evReady: true, certification: 'LEED Gold', carbonScore: 82, energyScore: 88 },
    bestFor: ['E-commerce fulfillment', 'Regional distribution', 'Last-mile hub'],
    images: ['https://images.unsplash.com/photo-1771530789155-b1f03fbf82b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3YXJlaG91c2UlMjBsb2dpc3RpY3MlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzU2MzM2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080'],
    rentPsf: 8.25
  },
  {
    id: 'prop-002',
    name: 'Prologis Meadowlands DC',
    market: 'New Jersey',
    submarket: 'Meadowlands',
    country: 'US',
    sizeSqft: 180000,
    landSizeAcres: 9,
    availableFrom: '2026-05-15',
    availabilityStatus: 'available',
    leaseTermOptions: ['5 Year', '7 Year'],
    clearHeightFt: 40,
    dockDoors: 36,
    driveInDoors: 4,
    columnSpacing: '54\' x 50\'',
    powerCapacityAmps: 6000,
    railAccess: false,
    coldStorageReady: false,
    btsAvailable: false,
    map: { lat: 40.78, lng: -74.07 },
    locationSignals: {
      airportDistanceMiles: 12,
      seaportDistanceMiles: 5,
      highwayAccess: 'NJ Turnpike, I-95',
      laborPoolScore: 91,
      sameDayReach: '45M consumers'
    },
    essentials: { racking: true, automation: false, moveInMoveOut: true, software: true, energy: true, evCharging: true, workforce: false },
    sustainability: { solarReady: true, evReady: true, certification: 'LEED Silver', carbonScore: 78, energyScore: 85 },
    bestFor: ['Last-mile delivery', 'E-commerce', 'Cross-dock operations'],
    images: ['https://images.unsplash.com/photo-1726776230760-ae81dc9d4e55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwd2FyZWhvdXNlJTIwZXh0ZXJpb3IlMjBhZXJpYWx8ZW58MXx8fHwxNzc1NjMzNjI1fDA&ixlib=rb-4.1.0&q=80&w=1080'],
    rentPsf: 14.50
  },
  {
    id: 'prop-003',
    name: 'Prologis Inland Empire West',
    market: 'Inland Empire',
    submarket: 'IE West',
    country: 'US',
    sizeSqft: 520000,
    landSizeAcres: 28,
    availableFrom: '2026-08-01',
    availabilityStatus: 'coming_soon',
    leaseTermOptions: ['5 Year', '10 Year', '15 Year'],
    clearHeightFt: 40,
    dockDoors: 80,
    driveInDoors: 4,
    columnSpacing: '56\' x 60\'',
    powerCapacityAmps: 8000,
    railAccess: true,
    coldStorageReady: false,
    btsAvailable: true,
    map: { lat: 34.0, lng: -117.4 },
    locationSignals: {
      airportDistanceMiles: 35,
      seaportDistanceMiles: 55,
      highwayAccess: 'I-10, I-15',
      intermodalDistanceMiles: 8,
      laborPoolScore: 79,
      sameDayReach: '22M consumers'
    },
    essentials: { racking: true, automation: true, moveInMoveOut: true, software: true, energy: true, evCharging: true, workforce: true },
    sustainability: { solarReady: true, evReady: true, certification: 'LEED Platinum', carbonScore: 94, energyScore: 96 },
    bestFor: ['Mega-distribution', 'Manufacturing', '3PL hub'],
    images: ['https://images.unsplash.com/photo-1769497165127-a6400eb3edf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXN0cmlidXRpb24lMjBjZW50ZXIlMjBsb2FkaW5nJTIwZG9ja3xlbnwxfHx8fDE3NzU1OTEzNTV8MA&ixlib=rb-4.1.0&q=80&w=1080'],
    rentPsf: 9.75
  },
  {
    id: 'prop-004',
    name: 'Prologis Dallas Logistics Hub',
    market: 'Dallas-Fort Worth',
    submarket: 'South Dallas',
    country: 'US',
    sizeSqft: 310000,
    landSizeAcres: 16,
    availableFrom: '2026-05-01',
    availabilityStatus: 'available',
    leaseTermOptions: ['3 Year', '5 Year', '7 Year'],
    clearHeightFt: 36,
    dockDoors: 56,
    driveInDoors: 2,
    columnSpacing: '50\' x 54\'',
    powerCapacityAmps: 5000,
    railAccess: true,
    coldStorageReady: false,
    btsAvailable: false,
    map: { lat: 32.65, lng: -96.85 },
    locationSignals: {
      airportDistanceMiles: 15,
      highwayAccess: 'I-20, I-45, I-35E',
      intermodalDistanceMiles: 5,
      laborPoolScore: 83,
      sameDayReach: '18M consumers'
    },
    essentials: { racking: true, automation: false, moveInMoveOut: true, software: false, energy: true, evCharging: false, workforce: true },
    sustainability: { solarReady: true, evReady: false, certification: 'LEED Silver', carbonScore: 72, energyScore: 78 },
    bestFor: ['Regional distribution', 'Rail-served operations', '3PL'],
    images: ['https://images.unsplash.com/photo-1726866492047-7f9516558c6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjBzb2xhciUyMHBhbmVscyUyMHJvb2Z0b3B8ZW58MXx8fHwxNzc1NjMzNjI1fDA&ixlib=rb-4.1.0&q=80&w=1080'],
    rentPsf: 6.50
  },
  {
    id: 'prop-005',
    name: 'Prologis Georgetown Cold',
    market: 'Atlanta',
    submarket: 'South Atlanta',
    country: 'US',
    sizeSqft: 150000,
    landSizeAcres: 8,
    availableFrom: '2026-07-15',
    availabilityStatus: 'under_negotiation',
    leaseTermOptions: ['5 Year', '10 Year'],
    clearHeightFt: 32,
    dockDoors: 28,
    columnSpacing: '48\' x 52\'',
    powerCapacityAmps: 6000,
    railAccess: false,
    coldStorageReady: true,
    btsAvailable: false,
    map: { lat: 33.55, lng: -84.45 },
    locationSignals: {
      airportDistanceMiles: 18,
      highwayAccess: 'I-75, I-85',
      laborPoolScore: 80,
      sameDayReach: '15M consumers'
    },
    essentials: { racking: true, automation: false, moveInMoveOut: true, software: false, energy: true, evCharging: true, workforce: false },
    sustainability: { solarReady: false, evReady: true, carbonScore: 65, energyScore: 70 },
    bestFor: ['Cold chain logistics', 'Grocery distribution', 'Perishables'],
    images: ['https://images.unsplash.com/photo-1774929108280-652f82f21d9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2dpc3RpY3MlMjBzdXBwbHklMjBjaGFpbiUyMGZyZWlnaHR8ZW58MXx8fHwxNzc1NjMzNjI2fDA&ixlib=rb-4.1.0&q=80&w=1080'],
    rentPsf: 11.00
  },
  {
    id: 'prop-006',
    name: 'Prologis SeaTac Gateway',
    market: 'Seattle',
    submarket: 'Kent Valley',
    country: 'US',
    sizeSqft: 195000,
    landSizeAcres: 10,
    availableFrom: '2026-06-15',
    availabilityStatus: 'available',
    leaseTermOptions: ['3 Year', '5 Year', '7 Year'],
    clearHeightFt: 36,
    dockDoors: 40,
    driveInDoors: 2,
    columnSpacing: '52\' x 56\'',
    powerCapacityAmps: 4000,
    railAccess: false,
    coldStorageReady: false,
    btsAvailable: false,
    map: { lat: 47.38, lng: -122.23 },
    locationSignals: {
      airportDistanceMiles: 5,
      seaportDistanceMiles: 20,
      highwayAccess: 'I-5, SR-167',
      laborPoolScore: 85,
      sameDayReach: '12M consumers'
    },
    essentials: { racking: true, automation: true, moveInMoveOut: true, software: true, energy: true, evCharging: true, workforce: true },
    sustainability: { solarReady: true, evReady: true, certification: 'LEED Gold', carbonScore: 88, energyScore: 90 },
    bestFor: ['E-commerce fulfillment', 'Tech logistics', 'Air cargo distribution'],
    images: ['https://images.unsplash.com/photo-1768796369926-2e25a1e4fc9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwcGFyayUyMGJ1aWxkaW5nJTIwbW9kZXJufGVufDF8fHx8MTc3NTYzMzYyNnww&ixlib=rb-4.1.0&q=80&w=1080'],
    rentPsf: 12.25
  },
  {
    id: 'prop-007',
    name: 'Prologis Memphis Intermodal',
    market: 'Memphis',
    submarket: 'Southeast Memphis',
    country: 'US',
    sizeSqft: 420000,
    landSizeAcres: 22,
    availableFrom: '2026-09-01',
    availabilityStatus: 'coming_soon',
    leaseTermOptions: ['5 Year', '10 Year', '15 Year'],
    clearHeightFt: 40,
    dockDoors: 72,
    driveInDoors: 4,
    columnSpacing: '56\' x 60\'',
    powerCapacityAmps: 8000,
    railAccess: true,
    coldStorageReady: false,
    btsAvailable: true,
    map: { lat: 35.07, lng: -89.95 },
    locationSignals: {
      airportDistanceMiles: 6,
      highwayAccess: 'I-40, I-55',
      intermodalDistanceMiles: 3,
      laborPoolScore: 76,
      sameDayReach: '10M consumers'
    },
    essentials: { racking: true, automation: true, moveInMoveOut: true, software: false, energy: true, evCharging: false, workforce: true },
    sustainability: { solarReady: true, evReady: false, certification: 'LEED Silver', carbonScore: 70, energyScore: 75 },
    bestFor: ['Manufacturing', 'Rail-served distribution', 'Bulk storage'],
    images: ['https://images.unsplash.com/photo-1771530789155-b1f03fbf82b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3YXJlaG91c2UlMjBsb2dpc3RpY3MlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzU2MzM2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080'],
    rentPsf: 5.75
  },
  {
    id: 'prop-008',
    name: 'Prologis PA Turnpike East',
    market: 'Pennsylvania',
    submarket: 'Lehigh Valley',
    country: 'US',
    sizeSqft: 275000,
    landSizeAcres: 14,
    availableFrom: '2026-05-30',
    availabilityStatus: 'available',
    leaseTermOptions: ['3 Year', '5 Year', '10 Year'],
    clearHeightFt: 36,
    dockDoors: 50,
    driveInDoors: 2,
    columnSpacing: '52\' x 54\'',
    powerCapacityAmps: 4000,
    railAccess: false,
    coldStorageReady: false,
    btsAvailable: false,
    map: { lat: 40.62, lng: -75.37 },
    locationSignals: {
      airportDistanceMiles: 45,
      seaportDistanceMiles: 80,
      highwayAccess: 'I-78, PA Turnpike',
      laborPoolScore: 82,
      sameDayReach: '38M consumers'
    },
    essentials: { racking: true, automation: false, moveInMoveOut: true, software: false, energy: true, evCharging: true, workforce: false },
    sustainability: { solarReady: true, evReady: true, certification: 'LEED Gold', carbonScore: 80, energyScore: 84 },
    bestFor: ['E-commerce fulfillment', 'Retail distribution', '3PL'],
    images: ['https://images.unsplash.com/photo-1726776230760-ae81dc9d4e55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwd2FyZWhvdXNlJTIwZXh0ZXJpb3IlMjBhZXJpYWx8ZW58MXx8fHwxNzc1NjMzNjI1fDA&ixlib=rb-4.1.0&q=80&w=1080'],
    rentPsf: 9.00
  },
  {
    id: 'prop-009',
    name: 'Prologis Phoenix Sky Harbor',
    market: 'Phoenix',
    submarket: 'Southwest Phoenix',
    country: 'US',
    sizeSqft: 200000,
    landSizeAcres: 11,
    availableFrom: '2026-06-01',
    availabilityStatus: 'available',
    leaseTermOptions: ['3 Year', '5 Year'],
    clearHeightFt: 32,
    dockDoors: 32,
    driveInDoors: 2,
    columnSpacing: '50\' x 52\'',
    powerCapacityAmps: 3000,
    railAccess: false,
    coldStorageReady: false,
    btsAvailable: false,
    map: { lat: 33.42, lng: -112.05 },
    locationSignals: {
      airportDistanceMiles: 8,
      highwayAccess: 'I-10, I-17',
      laborPoolScore: 77,
      sameDayReach: '8M consumers'
    },
    essentials: { racking: false, automation: false, moveInMoveOut: true, software: false, energy: true, evCharging: true, workforce: true },
    sustainability: { solarReady: true, evReady: true, certification: 'LEED Silver', carbonScore: 85, energyScore: 92 },
    bestFor: ['Regional distribution', 'Retail fulfillment', 'Seasonal overflow'],
    images: ['https://images.unsplash.com/photo-1769497165127-a6400eb3edf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXN0cmlidXRpb24lMjBjZW50ZXIlMjBsb2FkaW5nJTIwZG9ja3xlbnwxfHx8fDE3NzU1OTEzNTV8MA&ixlib=rb-4.1.0&q=80&w=1080'],
    rentPsf: 7.50
  },
  {
    id: 'prop-010',
    name: 'Prologis Savannah Port Logistics',
    market: 'Savannah',
    submarket: 'Port Area',
    country: 'US',
    sizeSqft: 350000,
    landSizeAcres: 18,
    availableFrom: '2026-10-01',
    availabilityStatus: 'coming_soon',
    leaseTermOptions: ['5 Year', '10 Year'],
    clearHeightFt: 40,
    dockDoors: 64,
    driveInDoors: 4,
    columnSpacing: '54\' x 60\'',
    powerCapacityAmps: 6000,
    railAccess: true,
    coldStorageReady: true,
    btsAvailable: true,
    map: { lat: 32.05, lng: -81.15 },
    locationSignals: {
      seaportDistanceMiles: 3,
      airportDistanceMiles: 12,
      highwayAccess: 'I-16, I-95',
      intermodalDistanceMiles: 4,
      laborPoolScore: 72,
      sameDayReach: '6M consumers'
    },
    essentials: { racking: true, automation: true, moveInMoveOut: true, software: true, energy: true, evCharging: true, workforce: true },
    sustainability: { solarReady: true, evReady: true, certification: 'LEED Platinum', carbonScore: 91, energyScore: 93 },
    bestFor: ['Import/export distribution', 'Cold chain', 'Manufacturing'],
    images: ['https://images.unsplash.com/photo-1774929108280-652f82f21d9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2dpc3RpY3MlMjBzdXBwbHklMjBjaGFpbiUyMGZyZWlnaHR8ZW58MXx8fHwxNzc1NjMzNjI2fDA&ixlib=rb-4.1.0&q=80&w=1080'],
    rentPsf: 6.25
  },
  {
    id: 'prop-011',
    name: 'Prologis Denver Stapleton',
    market: 'Denver',
    submarket: 'Northeast Denver',
    country: 'US',
    sizeSqft: 165000,
    landSizeAcres: 9,
    availableFrom: '2026-05-20',
    availabilityStatus: 'available',
    leaseTermOptions: ['3 Year', '5 Year', '7 Year'],
    clearHeightFt: 32,
    dockDoors: 30,
    driveInDoors: 2,
    columnSpacing: '50\' x 52\'',
    powerCapacityAmps: 3000,
    railAccess: false,
    coldStorageReady: false,
    btsAvailable: false,
    map: { lat: 39.77, lng: -104.87 },
    locationSignals: {
      airportDistanceMiles: 10,
      highwayAccess: 'I-70, I-76',
      laborPoolScore: 81,
      sameDayReach: '5M consumers'
    },
    essentials: { racking: true, automation: false, moveInMoveOut: true, software: false, energy: true, evCharging: false, workforce: true },
    sustainability: { solarReady: true, evReady: false, carbonScore: 74, energyScore: 80 },
    bestFor: ['Regional distribution', 'E-commerce', 'Retail'],
    images: ['https://images.unsplash.com/photo-1768796369926-2e25a1e4fc9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwcGFyayUyMGJ1aWxkaW5nJTIwbW9kZXJufGVufDF8fHx8MTc3NTYzMzYyNnww&ixlib=rb-4.1.0&q=80&w=1080'],
    rentPsf: 8.75
  },
  {
    id: 'prop-012',
    name: 'Prologis Houston Ship Channel',
    market: 'Houston',
    submarket: 'East Houston',
    country: 'US',
    sizeSqft: 380000,
    landSizeAcres: 20,
    availableFrom: '2026-07-01',
    availabilityStatus: 'under_negotiation',
    leaseTermOptions: ['5 Year', '10 Year'],
    clearHeightFt: 40,
    dockDoors: 68,
    driveInDoors: 4,
    columnSpacing: '54\' x 58\'',
    powerCapacityAmps: 8000,
    railAccess: true,
    coldStorageReady: true,
    btsAvailable: true,
    map: { lat: 29.74, lng: -95.22 },
    locationSignals: {
      seaportDistanceMiles: 2,
      airportDistanceMiles: 20,
      highwayAccess: 'I-10, I-610, SH-225',
      intermodalDistanceMiles: 6,
      laborPoolScore: 84,
      sameDayReach: '14M consumers'
    },
    essentials: { racking: true, automation: true, moveInMoveOut: true, software: true, energy: true, evCharging: true, workforce: true },
    sustainability: { solarReady: true, evReady: true, certification: 'LEED Gold', carbonScore: 79, energyScore: 83 },
    bestFor: ['Petrochemical logistics', 'Import/export', 'Heavy manufacturing'],
    images: ['https://images.unsplash.com/photo-1726866492047-7f9516558c6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjBzb2xhciUyMHBhbmVscyUyMHJvb2Z0b3B8ZW58MXx8fHwxNzc1NjMzNjI1fDA&ixlib=rb-4.1.0&q=80&w=1080'],
    rentPsf: 7.00
  }
];

export function formatSqft(n: number): string {
  return n.toLocaleString() + ' SF';
}

export function getStatusLabel(s: Property['availabilityStatus']): string {
  switch (s) {
    case 'available': return 'Available Now';
    case 'under_negotiation': return 'Under Negotiation';
    case 'coming_soon': return 'Coming Soon';
  }
}

export function getStatusColor(s: Property['availabilityStatus']): string {
  switch (s) {
    case 'available': return 'bg-[#00CC66] text-white';
    case 'under_negotiation': return 'bg-[#B26A00] text-white';
    case 'coming_soon': return 'bg-[#0C447C] text-white';
  }
}

export function getEssentialsList(e: Property['essentials']): string[] {
  const list: string[] = [];
  if (e.racking) list.push('Racking');
  if (e.automation) list.push('Automation');
  if (e.energy) list.push('Energy');
  if (e.evCharging) list.push('EV Charging');
  if (e.workforce) list.push('Workforce');
  if (e.software) list.push('Software');
  if (e.moveInMoveOut) list.push('Move-in Ready');
  return list;
}
