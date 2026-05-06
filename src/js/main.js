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

const addEmployeeButton = document.querySelector("#add-employee-btn");
const employeeModal = document.querySelector("#employee-modal");
const closeEmployeeModalButton = document.querySelector(
  "#close-employee-modal-btn",
);
const cancelEmployeeModalButton = document.querySelector(
  "#cancel-employee-modal-btn",
);
const employeeForm = document.querySelector("#employee-form");

const employeeNameInput = document.querySelector("#employee-name");
const employeeSurnameInput = document.querySelector("#employee-surname");
const employeeDateOfBirthInput = document.querySelector(
  "#employee-date-of-birth",
);
const employeePositionInput = document.querySelector("#employee-position");
const employeeSalaryInput = document.querySelector("#employee-salary");

const projectsTable = document.querySelector("#projects-table");
const employeesTable = document.querySelector("#employees-table");

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

function openEmployeeModal() {
  employeeModal.classList.remove("hidden");
}

function closeEmployeeModal() {
  employeeModal.classList.add("hidden");
  employeeForm.reset();
}

addEmployeeButton.addEventListener("click", () => {
  openEmployeeModal();
});

closeEmployeeModalButton.addEventListener("click", () => {
  closeEmployeeModal();
});

cancelEmployeeModalButton.addEventListener("click", () => {
  closeEmployeeModal();
});

employeeModal.addEventListener("click", (event) => {
  if (event.target === employeeModal) {
    closeEmployeeModal();
  }
});

function createEmployeeId() {
  return `employee-${Date.now()}`;
}

employeeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const monthData = getCurrentMonthData();

  const newEmployee = {
    id: createEmployeeId(),
    name: employeeNameInput.value.trim(),
    surname: employeeSurnameInput.value.trim(),
    dateOfBirth: employeeDateOfBirthInput.value,
    position: employeePositionInput.value,
    salary: Number(employeeSalaryInput.value),
    assignments: [],
  };

  if (!newEmployee.name || !newEmployee.surname || !newEmployee.position) {
    return;
  }

  monthData.employees.push(newEmployee);

  saveCurrentMonthData(monthData);

  renderProjectsTable(monthData);
  renderEmployeesTable(monthData);

  closeEmployeeModal();
});

function deleteProject(projectId) {
  const monthData = getCurrentMonthData();

  const projectToDelete = monthData.projects.find((project) => {
    return project.id === projectId;
  });

  if (!projectToDelete) {
    return;
  }

  const isConfirmed = confirm(
    `Are you sure you want to delete project "${projectToDelete.projectName}"?`,
  );

  if (!isConfirmed) {
    return;
  }

  monthData.projects = monthData.projects.filter((project) => {
    return project.id !== projectId;
  });

  monthData.employees.forEach((employee) => {
    if (!employee.assignments) {
      return;
    }

    employee.assignments = employee.assignments.filter((assignment) => {
      return assignment.projectId !== projectId;
    });
  });

  saveCurrentMonthData(monthData);

  renderProjectsTable(monthData);
  renderEmployeesTable(monthData);
}

function deleteEmployee(employeeId) {
  const monthData = getCurrentMonthData();

  const employeeToDelete = monthData.employees.find((employee) => {
    return employee.id === employeeId;
  });

  if (!employeeToDelete) {
    return;
  }

  const isConfirmed = confirm(
    `Are you sure you want to delete employee "${employeeToDelete.name} ${employeeToDelete.surname}"?`,
  );

  if (!isConfirmed) {
    return;
  }

  monthData.employees = monthData.employees.filter((employee) => {
    return employee.id !== employeeId;
  });

  saveCurrentMonthData(monthData);

  renderProjectsTable(monthData);
  renderEmployeesTable(monthData);
}

projectsTable.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".delete-project-btn");

  if (!deleteButton) {
    return;
  }

  const projectId = deleteButton.dataset.projectId;

  deleteProject(projectId);
});

employeesTable.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".delete-employee-btn");

  if (!deleteButton) {
    return;
  }

  const employeeId = deleteButton.dataset.employeeId;

  deleteEmployee(employeeId);
});

