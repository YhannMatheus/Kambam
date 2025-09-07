import { z } from "zod";
const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.string().regex(/^\d+$/).transform(Number).default(3000),
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string().min(16),
});
function validateEnv(rawEnv) {
    const parsed = envSchema.safeParse(rawEnv);
    if (!parsed.success) {
        console.error("❌ Invalid environment variables:", parsed.error.format());
        process.exit(1);
    }
    return parsed.data;
}
export const env = validateEnv(process.env);
//# sourceMappingURL=env.js.map