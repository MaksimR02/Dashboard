import {
  getCurrentMonthData,
  saveCurrentMonthData,
} from "./storage/storage.js";
import { appState, setCurrentMonth, setCurrentYear } from "./state/appState.js";
import { seedCurrentMonthData } from "./services/seedService.js";
import { renderProjectsTable } from "./ui/renderProjectsTable.js";
import { renderEmployeesTable } from "./ui/renderEmployeesTable.js";

const sidePanel = document.querySelector(".side-panel");
const toggleButton = document.querySelector("#toggle-button");
const openButton = document.querySelector("#open-button");

const projectContent = document.querySelector("#project-content");
const employeesContent = document.querySelector("#employees-content");
const employeesButton = document.querySelector("#nav-project-employees");
const projectButton = document.querySelector("#nav-project");

const monthSelect = document.querySelector("#month-select");
const yearSelect = document.querySelector("#year-select");

const seedDataButton = document.querySelector("#seed-data-btn");

const addProjectButton = document.querySelector("#add-project-btn");
const projectModal = document.querySelector("#project-modal");
const closeProjectModalButton = document.querySelector(
  "#close-project-modal-btn",
);
const cancelProjectModalButton = document.querySelector(
  "#cancel-project-modal-btn",
);
const projectForm = document.querySelector("#project-form");

const initialMonthData = getCurrentMonthData();
renderProjectsTable(initialMonthData);
renderEmployeesTable(initialMonthData);


const projectCompanyNameInput = document.querySelector("#project-company-name");
const projectNameInput = document.querySelector("#project-name");
const projectBudgetInput = document.querySelector("#project-budget");
const projectEmployeeCapacityInput = document.querySelector(
  "#project-employee-capacity",
);

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

seedDataButton.addEventListener("click", () => {
  const seededData = seedCurrentMonthData();

  renderProjectsTable(seededData);
  renderEmployeesTable(seededData);

  console.log("seed data added:", seededData);
});

function openProjectModal() {
  projectModal.classList.remove("hidden");
}

function closeProjectModal() {
  projectModal.classList.add('hidden');
  projectForm.reset();
}

addProjectButton.addEventListener('click', () => {
  openProjectModal();
});

closeProjectModalButton.addEventListener('click', () => {
  closeProjectModal();
});

cancelProjectModalButton.addEventListener('click', () => {
  closeProjectModal();
});

projectModal.addEventListener('click', (event) => {
  if (event.target === projectModal) {
    closeProjectModal();
  }
});


function createProjectId() {
  return `project-${Date.now()}`;
}

projectForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const monthData = getCurrentMonthData();

  const newProject = {
    id: createProjectId(),
    companyName: projectCompanyNameInput.value.trim(),
    projectName: projectNameInput.value.trim(),
    budget: Number(projectBudgetInput.value),
    employeeCapacity: Number(projectEmployeeCapacityInput.value),
  };

  if (!newProject.companyName || !newProject.projectName) {
    return;
  }

  monthData.projects.push(newProject);

  saveCurrentMonthData(monthData);

  renderProjectsTable(monthData);
  renderEmployeesTable(monthData);

  closeProjectModal();
});