import { DEFAULT_MONTH, DEFAULT_YEAR } from '../config/constants.js';

export const appState = {
    currentMonth: DEFAULT_MONTH,
    currentYear: DEFAULT_YEAR,
};

export function getCurrentMonthKey() {
    return `${appState.currentYear}-${appState.currentMonth}`;
}

export function setCurrentMonth(month) {
    appState.currentMonth = Number(month);
}

export function setCurrentYear(year) {
    appState.currentYear = Number(year);
}