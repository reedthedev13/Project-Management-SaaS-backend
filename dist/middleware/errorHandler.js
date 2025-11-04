"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const errorHandler = (err, req, res, next) => {
    console.error("Global error caught:", err);
    if (err instanceof zod_1.ZodError) {
        // Use .issues instead of .errors
        return res.status(400).json({
            message: "Validation error",
            details: err.issues, // <-- corrected
        });
    }
    // Handle custom AppError (if you use one)
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            message: err.message,
            details: err.errors || null,
        });
    }
    // Fallback for unexpected errors
    res.status(500).json({
        message: "Internal Server Error",
    });
};
exports.errorHandler = errorHandler;
