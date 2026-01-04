import Joi from "joi";

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

export const branches = Joi.array()
  .items(objectId.required())
  .min(1)
  .messages({
    "array.base": "Branches must be an array of branch IDs",
    "array.min": "At least one branch is required",
  });


export const name = Joi.string().trim().min(2).max(100).required().messages({
  "string.empty": "Batch name is required",
  "string.min": "Batch name must be at least 2 characters long",
  "string.max": "Batch name must not exceed 100 characters",
});

export const code = Joi.string()
  .trim()
  .pattern(/^KRJ-\d{4}-[A-Z0-9_]+$/)
  .messages({
    "string.base": "Batch code must be a string",
    "string.empty": "Batch code is required",
    "string.pattern.base":
      "Batch code must be in format KRJ-YYYY-BATCHNAME (e.g. KRJ-2025-A1)",
  });



export const startDate = dateField.required().messages({
  "any.required": "Batch start date is required",
});

export const endDate = dateField.messages({
  "date.base": "Batch end date must be a valid date",
});

export const mentors =Joi.array().items(objectId).messages({
  "array.base": "Mentors must be an array of teacher IDs",
}); 

export const createdBy = objectId.required().messages({
  "any.required": "Admin reference is required",
})


/* Capacities */
export const studentCapacity = positiveNumber.messages({
  "number.base": "Student capacity must be a number",
});

export const currentStudentCount = positiveNumber.messages({
  "number.base": "Current student count must be a number",
});

export const teacherCapacity = positiveNumber.messages({
  "number.base": "Teacher capacity must be a number",
});

export const currentTeacherCount = positiveNumber.messages({
  "number.base": "Current teacher count must be a number",
});

export const isActive = booleanField;

/* Relationships */
export const subjects = Joi.array().items(objectId).messages({
  "array.base": "Subjects must be an array of BatchSubject IDs",
}); 
export const students = Joi.array().items(objectId).messages({
  "array.base": "students must be an array of student IDs",
}); 

export const routine = Joi.array().items(objectId).messages({
  "array.base": "Routine must be an array of RoutineSlot IDs",
});

export const assignments = Joi.array().items(objectId).messages({
  "array.base": "Assignments must be an array of SlotBatchAssignment IDs",
});
export const batch = objectId.required().messages({
  "any.required": "Batch reference is required",
});

export const subject = objectId.required().messages({
  "any.required": "Subject reference is required",
});

export const primaryTeacher = objectId.allow(null).messages({
  "any.only": "Invalid primary teacher reference",
});

export const syllabusCompletionPercentage = Joi.number().min(0).max(100).messages({
  "number.base": "Syllabus completion must be a number",
  "number.min": "Syllabus completion cannot be less than 0%",
  "number.max": "Syllabus completion cannot exceed 100%",
});

export const status = Joi.string()
  .valid("ONGOING", "COMPLETED", "HOLD")
  .messages({
    "any.only": "Status must be ONGOING, COMPLETED, or HOLD",
  });
export const routineSlot = objectId.required().messages({
  "any.required": "Routine slot reference is required",
});

export const assignmentBatch = objectId.required().messages({
  "any.required": "Batch reference is required",
});
