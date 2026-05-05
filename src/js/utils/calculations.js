function getVacationCoefficient(employee, assignment, monthData) {
  return 1;
}

const MIN_PAYMENT_CAPACITY = 0.5;

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

function getAssignmentCost(employee, assignment) {
  return employee.salary * Math.max(MIN_PAYMENT_CAPACITY, assignment.capacity);
}

export function calculateProjectFinancials(project, monthData) {
  const projectAssignments = getProjectAssignments(
    project.id,
    monthData.employees,
  );

  let usedCapacity = 0;
  let cost = 0;

  projectAssignments.forEach(({employee, assignment}) => {
    const effectiveCapacity =  getAssignmentEffectiveCapacity(employee, assignment, monthData);
    const assignmentCost = getAssignmentCost(employee, assignment);
  
    usedCapacity += effectiveCapacity;
    cost += assignmentCost;
  });


  const capacityForRevenue = Math.max(project.employeeCapacity, usedCapacity);
  const revenuePerCapacity = project.budget / capacityForRevenue;
  const revenue = revenuePerCapacity * usedCapacity;
  const income = revenue - cost;


  return {
    usedCapacity,
    revenue,
    cost,
    income,
  };
}

export function calculateTotalEstimatedIncome(monthData) {
  let totalEstimatedIncome = 0;

  monthData.projects.forEach((project) => {
    const projectFinancials = calculateProjectFinancials(project, monthData);

    totalEstimatedIncome += projectFinancials.income;
  });

  monthData.employees.forEach((employee) => {
    if (!employee.assignments || employee.assignments.length === 0) {
      totalEstimatedIncome -= employee.salary * MIN_PAYMENT_CAPACITY;
    }
  });

  return totalEstimatedIncome;
}

export function calculateEmployeeEstimatedPayment(employee) {
  if (!employee.assignments || employee.assignments.length === 0) {
    return employee.salary * MIN_PAYMENT_CAPACITY;
  }

  let estimatedPayment = 0;

  employee.assignments.forEach((assignment) => {
    const assignmentCost = getAssignmentCost(employee, assignment);

    estimatedPayment += assignmentCost;
  });

  return estimatedPayment;
}

export function calculateEmployeeProjectedIncome(employee, monthData) {
  if (!employee.assignments || employee.assignments.length === 0) {
    return 0;
  }

  let projectedIncome = 0;

  employee.assignments.forEach((assignment) => {
    const project = monthData.projects.find(
      (project) => project.id === assignment.projectId,
    );

    if (!project) {
      return;
    }

    const projectFinancials = calculateProjectFinancials(project, monthData);

    const capacityForRevenue = Math.max(
      project.employeeCapacity,
      projectFinancials.usedCapacity,
    );

    const revenuePerCapacity = project.budget / capacityForRevenue;

    const effectiveCapacity = getAssignmentEffectiveCapacity(
      employee,
      assignment,
      monthData,
    );

    const assignmentRevenue = revenuePerCapacity * effectiveCapacity;
    const assignmentCost = getAssignmentCost(employee, assignment);
    const assignmentProfit = assignmentRevenue - assignmentCost;

    projectedIncome += assignmentProfit;
  });

  return projectedIncome;
}