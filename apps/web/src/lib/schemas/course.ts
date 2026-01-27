/**
 * Course Form Schemas
 * Zod validation for course management forms
 */

import { z } from 'zod'

export const localizationSchema = z.object({
  languageId: z.number().int().positive('Language is required'),
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
})

export const createCourseSchema = z.object({
  targetLanguageId: z.number().int().positive('Target language is required'),
  baseLanguageId: z.number().int().positive('Base language is required'),
  levelId: z.number().int().positive('Level is required'),
  courseCode: z
    .string()
    .min(3, 'Course code must be at least 3 characters')
    .max(50)
    .regex(/^[A-Z0-9-]+$/, 'Course code must be uppercase letters, numbers, and hyphens'),
  coverAssetId: z.string().optional(),
  localizations: z.array(localizationSchema).min(1, 'At least one localization is required'),
})

export type CreateCourseFormData = z.infer<typeof createCourseSchema>

export const updateCourseSchema = z.object({
  targetLanguageId: z.number().int().positive().optional(),
  baseLanguageId: z.number().int().positive().optional(),
  levelId: z.number().int().positive().optional(),
  courseCode: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[A-Z0-9-]+$/)
    .optional(),
  coverAssetId: z.string().optional().nullable(),
})

export type UpdateCourseFormData = z.infer<typeof updateCourseSchema>

export const addLocalizationSchema = z.object({
  languageId: z.number().int().positive('Language is required'),
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
})

export type AddLocalizationFormData = z.infer<typeof addLocalizationSchema>
