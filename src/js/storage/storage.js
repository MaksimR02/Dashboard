import { STORAGE_KEY } from "../config/constants.js";
import { getCurrentMonthKey } from "../state/appState.js";

export function getMonthlyData() {
    const data = localStorage.getItem(STORAGE_KEY);

    if(!data){
        return {};
    }
    return JSON.parse(data);
}

export function saveMonthlyData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getCurrentMonthData() {
    const monthlyData = getMonthlyData();
    const monthKey = getCurrentMonthKey();

    if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
            projects: [],
            employees: [],
        };
        saveMonthlyData(monthlyData);
    }
    return monthlyData[monthKey];
}

export function saveCurrentMonthData(monthData) {
    const monthlyData = getMonthlyData();
    const monthKey = getCurrentMonthKey();

    monthlyData[monthKey] = monthData;
    saveMonthlyData(monthlyData);
}