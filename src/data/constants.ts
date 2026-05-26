// Fuel conversion factors (kg -> kWh)
export const FUEL_CONVERSIONS = {
  pelety: 4.8,
  stiepka: 4.0,
  uhlie: 8.0,
  drevo: 4.3,
} as const;

// Building category thresholds (by uzitkovaPlochaNUS)
export const BUILDING_CATEGORIES = {
  S: { max: 500, label: 'S – do 500 m²' },
  M: { min: 500, max: 1500, label: 'M – 500 až 1 500 m²' },
  L: { min: 1500, label: 'L – nad 1 500 m²' },
} as const;

// Roof types
export const ROOF_TYPES = [
  { value: 1, label: 'plochá strecha (do 10°)', description: 'Strecha so sklonom do 10 stupňov' },
  { value: 2, label: 'šikmá strecha (10° – 45°)', description: 'Strecha so sklonom medzi 10 a 45 stupňami' },
  { value: 3, label: 'strmá strecha (nad 45°)', description: 'Strecha so sklonom nad 45 stupňov' },
] as const;

// Insulation levels
export const INSULATION_LEVELS = [
  { value: 0, label: 'nie' },
  { value: 1, label: 'áno' },
  { value: 2, label: 'čiastočne', description: 'Iba časť plochy alebo na dnešné pomery už nepostačujúce zateplenie' },
] as const;

// Yes/No
export const YES_NO = [
  { value: 1, label: 'áno' },
  { value: 0, label: 'nie' },
] as const;

// Sewage types
export const SEWAGE_TYPES = [
  { value: 1, label: 'spoločne', description: 'Splašky a dažďová voda odvádzané spoločným potrubím' },
  { value: 2, label: 'oddelene', description: 'Splašky a dažďová voda majú samostatné potrubia' },
] as const;

// Rain gutter types
export const GUTTER_TYPES = [
  { value: 1, label: 'vonkajšie', description: 'Zvody vedené po vonkajšej fasáde budovy' },
  { value: 2, label: 'vnútorné', description: 'Zvody vedené vnútrom budovy' },
] as const;

// Coal/wood types
export const COAL_WOOD_TYPES = [
  { value: 0, label: 'nie' },
  { value: 1, label: 'uhlie' },
  { value: 2, label: 'drevo' },
] as const;

// Project documentation levels
export const PD_LEVELS = [
  { value: 0, label: '–' },
  { value: 1, label: 'zámer' },
  { value: 2, label: 'štúdia uskutočniteľnosti' },
  { value: 3, label: 'PD pre územné rozhodnutie' },
  { value: 4, label: 'PD pre stavebné povolenie' },
  { value: 5, label: 'realizačná dokumentácia' },
  { value: 6, label: 'skutočné vyhotovenie' },
] as const;

// PD form
export const PD_FORMS = [
  { value: 1, label: 'tlačená' },
  { value: 2, label: 'elektronická' },
] as const;

// Slovak regions
export const REGIONS = [
  'Bratislava', 'Záhorie', 'Podunajsko', 'Považie', 'Ponitrie',
  'Turiec', 'Liptov', 'Orava', 'Spiš', 'Šariš', 'Zemplín', 'Gemer',
] as const;

// Colors
export const COLORS = {
  primary: '#2D7D46',
  primaryLight: '#4CAF50',
  primaryDark: '#1B5E20',
  secondary: '#2196F3',
  secondaryLight: '#64B5F6',
  secondaryDark: '#1565C0',
  warning: '#F59E0B',
  danger: '#DC2626',
  score: {
    cervena: '#DC2626',
    oranzova: '#EA580C',
    zlta: '#CA8A04',
    zelena: '#16A34A',
    tmavaZelena: '#166534',
  },
} as const;
