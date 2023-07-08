/* eslint-disable no-undef */
// import winston from "winston";
import { createLogger, format, transports } from "winston";
const { combine, timestamp, label, printf } = format; // for formatting
import DailyRotateFile from "winston-daily-rotate-file";

import path from "path";

//- Custom Log Format
const myFormat = printf(({ level, message, label, timestamp }) => {
  const date = new Date(timestamp);
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // return ` ${timestamp}, [${label}] ${level}: ${message},`;
  return `${date.toDateString()} ${hour}:${minutes}:${seconds} - [${label}] ${level}: ${message},`;
});

// For info logger
const logger = createLogger({
  level: "info",
  format: combine(
    label({ label: "PH-DCH" }),
    timestamp(),
    myFormat
    // prettyPrint()
  ),
  transports: [
    new transports.Console(),

    new DailyRotateFile({
      // for daily-rotate-file
      filename: path.join(
        process.cwd(),
        "logs",
        "winston",
        "successes",
        "PH-DCH-%DATE%-success.log"
      ),
      datePattern: "YYYY-DD-MM-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

// For error logger
const errorLogger = createLogger({
  level: "error",
  format: combine(label({ label: "PH-DCH" }), timestamp(), myFormat),
  transports: [
    new transports.Console(),

    new DailyRotateFile({
      // for daily-rotate-file
      filename: path.join(
        process.cwd(),
        "logs",
        "winston",
        "errors",
        "PH-DCH-%DATE%-error.log"
      ),
      datePattern: "YYYY-DD-MM-HH",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

export { logger, errorLogger };
