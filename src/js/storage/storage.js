import { STORAGE_KEY } from "../config/constants.js";
import { getCurrentMonthKey } from "../state/appState.js";

export function getMonthlyData() {
    const data = localStorage.getItem(STORAGE_KEY);

    if(!data){
        return {};
    }
   try {
    const parsedData = JSON.parse(data);
    if (!parsedData || typeof parsedData !== 'object' || Array.isArray(parsedData)) {
        return {};
    }
    return parsedData;
   } catch(error){
    console.warn('Invalid monthlyData in localStorage. Storage was reset.', error);
    localStorage.removeItem(STORAGE_KEY);
    return {};
   }
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

export function clearMonthlyData() {
    localStorage.removeItem(STORAGE_KEY);
}

export function resetCurrentMonthData() {
    const monthlyData =  getMonthlyData();
    const monthKey = getCurrentMonthKey();

    monthlyData[monthKey] = {
        projects: [],
        employees: [],
    };
    saveMonthlyData(monthlyData);

    return monthlyData[monthKey];
}