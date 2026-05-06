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

const projectModalTitle = document.querySelector("#project-modal .modal-header h2");
const projectSubmitButton = projectForm.querySelector(".primary-btn");

let editingProjectId = null;

const employeeModalTitle = document.querySelector(
  "#employee-modal .modal-header h2",
);
const employeeSubmitButton = employeeForm.querySelector(".primary-btn");

let editingEmployeeId = null;

const assignmentModal = document.querySelector("#assignment-modal");
const assignmentForm = document.querySelector("#assignment-form");
const closeAssignmentModalButton = document.querySelector(
  "#close-assignment-modal-btn",
);
const cancelAssignmentModalButton = document.querySelector(
  "#cancel-assignment-modal-btn",
);
const assignmentProjectSelect = document.querySelector("#assignment-project");
const assignmentCapacityInput = document.querySelector("#assignment-capacity");
const assignmentFitInput = document.querySelector("#assignment-fit");

let assigningEmployeeId = null;




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

function openEditProjectModal(project) {
  editingProjectId = project.id;

  projectModalTitle.textContent = "Edit Project";
  projectSubmitButton.textContent = "Save Changes";

  projectCompanyNameInput.value = project.companyName;
  projectNameInput.value = project.projectName;
  projectBudgetInput.value = project.budget;
  projectEmployeeCapacityInput.value = project.employeeCapacity;

  projectModal.classList.remove("hidden");
}

function closeProjectModal() {
  projectModal.classList.add("hidden");
  projectForm.reset();

  editingProjectId = null;
  projectModalTitle.textContent = "Add Project";
  projectSubmitButton.textContent = "Save Project";
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

  const projectData = {
    companyName: projectCompanyNameInput.value.trim(),
    projectName: projectNameInput.value.trim(),
    budget: Number(projectBudgetInput.value),
    employeeCapacity: Number(projectEmployeeCapacityInput.value),
  };

  if (!projectData.companyName || !projectData.projectName) {
    return;
  }

  if (editingProjectId) {
    const projectToUpdate = monthData.projects.find((project) => {
      return project.id === editingProjectId;
    });

    if (!projectToUpdate) {
      return;
    }

    projectToUpdate.companyName = projectData.companyName;
    projectToUpdate.projectName = projectData.projectName;
    projectToUpdate.budget = projectData.budget;
    projectToUpdate.employeeCapacity = projectData.employeeCapacity;
  } else {
    const newProject = {
      id: createProjectId(),
      ...projectData,
    };

    monthData.projects.push(newProject);
  }

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

  editingEmployeeId = null;
  employeeModalTitle.textContent = "Add Employee";
  employeeSubmitButton.textContent = "Save Employee";
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

  const employeeData = {
    name: employeeNameInput.value.trim(),
    surname: employeeSurnameInput.value.trim(),
    dateOfBirth: employeeDateOfBirthInput.value,
    position: employeePositionInput.value,
    salary: Number(employeeSalaryInput.value),
  };

  if (!employeeData.name || !employeeData.surname || !employeeData.position) {
    return;
  }

  if (editingEmployeeId) {
    const employeeToUpdate = monthData.employees.find((employee) => {
      return employee.id === editingEmployeeId;
    });

    if (!employeeToUpdate) {
      return;
    }

    employeeToUpdate.name = employeeData.name;
    employeeToUpdate.surname = employeeData.surname;
    employeeToUpdate.dateOfBirth = employeeData.dateOfBirth;
    employeeToUpdate.position = employeeData.position;
    employeeToUpdate.salary = employeeData.salary;
  } else {
    const newEmployee = {
      id: createEmployeeId(),
      ...employeeData,
      assignments: [],
    };

    monthData.employees.push(newEmployee);
  }

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
  const editButton = event.target.closest(".edit-project-btn");

  if (editButton) {
    const projectId = editButton.dataset.projectId;

    startEditProject(projectId);
    return;
  }

  const deleteButton = event.target.closest(".delete-project-btn");

  if (deleteButton) {
    const projectId = deleteButton.dataset.projectId;

    deleteProject(projectId);
  }
});

employeesTable.addEventListener("click", (event) => {
  const removeAssignmentButton = event.target.closest(".remove-assignment-btn");

  if (removeAssignmentButton) {
    const employeeId = removeAssignmentButton.dataset.employeeId;
    const projectId = removeAssignmentButton.dataset.projectId;

    removeAssignment(employeeId, projectId);
    return;
  }

  const assignButton = event.target.closest(".assign-project-btn");

  if (assignButton) {
    const employeeId = assignButton.dataset.employeeId;

    openAssignmentModal(employeeId);
    return;
  }

  const editButton = event.target.closest(".edit-employee-btn");

  if (editButton) {
    const employeeId = editButton.dataset.employeeId;

    startEditEmployee(employeeId);
    return;
  }

  const deleteButton = event.target.closest(".delete-employee-btn");

  if (deleteButton) {
    const employeeId = deleteButton.dataset.employeeId;

    deleteEmployee(employeeId);
  }
});

function startEditProject(projectId) {
  const monthData = getCurrentMonthData();

  const projectToEdit = monthData.projects.find((project) => {
    return project.id === projectId;
  });

  if (!projectToEdit) {
    return;
  }

  openEditProjectModal(projectToEdit);
}

function openEditEmployeeModal(employee) {
  editingEmployeeId = employee.id;

  employeeModalTitle.textContent = "Edit Employee";
  employeeSubmitButton.textContent = "Save Changes";

  employeeNameInput.value = employee.name;
  employeeSurnameInput.value = employee.surname;
  employeeDateOfBirthInput.value = employee.dateOfBirth;
  employeePositionInput.value = employee.position;
  employeeSalaryInput.value = employee.salary;

  employeeModal.classList.remove("hidden");
}

function startEditEmployee(employeeId) {
  const monthData = getCurrentMonthData();

  const employeeToEdit = monthData.employees.find((employee) => {
    return employee.id === employeeId;
  });

  if (!employeeToEdit) {
    return;
  }

  openEditEmployeeModal(employeeToEdit);
}

function openAssignmentModal(employeeId) {
  const monthData = getCurrentMonthData();

  assigningEmployeeId = employeeId;

  renderAssignmentProjectOptions(monthData.projects);

  assignmentModal.classList.remove("hidden");
}

function closeAssignmentModal() {
  assignmentModal.classList.add("hidden");
  assignmentForm.reset();

  assigningEmployeeId = null;
}

closeAssignmentModalButton.addEventListener("click", () => {
  closeAssignmentModal();
});

cancelAssignmentModalButton.addEventListener("click", () => {
  closeAssignmentModal();
});

assignmentModal.addEventListener("click", (event) => {
  if (event.target === assignmentModal) {
    closeAssignmentModal();
  }
});

function renderAssignmentProjectOptions(projects) {
  assignmentProjectSelect.innerHTML = `
    <option value="">Select project</option>
  `;

  projects.forEach((project) => {
    const option = document.createElement("option");

    option.value = project.id;
    option.textContent = project.projectName;

    assignmentProjectSelect.append(option);
  });
}


assignmentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const monthData = getCurrentMonthData();

  const employeeToAssign = monthData.employees.find((employee) => {
    return employee.id === assigningEmployeeId;
  });

  if (!employeeToAssign) {
    return;
  }

  const assignmentData = {
    projectId: assignmentProjectSelect.value,
    capacity: Number(assignmentCapacityInput.value),
    fit: Number(assignmentFitInput.value),
  };

  if (!assignmentData.projectId) {
    return;
  }

  if (!employeeToAssign.assignments) {
    employeeToAssign.assignments = [];
  }

  const existingAssignment = employeeToAssign.assignments.find((assignment) => {
    return assignment.projectId === assignmentData.projectId;
  });

  if (existingAssignment) {
    existingAssignment.capacity = assignmentData.capacity;
    existingAssignment.fit = assignmentData.fit;
  } else {
    employeeToAssign.assignments.push(assignmentData);
  }

  saveCurrentMonthData(monthData);

  renderProjectsTable(monthData);
  renderEmployeesTable(monthData);

  closeAssignmentModal();
});

function removeAssignment(employeeId, projectId) {
  const monthData = getCurrentMonthData();

  const employeeToUpdate = monthData.employees.find((employee) => {
    return employee.id === employeeId;
  });

  if (!employeeToUpdate || !employeeToUpdate.assignments) {
    return;
  }

  employeeToUpdate.assignments = employeeToUpdate.assignments.filter((assignment) => {
    return assignment.projectId !== projectId;
  });

  saveCurrentMonthData(monthData);

  renderProjectsTable(monthData);
  renderEmployeesTable(monthData);
}