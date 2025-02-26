import { z } from 'zod';

const envSchema = z.object({
  VITE_OPENWEATHER_APPID: z.string().min(1),
});

export type Environment = z.infer<typeof envSchema>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface ImportMetaEnv extends Environment {}
}

export const envValidationResult = envSchema.safeParse(import.meta.env, {
  errorMap: () => ({
    message: 'VITE_OPENWEATHER_APPID is required in .env',
  }),
});
