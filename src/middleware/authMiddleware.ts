import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
  };
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    // Pobieranie roli z tabeli user_roles zamiast profiles
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleError || !roleData) {
      res.status(401).json({ error: 'User role not found' });
      return;
    }

    (req as AuthenticatedRequest).user = {
      id: user.id,
      role: roleData.role,
      email: user.email!
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Failed to authenticate token' });
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authReq = req as AuthenticatedRequest;
  if (authReq.user?.role !== 'administrator') {
    res.status(403).json({ error: 'Access denied. Admin role required.' });
    return;
  }
  next();
};