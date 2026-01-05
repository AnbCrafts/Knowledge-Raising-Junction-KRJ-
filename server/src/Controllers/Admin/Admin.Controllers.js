import {
  createAdmin,
  getAdminProfile,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
} from "./Profile/AdminProfile.Controllers.js";

import { registerStudent } from "./Student/StudentRegistration.Controllers.js";
import { registerEmployee } from "./Employee/EmployeeRegistration.Controllers.js";
import { registerTeacher } from "./Teacher/TeacherRegistration.Controllers.js";

import {
  getAllStudents,
  getStudentProfile,
  updateStudent,
} from "./Student/StudentManagement.Controllers.js";
import {
  getAllEmployees,
  getEmployeeProfile,
  updateEmployee,
} from "./Employee/EmployeeManagement.Controllers.js";
import {
  getAllTeachers,
  getTeacherProfile,
  updateTeacher,
} from "./Teacher/TeacherManagement.Controllers.js";

export {
  // Profile
  createAdmin,
  getAdminProfile,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  // Registration
  registerStudent,
  registerEmployee,
  registerTeacher,
  // Management (View & Update)
  getAllStudents,
  getStudentProfile,
  updateStudent,
  getAllEmployees,
  getEmployeeProfile,
  updateEmployee,
  getAllTeachers,
  getTeacherProfile,
  updateTeacher,
};
