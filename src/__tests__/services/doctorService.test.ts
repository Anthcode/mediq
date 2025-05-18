import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DoctorService } from '../../services/doctorService';
import { supabase } from '../../lib/supabase';
import { DoctorDTO } from '../../types/dto';

// Definiowanie typów dla lepszej typizacji spies
interface SupabaseError {
  message: string;
}

// Mockowanie klienta Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
          or: vi.fn(),
        })),
        order: vi.fn(),
      })),
      rpc: vi.fn(),
      update: vi.fn(() => ({
        eq: vi.fn(),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(),
      })),
      insert: vi.fn(),
    })),
  },
}));

// Oczekiwany format zapytania select dla lekarzy
const expectedSelectQuery = `
        *,
        addresses (
          id,
          street,
          city,
          state,
          postal_code,
          country
        ),
        ratings (
          id,
          rating,
          comment,
          created_at
        )
      `;

describe('doctorService', () => {
  let doctorService: DoctorService;
  let fromSpy: ReturnType<typeof vi.spyOn>;
  let selectSpy: ReturnType<typeof vi.fn>;
  let eqSpy: ReturnType<typeof vi.fn>;
  let singleSpy: ReturnType<typeof vi.fn>;
  // Removing unused variable

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Konfiguracja szpiegów dla łańcucha wywołań
    fromSpy = vi.spyOn(supabase, 'from');
    
    // Tworzenie mocka dla metody or
    const orReturn = {
      single: vi.fn(),
    };
    
    // Tworzenie mocka dla metody eq
    const eqReturn = {
      single: vi.fn(),
      or: vi.fn().mockReturnValue(orReturn),
    };
    
    // Tworzenie mocka dla metody select
    const selectReturn = {
      eq: vi.fn().mockReturnValue(eqReturn),
      order: vi.fn().mockReturnThis(),
    };
    
    // Tworzenie mocka dla metody from
    const fromReturn = {
      select: vi.fn().mockReturnValue(selectReturn),
      rpc: vi.fn(),
      update: vi.fn().mockReturnValue({
        eq: vi.fn(),
      }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn(),
      }),
      insert: vi.fn(),
    };
    
    // Konfiguracja spies
    fromSpy.mockReturnValue(fromReturn as unknown as ReturnType<typeof supabase.from>);
    
    // Utworzenie instancji testowanego serwisu
    doctorService = new DoctorService(supabase);
    
    // Pobranie referencji do spies
    selectSpy = fromReturn.select;
    eqSpy = selectReturn.eq;
    singleSpy = eqReturn.single;
    // Removing unused assignment
  });

  describe('getDoctors', () => {
    it('pobiera listę lekarzy', async () => {
      // Przygotowanie mocka
      const mockDoctors = [
        { id: '1', first_name: 'Jan', last_name: 'Kowalski', specialty: 'Kardiolog' },
        { id: '2', first_name: 'Anna', last_name: 'Nowak', specialty: 'Neurolog' },
      ] as unknown as DoctorDTO[];
      
      // Mockowanie zwracanej wartości
      eqSpy.mockResolvedValue({
        data: mockDoctors,
        error: null,
      });

      // Wywołanie testowanej funkcji
      const result = await doctorService.getDoctors();

      // Asercje
      expect(fromSpy).toHaveBeenCalledWith('doctors');
      expect(selectSpy).toHaveBeenCalledWith(expectedSelectQuery);
      expect(eqSpy).toHaveBeenCalledWith('active', true);
      expect(result).toEqual(mockDoctors);
    });

    it('obsługuje błąd podczas pobierania lekarzy', async () => {
      // Przygotowanie mocka błędu
      const mockError: SupabaseError = { message: 'Błąd pobierania danych' };
      
      // Mockowanie zwracanego błędu
      eqSpy.mockResolvedValue({
        data: null,
        error: mockError,
      });

      // Wywołanie testowanej funkcji i sprawdzenie, czy rzuca wyjątek
      await expect(doctorService.getDoctors()).rejects.toThrow(`Failed to fetch doctors: ${mockError.message}`);
      
      // Asercje wywołań
      expect(fromSpy).toHaveBeenCalledWith('doctors');
      expect(selectSpy).toHaveBeenCalledWith(expectedSelectQuery);
      expect(eqSpy).toHaveBeenCalledWith('active', true);
    });
  });

  describe('getDoctorById', () => {
    it('pobiera lekarza po ID', async () => {
      // Przygotowanie mocka
      const mockDoctor = { id: '1', first_name: 'Jan', last_name: 'Kowalski', specialty: 'Kardiolog' } as unknown as DoctorDTO;
      
      // Mockowanie zwracanej wartości
      singleSpy.mockResolvedValue({
        data: mockDoctor,
        error: null,
      });

      // Wywołanie testowanej funkcji
      const result = await doctorService.getDoctorById('1');

      // Asercje
      expect(fromSpy).toHaveBeenCalledWith('doctors');
      expect(selectSpy).toHaveBeenCalledWith(expectedSelectQuery);
      expect(eqSpy).toHaveBeenCalledWith('id', '1');
      expect(singleSpy).toHaveBeenCalled();
      expect(result).toEqual(mockDoctor);
    });

    it('obsługuje błąd podczas pobierania lekarza po ID', async () => {
      // Przygotowanie mocka błędu
      const mockError: SupabaseError = { message: 'Błąd pobierania danych lekarza' };
      
      // Mockowanie zwracanego błędu
      singleSpy.mockResolvedValue({
        data: null,
        error: mockError,
      });

      // Wywołanie testowanej funkcji i sprawdzenie, czy rzuca wyjątek
      await expect(doctorService.getDoctorById('1')).rejects.toThrow(`Failed to fetch doctor: ${mockError.message}`);
      
      // Asercje wywołań
      expect(fromSpy).toHaveBeenCalledWith('doctors');
      expect(selectSpy).toHaveBeenCalledWith(expectedSelectQuery);
      expect(eqSpy).toHaveBeenCalledWith('id', '1');
      expect(singleSpy).toHaveBeenCalled();
    });
  });
});

