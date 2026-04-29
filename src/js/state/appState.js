import { DEFAULT_MONTH, DEFAULT_YEAR } from '../config/constants.js';

export const appState = {
    currentMonth: DEFAULT_MONTH,
    currentYear: DEFAULT_YEAR,
};

export function getCurrentMonthKey() {
    return `${appState.currentYear}-${appState.currentMonth}`    
}