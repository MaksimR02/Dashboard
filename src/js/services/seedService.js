import { sampleProjects,sampleEmployees } from "../data/sampleData.js";
import { saveCurrentMonthData } from "../storage/storage.js";

function cloneData(data) {
    return JSON.parse(JSON.stringify(data));
}

export function seedCurrentMonthData() {
    const monthData = {
        projects: cloneData(sampleProjects),
        employees: cloneData(sampleEmployees),
    };
    saveCurrentMonthData(monthData);
    return monthData;
}