import { useReducer, useEffect, useCallback } from 'react';
import {
  Areal, Pozemok, Budova, InaStavba, BGOpatrenie,
  createEmptyAreal, createEmptyPozemok, createEmptyBudova,
  createEmptyInaStavba, createEmptyBGOpatrenie,
} from '../types/areal';
import { FUEL_CONVERSIONS } from '../data/constants';

type Action =
  | { type: 'SET_AREAL'; payload: Areal }
  | { type: 'UPDATE_AREAL'; payload: Partial<Areal> }
  | { type: 'ADD_POZEMOK' }
  | { type: 'UPDATE_POZEMOK'; payload: { index: number; data: Partial<Pozemok> } }
  | { type: 'REMOVE_POZEMOK'; payload: number }
  | { type: 'ADD_BUDOVA' }
  | { type: 'UPDATE_BUDOVA'; payload: { index: number; data: Partial<Budova> } }
  | { type: 'REMOVE_BUDOVA'; payload: number }
  | { type: 'ADD_INA_STAVBA' }
  | { type: 'UPDATE_INA_STAVBA'; payload: { index: number; data: Partial<InaStavba> } }
  | { type: 'REMOVE_INA_STAVBA'; payload: number }
  | { type: 'ADD_BG_OPATRENIE' }
  | { type: 'UPDATE_BG_OPATRENIE'; payload: { index: number; data: Partial<BGOpatrenie> } }
  | { type: 'REMOVE_BG_OPATRENIE'; payload: number }
  | { type: 'RESET' };

function computeBudovaFields(budova: Budova): Budova {
  // Auto-calculate category
  const uzitkova = budova.uzitkovaPlochaNUS;
  const kategoriaBudovy: 'S' | 'M' | 'L' =
    uzitkova <= 500 ? 'S' : uzitkova <= 1500 ? 'M' : 'L';

  // Auto-calculate green roof potential
  const potencialZelenejStrechy =
    budova.strechaTyp === 1 ? budova.plochaPodorysu : undefined;

  // Fuel conversions
  const kureniePeletySpotreba_kWh = budova.kureniePeletySpotreba_kg * FUEL_CONVERSIONS.pelety;
  const kurenieStiepkaSpotreba_kWh = budova.kurenieStiepkaSpotreba_kg * FUEL_CONVERSIONS.stiepka;

  let kurenieUhlimDrevomSpotreba_kWh = 0;
  if (budova.kurenieUhlimDrevom === 1) {
    kurenieUhlimDrevomSpotreba_kWh = budova.kurenieUhlimDrevomSpotreba_kg * FUEL_CONVERSIONS.uhlie;
  } else if (budova.kurenieUhlimDrevom === 2) {
    kurenieUhlimDrevomSpotreba_kWh = budova.kurenieUhlimDrevomSpotreba_kg * FUEL_CONVERSIONS.drevo;
  }

  // Total heating consumption
  const celkovaSpotreba =
    budova.kureniePlynSpotreba +
    budova.kurenieElektrinaSpotreba +
    budova.tepelneCerpadloSpotreba +
    kureniePeletySpotreba_kWh +
    kurenieStiepkaSpotreba_kWh +
    kurenieUhlimDrevomSpotreba_kWh +
    budova.kurenieCZTSpotreba;

  return {
    ...budova,
    kategoriaBudovy,
    potencialZelenejStrechy,
    kureniePeletySpotreba_kWh,
    kurenieStiepkaSpotreba_kWh,
    kurenieUhlimDrevomSpotreba_kWh,
    celkovaSpotreba,
  };
}

function arealReducer(state: Areal, action: Action): Areal {
  switch (action.type) {
    case 'SET_AREAL':
      return action.payload;

    case 'UPDATE_AREAL':
      return { ...state, ...action.payload };

    case 'ADD_POZEMOK':
      return { ...state, pozemky: [...state.pozemky, createEmptyPozemok()] };

    case 'UPDATE_POZEMOK': {
      const pozemky = [...state.pozemky];
      pozemky[action.payload.index] = {
        ...pozemky[action.payload.index],
        ...action.payload.data,
      };
      return { ...state, pozemky };
    }

    case 'REMOVE_POZEMOK': {
      if (state.pozemky.length <= 1) return state;
      const pozemky = state.pozemky.filter((_, i) => i !== action.payload);
      return { ...state, pozemky };
    }

    case 'ADD_BUDOVA':
      return { ...state, budovy: [...state.budovy, createEmptyBudova()] };

    case 'UPDATE_BUDOVA': {
      const budovy = [...state.budovy];
      const updated = { ...budovy[action.payload.index], ...action.payload.data };
      budovy[action.payload.index] = computeBudovaFields(updated);
      return { ...state, budovy };
    }

    case 'REMOVE_BUDOVA': {
      if (state.budovy.length <= 1) return state;
      const budovy = state.budovy.filter((_, i) => i !== action.payload);
      return { ...state, budovy };
    }

    case 'ADD_INA_STAVBA':
      return { ...state, ineStavby: [...state.ineStavby, createEmptyInaStavba()] };

    case 'UPDATE_INA_STAVBA': {
      const ineStavby = [...state.ineStavby];
      ineStavby[action.payload.index] = {
        ...ineStavby[action.payload.index],
        ...action.payload.data,
      };
      return { ...state, ineStavby };
    }

    case 'REMOVE_INA_STAVBA': {
      const ineStavby = state.ineStavby.filter((_, i) => i !== action.payload);
      return { ...state, ineStavby };
    }

    case 'ADD_BG_OPATRENIE':
      return { ...state, bgOpatrenia: [...state.bgOpatrenia, createEmptyBGOpatrenie()] };

    case 'UPDATE_BG_OPATRENIE': {
      const bgOpatrenia = [...state.bgOpatrenia];
      bgOpatrenia[action.payload.index] = {
        ...bgOpatrenia[action.payload.index],
        ...action.payload.data,
      };
      return { ...state, bgOpatrenia };
    }

    case 'REMOVE_BG_OPATRENIE': {
      const bgOpatrenia = state.bgOpatrenia.filter((_, i) => i !== action.payload);
      return { ...state, bgOpatrenia };
    }

    case 'RESET':
      return createEmptyAreal();

    default:
      return state;
  }
}

const STORAGE_KEY = 'sma-nastroj-areal';

export function useArealState() {
  const [areal, dispatch] = useReducer(arealReducer, null, () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as Areal;
      }
    } catch { /* ignore */ }
    return createEmptyAreal();
  });

  // Save to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(areal));
    } catch (error) {
      console.warn('Failed to save areal to localStorage:', error);
    }
  }, [areal]);

  const updateAreal = useCallback((data: Partial<Areal>) => {
    dispatch({ type: 'UPDATE_AREAL', payload: data });
  }, []);

  const addPozemok = useCallback(() => dispatch({ type: 'ADD_POZEMOK' }), []);
  const updatePozemok = useCallback((index: number, data: Partial<Pozemok>) => {
    dispatch({ type: 'UPDATE_POZEMOK', payload: { index, data } });
  }, []);
  const removePozemok = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_POZEMOK', payload: index });
  }, []);

  const addBudova = useCallback(() => dispatch({ type: 'ADD_BUDOVA' }), []);
  const updateBudova = useCallback((index: number, data: Partial<Budova>) => {
    dispatch({ type: 'UPDATE_BUDOVA', payload: { index, data } });
  }, []);
  const removeBudova = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_BUDOVA', payload: index });
  }, []);

  const addInaStavba = useCallback(() => dispatch({ type: 'ADD_INA_STAVBA' }), []);
  const updateInaStavba = useCallback((index: number, data: Partial<InaStavba>) => {
    dispatch({ type: 'UPDATE_INA_STAVBA', payload: { index, data } });
  }, []);
  const removeInaStavba = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_INA_STAVBA', payload: index });
  }, []);

  const addBGOpatrenie = useCallback(() => dispatch({ type: 'ADD_BG_OPATRENIE' }), []);
  const updateBGOpatrenie = useCallback((index: number, data: Partial<BGOpatrenie>) => {
    dispatch({ type: 'UPDATE_BG_OPATRENIE', payload: { index, data } });
  }, []);
  const removeBGOpatrenie = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_BG_OPATRENIE', payload: index });
  }, []);

  const resetAreal = useCallback(() => dispatch({ type: 'RESET' }), []);

  return {
    areal,
    updateAreal,
    addPozemok, updatePozemok, removePozemok,
    addBudova, updateBudova, removeBudova,
    addInaStavba, updateInaStavba, removeInaStavba,
    addBGOpatrenie, updateBGOpatrenie, removeBGOpatrenie,
    resetAreal,
  };
}
