import { z } from "zod";

// Create user zod validation
const createUserZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({
      required_error: "Phone number is required",
    }),

    role: z.enum(["seller", "buyer"]),

    password: z.string().optional(),

    name: z.object({
      firstName: z.string({
        required_error: "First name is required",
      }),
      middleName: z.string().optional(),
      lastName: z.string({
        required_error: "Last name is required",
      }),
    }),

    address: z.string({
      required_error: "Address is required",
    }),

    budget: z.number().default(0),

    income: z.number().default(0),
  }),
});

const updateUserZodSchema = z.object({
  body: z.object({
    phoneNumber: z
      .string({
        required_error: "Phone number is required",
      })
      .optional(),

    role: z.enum(["seller", "buyer"]).optional(),

    password: z.string().optional(),

    name: z
      .object({
        firstName: z
          .string({
            required_error: "First name is required",
          })
          .optional(),
        middleName: z.string().optional(),
        lastName: z
          .string({
            required_error: "Last name is required",
          })
          .optional(),
      })
      .optional(),

    address: z
      .string({
        required_error: "Address is required",
      })
      .optional(),

    budget: z.number().default(0).optional(),

    income: z.number().default(0).optional(),
  }),
});

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
};

// await createUserZodSchema.parseAsync(req);
