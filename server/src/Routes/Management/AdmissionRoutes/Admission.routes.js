import express from "express";

import addStudent from "../../../Controllers/Management/Admission/AdmissionPostMethods.Controllers.js";
import getStudents from "../../../Controllers/Management/Admission/AdmissionGetMethods.controllers.js";
import getSingleStudent from "../../../Controllers/Management/Admission/AdmissionGetSingleMethods.controllers.js";
import updateStudent from "../../../Controllers/Management/Admission/AdmissionPutMethods.Controllers.js";
import deleteStudent from "../../../Controllers/Management/Admission/AdmissionDeleteMethods.Controllers.js";

const router = express.Router();

// CREATE
router.post("/create", addStudent);

// GET ALL
router.get("/all", getStudents);

// GET SINGLE
router.get("/:studentId", getSingleStudent);

// UPDATE
router.put("/:studentId", updateStudent);

// DELETE (SOFT DELETE)
router.delete("/:studentId", deleteStudent);

export default router;
