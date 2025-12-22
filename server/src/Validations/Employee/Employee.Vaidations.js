import Joi from "joi";

/* ------------------ COMMON HELPERS ------------------ */

export const objectId = Joi.string().hex().length(24).messages({
  "string.base": "ID must be a string",
  "string.hex": "ID must be a valid hexadecimal value",
  "string.length": "ID must be a valid 24-character ObjectId",
});

export const dateField = Joi.date().messages({
  "date.base": "Value must be a valid date",
});

export const booleanField = Joi.boolean().messages({
  "boolean.base": "Value must be true or false",
});

export const positiveNumber = Joi.number().min(0).messages({
  "number.base": "Value must be a number",
  "number.min": "Value cannot be negative",
});

/* ------------------ CORE REFERENCES ------------------ */

export const userId = objectId.required().messages({
  "any.required": "User ID is required for employee profile",
});

export const idCard = objectId.required().messages({
  "any.required": "ID card reference is required",
});

/* ------------------ BASIC EMPLOYEE INFO ------------------ */

export const employeeCode = Joi.string().trim().min(3).max(30).messages({
  "string.base": "Employee code must be a string",
  "string.empty": "Employee code is required",
  "string.min": "Employee code must be at least 3 characters long",
  "string.max": "Employee code must not exceed 30 characters",
});

export const designation = Joi.string().trim().min(2).max(50).messages({
  "string.base": "Designation must be a string",
  "string.empty": "Designation is required",
  "string.min": "Designation must be at least 2 characters long",
  "string.max": "Designation must not exceed 50 characters",
});

export const department = Joi.string().trim().min(2).max(50).messages({
  "string.base": "Department must be a string",
  "string.empty": "Department is required",
  "string.min": "Department must be at least 2 characters long",
  "string.max": "Department must not exceed 50 characters",
});

/* ------------------ BRANCH & ATTENDANCE ------------------ */

export const branches = Joi.array().items(objectId).min(1).messages({
  "array.base": "Branches must be an array of branch IDs",
  "array.min": "At least one branch must be assigned",
});

export const attendance = Joi.array().items(objectId).messages({
  "array.base": "Attendance must be an array of attendance IDs",
});

export const holidays = Joi.array().items(objectId).messages({
  "array.base": "Holidays must be an array of leave IDs",
});

/* ------------------ EMPLOYMENT DETAILS ------------------ */

export const employmentType = Joi.string()
  .valid("FULL_TIME", "PART_TIME", "CONTRACT")
  .messages({
    "any.only": "Employment type must be FULL_TIME, PART_TIME, or CONTRACT",
  });

export const joiningDate = dateField.required().messages({
  "any.required": "Joining date is required",
});

export const exitDate = dateField.allow(null).messages({
  "date.base": "Exit date must be a valid date",
});

export const status = Joi.string()
  .valid("ACTIVE", "ON_LEAVE", "RESIGNED", "TERMINATED")
  .messages({
    "any.only":
      "Status must be ACTIVE, ON_LEAVE, RESIGNED, or TERMINATED",
  });

/* ------------------ PREVIOUS EMPLOYMENT ------------------ */

export const previousEmployment = Joi.array().items(
  Joi.object({
    organization: Joi.string().trim().max(100).messages({
      "string.base": "Organization name must be a string",
      "string.max": "Organization name must not exceed 100 characters",
    }),
    role: Joi.string().trim().max(100).messages({
      "string.base": "Role must be a string",
      "string.max": "Role must not exceed 100 characters",
    }),
    startDate: dateField,
    endDate: dateField,
    referenceContact: Joi.string().trim().max(50).messages({
      "string.base": "Reference contact must be a string",
      "string.max": "Reference contact must not exceed 50 characters",
    }),
  })
).messages({
  "array.base": "Previous employment must be an array",
});

/* ------------------ PAYROLL ------------------ */

export const salaryType = Joi.string()
  .valid("MONTHLY", "HOURLY", "PER_CLASS")
  .messages({
    "any.only": "Salary type must be MONTHLY, HOURLY, or PER_CLASS",
  });

export const receivedPayRolls = Joi.array().items(objectId).messages({
  "array.base": "Received payrolls must be an array of payment IDs",
});

export const salaryAmount = positiveNumber.messages({
  "number.base": "Salary amount must be a number",
});

/* ------------------ BANK DETAILS ------------------ */

export const bankDetails = Joi.object({
  accountHolderName: Joi.string().trim().max(100).messages({
    "string.base": "Account holder name must be a string",
    "string.max": "Account holder name must not exceed 100 characters",
  }),
  accountNumber: Joi.string().trim().max(30).messages({
    "string.base": "Account number must be a string",
    "string.max": "Account number must not exceed 30 characters",
  }),
  bankName: Joi.string().trim().max(100).messages({
    "string.base": "Bank name must be a string",
    "string.max": "Bank name must not exceed 100 characters",
  }),
  ifscCode: Joi.string().trim().pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/).messages({
    "string.pattern.base": "IFSC code must be a valid Indian IFSC code",
  }),
}).messages({
  "object.base": "Bank details must be an object",
});

/* ------------------ DOCUMENTS ------------------ */

export const documents = Joi.object({
  idProof: Joi.string().uri().messages({
    "string.uri": "ID proof must be a valid URL",
  }),
  addressProof: Joi.string().uri().messages({
    "string.uri": "Address proof must be a valid URL",
  }),
  resume: Joi.string().uri().messages({
    "string.uri": "Resume must be a valid URL",
  }),
  offerLetter: Joi.string().uri().messages({
    "string.uri": "Offer letter must be a valid URL",
  }),
  certificates: Joi.array().items(
    Joi.string().uri().messages({
      "string.uri": "Certificate must be a valid URL",
    })
  ),
}).messages({
  "object.base": "Documents must be an object",
});

/* ------------------ STATUS & META ------------------ */

export const isVerified = booleanField;
export const experienceYears = positiveNumber.messages({
  "number.base": "Experience years must be a number",
});

export const remarks = Joi.string().max(500).allow("").messages({
  "string.base": "Remarks must be a string",
  "string.max": "Remarks must not exceed 500 characters",
});

export const availableToday = booleanField;

export const createdBy = objectId.messages({
  "any.only": "Invalid createdBy admin reference",
});

export const updatedBy = objectId.messages({
  "any.only": "Invalid updatedBy admin reference",
});

export const deletedAt = dateField.allow(null).messages({
  "date.base": "DeletedAt must be a valid date",
});
