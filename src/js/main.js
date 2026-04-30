import { getCurrentMonthData } from "./storage/storage.js";
import { appState, setCurrentMonth, setCurrentYear } from "./state/appState.js";
import {seedCurrentMonthData} from './services/seedService.js'
import { renderProjectsTable } from './ui/renderProjectsTable.js';
import {renderEmployeesTable} from './ui/renderEmployeesTable.js'


const sidePanel = document.querySelector(".side-panel");
const toggleButton = document.querySelector("#toggle-button");
const openButton = document.querySelector("#open-button");

const projectContent = document.querySelector("#project-content");
const employeesContent = document.querySelector("#employees-content");
const employeesButton = document.querySelector("#nav-project-employees");
const projectButton = document.querySelector("#nav-project");

const monthSelect = document.querySelector("#month-select");
const yearSelect = document.querySelector("#year-select");

const seedDataButton = document.querySelector('#seed-data-btn');


const initialMonthData = getCurrentMonthData();
renderProjectsTable(initialMonthData);
renderEmployeesTable(initialMonthData);


toggleButton.addEventListener("click", () => {
  sidePanel.classList.add("collapsed");
  openButton.classList.remove("hidden");
});

openButton.addEventListener("click", () => {
  openButton.classList.add("hidden");
  sidePanel.classList.remove("collapsed");
});

projectButton.addEventListener("click", (event) => {
  event.preventDefault();

  employeesContent.classList.add("hidden");
  projectContent.classList.remove("hidden");
  employeesButton.classList.remove("active");
  projectButton.classList.add("active");
});

employeesButton.addEventListener("click", (event) => {
  event.preventDefault();

  projectContent.classList.add("hidden");
  employeesContent.classList.remove("hidden");
  projectButton.classList.remove("active");
  employeesButton.classList.add("active");
});

monthSelect.value = appState.currentMonth;
yearSelect.value = appState.currentYear;



monthSelect.addEventListener("change", () => {
  setCurrentMonth(monthSelect.value);

  const selectedPeriodData = getCurrentMonthData();

  renderProjectsTable(selectedPeriodData);
  renderEmployeesTable(selectedPeriodData);

  console.log("selected period data", selectedPeriodData);
});

yearSelect.addEventListener("change", () => {
  setCurrentYear(yearSelect.value);

  const selectedPeriodData = getCurrentMonthData();

  renderProjectsTable(selectedPeriodData);
  renderEmployeesTable(selectedPeriodData);

  console.log("selected period data", selectedPeriodData);
});

seedDataButton.addEventListener('click', ()=>{
    const seededData = seedCurrentMonthData();

    renderProjectsTable(seededData);
    renderEmployeesTable(seededData);

    console.log('seed data added:', seededData);
});


