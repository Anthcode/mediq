import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticateToken, requireAdmin, AuthenticatedRequest } from '../middleware/authMiddleware';
import { DoctorService } from '../services/doctorService';
import { supabase } from '../lib/supabase';
import { CreateDoctorCommand } from '../types';

const router = Router();
const doctorService = new DoctorService(supabase);

// Validation schema for address
const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required')
});

// Validation schema for creating a doctor
const createDoctorSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  active: z.boolean(),
  experience: z.number().optional(),
  education: z.string().optional(),
  bio: z.string().optional(),
  profile_image_url: z.string().url().optional(),
  specialties: z.array(z.string().uuid()).min(1, 'At least one specialty is required'),
  expertise_areas: z.array(z.string().uuid()).min(1, 'At least one expertise area is required'),
  addresses: z.array(addressSchema).min(1, 'At least one address is required')
}).transform((data): CreateDoctorCommand => ({
  ...data,
  addresses: data.addresses.map(address => ({
    ...address,
    doctor_id: '' // Tymczasowa wartość, zostanie zastąpiona w serwisie
  }))
}));

const createDoctorHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validationResult = createDoctorSchema.safeParse((req as AuthenticatedRequest).body);
    if (!validationResult.success) {
      res.status(400).json({ 
        error: 'Validation failed', 
        details: validationResult.error.errors 
      });
      return;
    }

    const doctor = await doctorService.createDoctor(validationResult.data);
    res.status(201).json(doctor);
  } catch (error) {
    next(error);
  }
};

router.post('/', authenticateToken, requireAdmin, createDoctorHandler);

export default router;