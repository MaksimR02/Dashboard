function getVacationCoefficient(employee, assignment, monthData) {
  return 1;
}

export function getAssignmentEffectiveCapacity(
  employee,
  assignment,
  monthData,
) {
  const vacationCoefficient = getVacationCoefficient(
    employee,
    assignment,
    monthData,
  );

  return assignment.capacity * assignment.fit * vacationCoefficient;
}

export function getProjectAssignments(projectId, employees) {
  const projectAssignments = [];

  employees.forEach((employee) => {
    if (!employee.assignments) {
      return;
    }

    employee.assignments.forEach((assignment) => {
      if (assignment.projectId === projectId) {
        projectAssignments.push({ employee, assignment });
      }
    });
  });

  return projectAssignments;
}