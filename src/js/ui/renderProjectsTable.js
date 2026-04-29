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

function getUsedCapacity(projectId, employees) {
  let totalCapacity = 0;

  employees.forEach((employee) => {
    if (!employee.assignments) {
      return;
    }

    employee.assignments.forEach((assignment) => {
      if (assignment.projectId === projectId) {
        totalCapacity += assignment.capacity;
      }
    });
  });

  return totalCapacity;
}

function formatMoney(value) {
  return `$${Number(value).toFixed(2)}`;
}

export function renderProjectsTable(monthData) {
  const tableBody = document.querySelector('#projects-table tbody');

  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = '';

  monthData.projects.forEach((project) => {
    const assignedEmployees = getAssignedEmployees(project.id, monthData.employees);
    const usedCapacity = getUsedCapacity(project.id, monthData.employees);

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${project.companyName}</td>
      <td>${project.projectName}</td>
      <td>${formatMoney(project.budget)}</td>
      <td>${usedCapacity.toFixed(1)} / ${project.employeeCapacity}</td>
      <td>
        <button type="button" class="show-employees-btn">
          Show Employees (${assignedEmployees.length})
        </button>
      </td>
      <td>$0.00</td>
      <td>
        <button type="button" class="delete-btn">
          Delete
        </button>
      </td>
    `;

    tableBody.append(row);
  });
}