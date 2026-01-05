import Joi from "joi";
import { booleanField, dateField, objectId } from "../Common/Common.Validations.js";

export const studentQueryValidationSchema = Joi.object({
  branchId: objectId.optional(),
  teacherId: objectId.optional(),
  status: Joi.string().valid("ACTIVE", "LEFT", "INACTIVE").optional(),

  from: dateField.optional(),
  to: dateField.optional(),

  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),

  sortBy: Joi.string().valid("createdAt", "fatherName").optional(),
  order: Joi.string().valid("asc", "desc").optional(),
});
