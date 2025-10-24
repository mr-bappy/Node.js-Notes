import z from "zod";

export const validateRegistration = z.object({
    username: z
        .string()
        .trim()
        .min(5, { message: "Minimum 5 characters required for username" })
        .max(100, { message: "Maximum 100 characters required for username" }),
    email: z
        .string()
        .email({ message: "Please enter valid email address" })
        .trim()
        .min(5, { message: "Minimum 5 characters required for email" })
        .max(100, { message: "Maximum 100 characer required for email" }),
    password: z
        .string()
        .min(6, { message: "Minimum 6 characters required for password"})
        .max(100, { message: "Maximum 100 character required for password" })
});

export const validateLogin = z.object({
    email: z
        .string()
        .email({ message: "invalid email or password" })
        .trim()
        .min(5, { message: "invalid email or password" })
        .max(100, { message: "invalid email or password" }),
    password: z
        .string()
        .min(6, { message: "invalid email or password"})
        .max(100, { message: "invalid email or password" })
});

// export const validateLogin = z.object({
//     email: z
//         .string()
//         .email({ message: "invalid email or password" })
//         .trim()
//         .min(5, { message: "invalid email or password" })
//         .max(100, { message: "invalid email or password" }),
//     password: z
//         .string()
//         .min(6, { message: "invalid email or password"})
//         .max(100, { message: "invalid email or password" })
// });

// export const validateRegistration = validateLogin.extend({
//     username: z
//         .string()
//         .trim()
//         .min(5, { message: "Minimum 5 characters required for username" })
//         .max(100, { message: "Maximum 100 characters required for username" }),
// });

// validate email and token
export const verifyEmailSchema = z.object({
    token: z
    .string()
    .trim()
    .length(8),
    email: z
    .string()
    .email({ message: "invalid email"})
    .trim(),
});

// verifyUserSchema
export const verifyUserSchema = z.object({
    username: z
        .string()
        .trim()
        .min(5, { message: "Minimum 5 characters required for username" })
        .max(100, { message: "Maximum 100 characters required for username" }),
})

// verifyPasswordSchema
export const verifyPasswordSchema = z.object({
    currentPassword: z
    .string()
    .min(1, {message: "Current password is required!"}),
    newPassword: z
    .string()
    .min(6, { message: "New password must be atleast 6 characters long"})
    .max(1000, {
        message: "New password must be no more than 100 characters"
    }),
    confirmPassword: z
    .string()
    .min(6, {
        message: "Confirm password must be atleast 6 characters long"
    })
    .max(100, {
        message: "Confirm password must be no more than 100 characters"
    }),
}).refine((data) => data.newPassword===data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
});

// forgetPasswordSchema
export const forgetPasswordSchema = z.object({
    email: z
    .string()
    .trim()
    .email({ 
        message: "please enter a valid email."
    })
    .max(100, {
        message: "email must be no more than 100 characters."
    })
})

// verifyResetPasswordSchema
export const verifyResetPasswordSchema = z.object({
    newPassword: z
    .string()
    .min(6, { message: "New password must be atleast 6 characters long"})
    .max(1000, {
        message: "New password must be no more than 100 characters"
    }),
    confirmPassword: z
    .string()
    .min(6, {
        message: "Confirm password must be atleast 6 characters long"
    })
    .max(100, {
        message: "Confirm password must be no more than 100 characters"
    }),
}).refine((data) => data.newPassword===data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
});

// verifySetPassword
export const verifySetPasswordSchema = z.object({
    setPassword: z
    .string()
    .min(6, { message: "New password must be atleast 6 characters long"})
    .max(1000, {
        message: "New password must be no more than 100 characters"
    }),
    confirmPassword: z
    .string()
    .min(6, {
        message: "Confirm password must be atleast 6 characters long"
    })
    .max(100, {
        message: "Confirm password must be no more than 100 characters"
    }),
}).refine((data) => data.setPassword===data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
});
