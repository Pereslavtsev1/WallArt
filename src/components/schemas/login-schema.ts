import z from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email address").min(2, "Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.[a-z])(?=.[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number",
    ),
});
