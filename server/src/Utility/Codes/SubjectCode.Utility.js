import CounterSchema from "../../Schema/Counter/Counter.Schema.js";
import { subjectCode } from "../../Validations/Subject/Subject.Validations.js";
import ApiError from "../Response/ErrorResponse.Utility.js";

export const generateSubjectCode = async ({
  year,
  initials,
  session
}) => {
  const counterKey = `SUBJECT_${year}_${initials}`;

  const counter = await CounterSchema.findOneAndUpdate(
    { key: counterKey },
    { $inc: { seq: 1 } },
    {
      new: true,
      upsert: true,
      session
    }
  );

  if (!counter) {
    throw new ApiError(500, "Failed to generate subject code");
  }

  const sequence = String(counter.seq).padStart(3, "0");
  const generatedCode = `KRJ-${year}-${initials}-${sequence}`;

  // ✅ FINAL SAFETY VALIDATION (IMPORTANT)
  const { error } = subjectCode.required().validate(generatedCode);

  if (error) {
    throw new ApiError(
      500,
      `Generated subject code is invalid: ${error.message}`
    );
  }

  return generatedCode;
};
