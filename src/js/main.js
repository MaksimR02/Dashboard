import { getCurrentMonthData } from './storage/storage.js';

const currentMonthData = getCurrentMonthData();

console.log(currentMonthData);


const sidePanel = document.querySelector(".side-panel");
const toggleButton = document.querySelector("#toggle-button");
const openButton = document.querySelector("#open-button");

const projectContent = document.querySelector("#project-content");
const employeesContent = document.querySelector("#employees-content");
const employeesButton = document.querySelector("#nav-project-employees");
const projectButton = document.querySelector("#nav-project");

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
