import {
  calculateEmployeeEstimatedPayment,
  calculateEmployeeProjectedIncome,
} from "../utils/calculations.js";

function getAge(dateOfBirth) {
  const birthDate = new Date(dateOfBirth);
  const currentDate = new Date();

  let age = currentDate.getFullYear() - birthDate.getFullYear();

  const isBirthdayNotPassed =
    currentDate.getMonth() < birthDate.getMonth() ||
    (currentDate.getMonth() === birthDate.getMonth() &&
      currentDate.getDate() < birthDate.getDate());

  if (isBirthdayNotPassed) {
    age -= 1;
  }

  return age;
}

function formatMoney(value) {
  return `$${Number(value).toFixed(2)}`;
}

function getEmployeeSortValue(employee, sortBy, monthData) {
  if (sortBy === "name") {
    return employee.name.toLowerCase();
  }

  if (sortBy === "surname") {
    return employee.surname.toLowerCase();
  }

  if (sortBy === "age") {
    return getAge(employee.dateOfBirth);
  }

  if (sortBy === "position") {
    return employee.position.toLowerCase();
  }

  if (sortBy === "salary") {
    return employee.salary;
  }

  if (sortBy === "estimatedPayment") {
    return calculateEmployeeEstimatedPayment(employee);
  }

  if (sortBy === "project") {
    const employeeProjects = getEmployeeProjects(employee, monthData.projects);

    return employeeProjects
      .map((project) => project.projectName.toLowerCase())
      .join(", ");
  }

  if (sortBy === "projectedIncome") {
    return calculateEmployeeProjectedIncome(employee, monthData);
  }

  return "";
}

function sortEmployees(employees, sortState, monthData) {
  const sortedEmployees = [...employees];

  if (!sortState.sortBy) {
    return sortedEmployees;
  }

  sortedEmployees.sort((firstEmployee, secondEmployee) => {
    const firstValue = getEmployeeSortValue(
      firstEmployee,
      sortState.sortBy,
      monthData,
    );

    const secondValue = getEmployeeSortValue(
      secondEmployee,
      sortState.sortBy,
      monthData,
    );

    const direction = sortState.sortDirection === "asc" ? 1 : -1;

    if (typeof firstValue === "string") {
      return firstValue.localeCompare(secondValue) * direction;
    }

    return (firstValue - secondValue) * direction;
  });

  return sortedEmployees;
}

function filterEmployees(employees, filters, monthData) {
  return employees.filter((employee) => {
    const name = employee.name.toLowerCase();
    const surname = employee.surname.toLowerCase();
    const position = employee.position.toLowerCase();

    const employeeProjects = getEmployeeProjects(employee, monthData.projects);

    const projectNames = employeeProjects
      .map((project) => project.projectName.toLowerCase())
      .join(", ");

    const nameMatches = name.includes(filters.name);
    const surnameMatches = surname.includes(filters.surname);
    const positionMatches = position.includes(filters.position);
    const projectMatches = projectNames.includes(filters.project);

    return (
      nameMatches &&
      surnameMatches &&
      positionMatches &&
      projectMatches
    );
  });
}

function getEmployeeProjects(employee, projects) {
  const employeeProjects = [];

  if (!employee.assignments) {
    return employeeProjects;
  }

  employee.assignments.forEach((assignment) => {
    const project = projects.find(
      (project) => project.id === assignment.projectId,
    );

    if (project) {
      employeeProjects.push(project);
    }
  });

  return employeeProjects;
}

export function renderEmployeesTable(monthData, sortState = {}) {
  const tableBody = document.querySelector("#employees-table tbody");

  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = "";

  const filteredEmployees = filterEmployees(
  monthData.employees,
  sortState.filters,
  monthData,
);

const employeesToRender = sortEmployees(
  filteredEmployees,
  sortState,
  monthData,
);

employeesToRender.forEach((employee) => {
    const employeeProjects = getEmployeeProjects(employee, monthData.projects);

    let projectNames = "-";

    if (employeeProjects.length > 0) {
      projectNames = "";

      employeeProjects.forEach((project) => {
        projectNames += `
      <span class="employee-project-tag">
        ${project.projectName}
        <button
          type="button"
          class="remove-assignment-btn"
          data-employee-id="${employee.id}"
          data-project-id="${project.id}"
        >
          ×
        </button>
      </span>
    `;
      });
    }

    const estimatedPayment = calculateEmployeeEstimatedPayment(employee);
    const projectedIncome = calculateEmployeeProjectedIncome(
      employee,
      monthData,
    );

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${employee.name}</td>
      <td>${employee.surname}</td>
      <td>${getAge(employee.dateOfBirth)}</td>
      <td>${employee.position}</td>
      <td>${formatMoney(employee.salary)}</td>
      <td>${formatMoney(estimatedPayment)}</td>
      <td>${projectNames}</td>
      <td>${formatMoney(projectedIncome)}</td>
      <td>
        <button
          type="button"
          class="vacation-btn employee-vacation-btn"
          data-employee-id="${employee.id}"
        >
          Vacation
        </button>

        <button
          type="button"
          class="assign-btn assign-project-btn"
          data-employee-id="${employee.id}"
        >
          Assign Project
        </button>

        <button
          type="button"
          class="edit-btn edit-employee-btn"
          data-employee-id="${employee.id}"
        >
          Edit
        </button>

        <button
          type="button"
          class="delete-btn delete-employee-btn"
          data-employee-id="${employee.id}"
        >
          Delete
        </button>
      </td>
    `;

    tableBody.append(row);
  });
}
