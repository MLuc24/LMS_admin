/**
 * User Form Schemas
 * Zod validation for user management forms
 */

import { z } from 'zod'

export const updateUserSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .max(255)
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .max(50)
    .optional()
    .or(z.literal('')),
  displayName: z
    .string()
    .min(1, 'Display name is required')
    .max(255),
  avatarAssetId: z
    .string()
    .optional()
    .or(z.literal('')),
  status: z
    .enum(['active', 'suspended', 'deleted'])
    .optional(),
  emailVerified: z
    .boolean()
    .optional(),
  dob: z
    .string()
    .optional()
    .or(z.literal('')),
  timezone: z
    .string()
    .max(100)
    .optional()
    .or(z.literal('')),
})

export type UpdateUserFormData = z.infer<typeof updateUserSchema>

export const setUserRolesSchema = z.object({
  roles: z
    .array(z.enum(['SUPER_ADMIN', 'ADMIN', 'INSTRUCTOR', 'STUDENT']))
    .min(1, 'At least one role is required'),
})

export type SetUserRolesFormData = z.infer<typeof setUserRolesSchema>
