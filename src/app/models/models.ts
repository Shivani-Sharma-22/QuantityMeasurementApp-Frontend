export type UnitType = 'length' | 'temperature' | 'volume' | 'weight';
export type Operation = 'convert' | 'add' | 'subtract' | 'compare' | 'divide';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface HistoryEntry {
  id: string;
  userId: string;
  unitType: UnitType;
  operation: Operation;
  value1: number;
  unit1: string;
  value2?: number;
  unit2?: string;
  result: string;
  timestamp: Date;
}

export interface UnitDefinition {
  symbol: string;
  label: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

export const UNITS: Record<UnitType, UnitDefinition[]> = {
  length: [
    { symbol: 'm',   label: 'Meter',      toBase: v => v,          fromBase: v => v },
    { symbol: 'cm',  label: 'Centimeter', toBase: v => v / 100,    fromBase: v => v * 100 },
    { symbol: 'km',  label: 'Kilometer',  toBase: v => v * 1000,   fromBase: v => v / 1000 },
    { symbol: 'in',  label: 'Inch',       toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
    { symbol: 'ft',  label: 'Foot',       toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
    { symbol: 'mi',  label: 'Mile',       toBase: v => v * 1609.34,fromBase: v => v / 1609.34 },
  ],
  temperature: [
    { symbol: '°C',  label: 'Celsius',    toBase: v => v,                   fromBase: v => v },
    { symbol: '°F',  label: 'Fahrenheit', toBase: v => (v - 32) * 5/9,     fromBase: v => v * 9/5 + 32 },
    { symbol: 'K',   label: 'Kelvin',     toBase: v => v - 273.15,          fromBase: v => v + 273.15 },
  ],
  volume: [
    { symbol: 'L',   label: 'Liter',      toBase: v => v,         fromBase: v => v },
    { symbol: 'mL',  label: 'Milliliter', toBase: v => v / 1000,  fromBase: v => v * 1000 },
    { symbol: 'm³',  label: 'Cubic Meter',toBase: v => v * 1000,  fromBase: v => v / 1000 },
    { symbol: 'gal', label: 'Gallon',     toBase: v => v * 3.785, fromBase: v => v / 3.785 },
    { symbol: 'fl oz',label:'Fluid Ounce',toBase: v => v * 0.0296,fromBase: v => v / 0.0296 },
    { symbol: 'cup', label: 'Cup',        toBase: v => v * 0.2366,fromBase: v => v / 0.2366 },
  ],
  weight: [
    { symbol: 'kg',  label: 'Kilogram',   toBase: v => v,         fromBase: v => v },
    { symbol: 'g',   label: 'Gram',       toBase: v => v / 1000,  fromBase: v => v * 1000 },
    { symbol: 'lb',  label: 'Pound',      toBase: v => v * 0.4536,fromBase: v => v / 0.4536 },
    { symbol: 'oz',  label: 'Ounce',      toBase: v => v * 0.0283,fromBase: v => v / 0.0283 },
    { symbol: 't',   label: 'Metric Ton', toBase: v => v * 1000,  fromBase: v => v / 1000 },
  ],
};
