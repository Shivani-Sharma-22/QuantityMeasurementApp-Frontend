import { Injectable } from '@angular/core';
import { Operation, UnitType, UNITS } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ConversionService {

  getUnits(type: UnitType) {
    return UNITS[type];
  }

  convert(value: number, fromSymbol: string, toSymbol: string, type: UnitType): number {
    const units = UNITS[type];
    const from = units.find(u => u.symbol === fromSymbol)!;
    const to   = units.find(u => u.symbol === toSymbol)!;
    const base = from.toBase(value);
    return to.fromBase(base);
  }

  calculate(
    op: Operation,
    val1: number, unit1: string,
    val2: number, unit2: string,
    type: UnitType,
    targetUnit: string
  ): string {
    const units = UNITS[type];
    const u1 = units.find(u => u.symbol === unit1)!;
    const u2 = units.find(u => u.symbol === unit2)!;
    const tgt = units.find(u => u.symbol === targetUnit)!;

    const base1 = u1.toBase(val1);
    const base2 = u2.toBase(val2);

    switch (op) {
      case 'convert': {
        const res = tgt.fromBase(base1);
        return `${val1} ${unit1} = ${this.fmt(res)} ${targetUnit}`;
      }
      case 'add': {
        const res = tgt.fromBase(base1 + base2);
        return `${val1} ${unit1} + ${val2} ${unit2} = ${this.fmt(res)} ${targetUnit}`;
      }
      case 'subtract': {
        const res = tgt.fromBase(base1 - base2);
        return `${val1} ${unit1} − ${val2} ${unit2} = ${this.fmt(res)} ${targetUnit}`;
      }
      case 'compare': {
        const diff = tgt.fromBase(Math.abs(base1 - base2));
        if (base1 > base2) return `${val1} ${unit1} is greater than ${val2} ${unit2} by ${this.fmt(diff)} ${targetUnit}`;
        if (base1 < base2) return `${val1} ${unit1} is less than ${val2} ${unit2} by ${this.fmt(diff)} ${targetUnit}`;
        return `${val1} ${unit1} equals ${val2} ${unit2}`;
      }
      case 'divide': {
        if (base2 === 0) return 'Error: Division by zero';
        const ratio = base1 / base2;
        return `${val1} ${unit1} ÷ ${val2} ${unit2} = ${this.fmt(ratio)} (ratio)`;
      }
      default: return 'Unknown operation';
    }
  }

  private fmt(n: number): string {
    return parseFloat(n.toFixed(6)).toString();
  }
}
