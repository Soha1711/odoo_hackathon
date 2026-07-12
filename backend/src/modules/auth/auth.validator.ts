import { z } from 'zod';
import { Role } from '@prisma/client';

export const RegisterSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    departmentId: z.string().uuid().optional(),
    role: z.nativeEnum(Role).optional(),
  }),
});

export const LoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
});
