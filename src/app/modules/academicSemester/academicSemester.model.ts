import { Schema, model } from "mongoose";
import { IAcademicSemester } from "./academicSemester.interface";
import {
  academicSemesterCodes,
  academicSemesterMonths,
  academicSemesterTitles,
} from "./academicSemester.constant";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";

const academicSemesterSchema = new Schema<IAcademicSemester>(
  {
    title: {
      type: String,
      required: true,
      enum: academicSemesterTitles,
    },
    year: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      enum: academicSemesterCodes,
    },
    startMonth: {
      type: String,
      required: true,
      enum: academicSemesterMonths,
    },
    endMonth: {
      type: String,
      required: true,
      enum: academicSemesterMonths,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

//Handling Same Year and same semester title issue, can't redeclare same semester in the same year. It should be create above model.
academicSemesterSchema.pre("save", async function (next) {
  const isExist = await AcademicSemester.findOne({
    title: this.title,
    year: this.year,
  });
  if (isExist) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Academic semester is already exist !"
    );
  }
  next();
});

export const AcademicSemester = model<IAcademicSemester>(
  "AcademicSemester",
  academicSemesterSchema
);
