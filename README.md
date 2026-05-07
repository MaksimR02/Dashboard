# Dashboard

Dashboard is a web application for managing outsourcing projects, employees, project assignments, vacations, and financial calculations.

The application stores data separately for each selected month and year. Users can add, edit, delete, sort, filter and manage projects and employees. All data is saved in `localStorage`.

## Features

- Projects table
- Employees table
- Month and year period selection
- Separate data for each selected period
- Add, edit and delete projects
- Add, edit and delete employees
- Assign employees to projects
- Set assignment capacity and fit
- Remove project assignments
- Show employees assigned to a project
- Add employee vacation days
- Vacation coefficient in calculations
- Project financial calculations
- Employee payment calculations
- Total estimated income calculation
- Sorting for Projects and Employees tables
- Filtering for Projects and Employees tables
- Form validation
- Data persistence with `localStorage`

## Technologies

- HTML
- CSS
- JavaScript
- ES Modules
- LocalStorage

## Project Structure

```text
src/
├── js/
│   ├── config/
│   │   └── constants.js
│   ├── data/
│   │   └── sampleData.js
│   ├── services/
│   │   └── seedService.js
│   ├── state/
│   │   └── appState.js
│   ├── storage/
│   │   └── storage.js
│   ├── ui/
│   │   ├── renderProjectsTable.js
│   │   └── renderEmployeesTable.js
│   ├── utils/
│   │   └── calculations.js
│   └── main.js
└── styles/
    ├── main.css
    ├── mainContent.css
    ├── modal.css
    ├── reset.css
    ├── sidePanel.css
    └── variables.css
```

## Data Storage

The app stores data in `localStorage` using the key:

```js
monthlyData
```

Data is stored separately for each selected period.

Example:

```js
{
  "2026-0": {
    projects: [],
    employees: []
  },
  "2026-1": {
    projects: [],
    employees: []
  }
}
```

The key format is:

```text
year-month
```

Example:

```text
2026-0
```

where `0` means January.

## Main Entities

### Project

```js
{
  id: "project-1",
  companyName: "TechCorp",
  projectName: "E-Commerce Platform",
  budget: 12500,
  employeeCapacity: 3
}
```

### Employee

```js
{
  id: "employee-1",
  name: "Alex",
  surname: "Turner",
  dateOfBirth: "1990-03-14",
  position: "Senior Developer",
  salary: 4500,
  vacationDays: 0,
  assignments: []
}
```

### Assignment

```js
{
  projectId: "project-1",
  capacity: 1,
  fit: 0.9
}
```

## Calculations

### Effective Capacity

Effective capacity is calculated using:

```text
capacity * fit * vacationCoefficient
```

### Vacation Coefficient

Vacation coefficient is calculated based on the selected month:

```text
(daysInMonth - vacationDays) / daysInMonth
```

Example:

```text
30 days in month
6 vacation days

(30 - 6) / 30 = 0.8
```

### Assignment Cost

Assignment cost is calculated using:

```text
salary * max(0.5, capacity)
```

This means that the minimum payment capacity is `0.5`.

### Project Estimated Income

Project estimated income is calculated as:

```text
revenue - cost
```

### Employee Estimated Payment

Employee estimated payment is calculated from assignment costs.

If an employee has no assignments, the app uses bench payment:

```text
salary * 0.5
```

### Total Estimated Income

Total estimated income is calculated from all project incomes and bench payments for employees without assignments.

## Validation

The app validates form data before saving it to `localStorage`.

Validation includes:

- Required text fields
- Minimum and maximum text length
- Text fields must contain letters
- Positive budget value
- Positive salary value
- Valid employee age
- Assignment capacity from `0.1` to `1`
- Assignment fit from `0.1` to `1`
- Vacation days limited by selected month length

## How to Run Locally

Clone the repository:

```bash
git clone https://github.com/MaksimR02/Dashboard.git
```

Open the project folder:

```bash
cd Dashboard
```

Run the project with a local server.

For example, using VS Code Live Server:

```text
Right click index.html → Open with Live Server
```

The app should be opened through a local server because it uses JavaScript modules.

## Usage

1. Select month and year.
2. Click `Seed Data` to add sample projects and employees.
3. Add, edit or delete projects.
4. Add, edit or delete employees.
5. Assign employees to projects.
6. Set capacity and fit for assignments.
7. Add vacation days for employees.
8. Use sorting and filtering to work with table data.
9. Check calculated income and payments.

## Deployment

Deployment link:

```text
Add deployment link here
```

## Author

MaksimR02