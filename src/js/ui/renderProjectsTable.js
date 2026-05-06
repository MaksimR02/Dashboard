import {
  calculateProjectFinancials,
  calculateTotalEstimatedIncome,
} from "../utils/calculations.js";

function getAssignedEmployees(projectId, employees) {
  const assignedEmployees = [];

  employees.forEach((employee) => {
    if (!employee.assignments) {
      return;
    }

    employee.assignments.forEach((assignment) => {
      if (assignment.projectId === projectId) {
        assignedEmployees.push(employee);
      }
    });
  });

  return assignedEmployees;
}

function formatMoney(value) {
  return `$${Number(value).toFixed(2)}`;
}

function getProjectSortValue(project, sortBy, monthData) {
  const projectFinancials = calculateProjectFinancials(project, monthData);

  if (sortBy === "companyName") {
    return project.companyName.toLowerCase();
  }

  if (sortBy === "projectName") {
    return project.projectName.toLowerCase();
  }

  if (sortBy === "budget") {
    return project.budget;
  }

  if (sortBy === "employeeCapacity") {
    return project.employeeCapacity;
  }

  if (sortBy === "estimatedIncome") {
    return projectFinancials.income;
  }

  return "";
}

function sortProjects(projects, sortState, monthData) {
  const sortedProjects = [...projects];

  if (!sortState.sortBy) {
    return sortedProjects;
  }

  sortedProjects.sort((firstProject, secondProject) => {
    const firstValue = getProjectSortValue(
      firstProject,
      sortState.sortBy,
      monthData,
    );

    const secondValue = getProjectSortValue(
      secondProject,
      sortState.sortBy,
      monthData,
    );

    const direction = sortState.sortDirection === "asc" ? 1 : -1;

    if (typeof firstValue === "string") {
      return firstValue.localeCompare(secondValue) * direction;
    }

    return (firstValue - secondValue) * direction;
  });

  return sortedProjects;
}

function filterProjects(projects, filters) {
  return projects.filter((project) => {
    const companyName = project.companyName.toLowerCase();
    const projectName = project.projectName.toLowerCase();

    const companyNameMatches = companyName.includes(filters.companyName);
    const projectNameMatches = projectName.includes(filters.projectName);

    return companyNameMatches && projectNameMatches;
  });
}


export function renderProjectsTable(monthData, sortState = {}) {
  const tableBody = document.querySelector("#projects-table tbody");

  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = "";

    

  const filteredProjects = filterProjects(
  monthData.projects,
  sortState.filters,
);

const projectsToRender = sortProjects(
  filteredProjects,
  sortState,
  monthData,
);

projectsToRender.forEach((project) => {
    const assignedEmployees = getAssignedEmployees(
      project.id,
      monthData.employees,
    );
    const projectFinancials = calculateProjectFinancials(project, monthData);

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${project.companyName}</td>
      <td>${project.projectName}</td>
      <td>${formatMoney(project.budget)}</td>
      <td>${projectFinancials.usedCapacity.toFixed(1)} / ${project.employeeCapacity}</td>
      <td>
        <button
          type="button"
          class="show-employees-btn"
          data-project-id="${project.id}"
        >
          Show Employees (${assignedEmployees.length})
        </button>
      </td>
      <td>${formatMoney(projectFinancials.income)}</td>
      <td>
        <button
          type="button"
          class="edit-btn edit-project-btn"
          data-project-id="${project.id}">
            Edit
        </button>

        <button
          type="button"
          class="delete-btn delete-project-btn"
          data-project-id="${project.id}">
            Delete
        </button>
      </td>
    `;

    tableBody.append(row);
  });

  const totalIncomeElement = document.querySelector(
    "#projects-total-income .total-amount",
  );

  if (totalIncomeElement) {
    const totalEstimatedIncome = calculateTotalEstimatedIncome(monthData);

    totalIncomeElement.textContent = formatMoney(totalEstimatedIncome);
  }
}
