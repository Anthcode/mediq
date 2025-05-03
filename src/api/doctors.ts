import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticateToken, requireAdmin, AuthenticatedRequest } from '../middleware/authMiddleware';
import { DoctorService } from '../services/doctorService';
import { supabase } from '../lib/supabase';
import { CreateDoctorCommand, UpdateDoctorCommand } from '../types';

const router = Router();
const doctorService = new DoctorService(supabase);

// Schematy walidacji
const addressSchema = z.object({
  street: z.string().min(1, 'Ulica jest wymagana'),
  city: z.string().min(1, 'Miasto jest wymagane'),
  state: z.string().min(1, 'Województwo jest wymagane'),
  postal_code: z.string().min(1, 'Kod pocztowy jest wymagany'),
  country: z.string().min(1, 'Kraj jest wymagany')
});

const createDoctorSchema = z.object({
  first_name: z.string().min(1, 'Imię jest wymagane'),
  last_name: z.string().min(1, 'Nazwisko jest wymagane'),
  active: z.boolean(),
  experience: z.number().optional(),
  education: z.string().optional(),
  bio: z.string().optional(),
  profile_image_url: z.string().url().optional(),
  specialties: z.array(z.string().uuid()).min(1, 'Przynajmniej jedna specjalizacja jest wymagana'),
  expertise_areas: z.array(z.string().uuid()).min(1, 'Przynajmniej jeden obszar ekspertyzy jest wymagany'),
  addresses: z.array(addressSchema).min(1, 'Przynajmniej jeden adres jest wymagany')
});

const updateDoctorSchema = createDoctorSchema.partial();

const ratingSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional()
});

// Handlery endpointów
const getDoctorsHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const doctors = await doctorService.getDoctors();
    res.json(doctors);
  } catch (error) {
    next(error);
  }
};

const getDoctorByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const doctor = await doctorService.getDoctorById(req.params.id);
    if (!doctor) {
      res.status(404).json({ error: 'Lekarz nie został znaleziony' });
      return;
    }
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

const createDoctorHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validationResult = createDoctorSchema.safeParse((req as AuthenticatedRequest).body);
    if (!validationResult.success) {
      res.status(400).json({ 
        error: 'Błąd walidacji', 
        details: validationResult.error.errors 
      });
      return;
    }

    const doctor = await doctorService.createDoctor(validationResult.data as CreateDoctorCommand);
    res.status(201).json(doctor);
  } catch (error) {
    next(error);
  }
};

const updateDoctorHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validationResult = updateDoctorSchema.safeParse((req as AuthenticatedRequest).body);
    if (!validationResult.success) {
      res.status(400).json({ 
        error: 'Błąd walidacji', 
        details: validationResult.error.errors 
      });
      return;
    }

    const doctor = await doctorService.updateDoctor(
      req.params.id, 
      validationResult.data as UpdateDoctorCommand
    );
    res.json(doctor);
  } catch (error) {
    next(error);
  }
};

const deleteDoctorHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await doctorService.deleteDoctor(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const addRatingHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validationResult = ratingSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({ 
        error: 'Błąd walidacji', 
        details: validationResult.error.errors 
      });
      return;
    }

    await doctorService.addRating(
      req.params.id,
      validationResult.data.rating,
      validationResult.data.comment
    );
    res.status(201).send();
  } catch (error) {
    next(error);
  }
};

// Definicje routingu
router.get('/', getDoctorsHandler);
router.get('/:id', getDoctorByIdHandler);
router.post('/', authenticateToken, requireAdmin, createDoctorHandler);
router.put('/:id', authenticateToken, requireAdmin, updateDoctorHandler);
router.delete('/:id', authenticateToken, requireAdmin, deleteDoctorHandler);
router.post('/:id/ratings', authenticateToken, addRatingHandler);

export default router;