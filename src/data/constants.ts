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
  { value: 1, label: 'Plochá strecha (do 10°)', description: 'Strecha so sklonom do 10 stupňov' },
  { value: 2, label: 'Šikmá strecha (10° – 45°)', description: 'Strecha so sklonom medzi 10 a 45 stupňami' },
  { value: 3, label: 'Strmá strecha (nad 45°)', description: 'Strecha so sklonom nad 45 stupňov' },
] as const;

// Insulation levels
export const INSULATION_LEVELS = [
  { value: 0, label: 'Nie' },
  { value: 1, label: 'Áno' },
  { value: 2, label: 'Čiastočne', description: 'Iba časť plochy alebo na dnešné pomery už nepostačujúce zateplenie' },
] as const;

// Yes/No
export const YES_NO = [
  { value: 1, label: 'Áno' },
  { value: 0, label: 'Nie' },
] as const;

// Sewage types
export const SEWAGE_TYPES = [
  { value: 1, label: 'Spoločne', description: 'Splašky a dažďová voda odvádzané spoločným potrubím' },
  { value: 2, label: 'Oddelene', description: 'Splašky a dažďová voda majú samostatné potrubia' },
] as const;

// Rain gutter types
export const GUTTER_TYPES = [
  { value: 1, label: 'Vonkajšie', description: 'Zvody vedené po vonkajšej fasáde budovy' },
  { value: 2, label: 'Vnútorné', description: 'Zvody vedené vnútrom budovy' },
] as const;

// Coal/wood types
export const COAL_WOOD_TYPES = [
  { value: 0, label: 'Nie' },
  { value: 1, label: 'Uhlie' },
  { value: 2, label: 'Drevo' },
] as const;

// Project documentation levels
export const PD_LEVELS = [
  { value: 0, label: '–' },
  { value: 1, label: 'Zámer' },
  { value: 2, label: 'Štúdia uskutočniteľnosti' },
  { value: 3, label: 'PD pre územné rozhodnutie' },
  { value: 4, label: 'PD pre stavebné povolenie' },
  { value: 5, label: 'Realizačná dokumentácia' },
  { value: 6, label: 'Skutočné vyhotovenie' },
] as const;

// PD form
export const PD_FORMS = [
  { value: 1, label: 'Tlačená' },
  { value: 2, label: 'Elektronická' },
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
