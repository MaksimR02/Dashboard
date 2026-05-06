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

export function renderEmployeesTable(monthData) {
  const tableBody = document.querySelector("#employees-table tbody");

  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = "";

  monthData.employees.forEach((employee) => {
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
