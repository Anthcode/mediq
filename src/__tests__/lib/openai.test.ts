import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// --- GLOBAL MOCKI ---
vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  symptoms: ['ból głowy', 'zawroty głowy', 'nudności'],
                  specialtyMatches: [
                    {
                      name: 'Neurolog',
                      matchPercentage: 90,
                      reasoning: 'Objawy wskazują na problemy neurologiczne'
                    },
                    {
                      name: 'Okulista',
                      matchPercentage: 75,
                      reasoning: 'Ból głowy może być związany z problemami wzroku'
                    },
                    {
                      name: 'Internista',
                      matchPercentage: 60,
                      reasoning: 'Początkowa diagnostyka dolegliwości ogólnych'
                    }
                  ]
                })
              }
            }
          ]
        })
      }
    }
  }))
}));

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnValue({
      data: [
        { specialties: 'Neurolog' },
        { specialties: 'Kardiolog' },
        { specialties: 'Okulista' },
        { specialties: 'Internista' }
      ],
      error: null
    })
  }
}));

vi.mock('../../lib/openai', async (importOriginal) => {
  const original = await importOriginal<typeof import('../../lib/openai')>();
  return {
    ...original,
    fetchUniqueDoctorSpecialties: vi.fn().mockResolvedValue([
      'Neurolog',
      'Kardiolog',
      'Okulista',
      'Internista'
    ])
  };
});

// --- TESTY ---
describe('Funkcja analyzeHealthQueryWithSpecialties', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.resetModules();
  });

  it('poprawnie analizuje zapytanie o objawy zdrowotne', async () => {
    const { analyzeHealthQueryWithSpecialties } = await import('../../lib/openai');
    const result = await analyzeHealthQueryWithSpecialties('Mam silne bóle głowy, zawroty i nudności od tygodnia');
    expect(result).toBeDefined();
    expect(result.symptoms).toEqual(['ból głowy', 'zawroty głowy', 'nudności']);
    expect(result.specialtyMatches).toHaveLength(3);
    expect(result.specialtyMatches[0].name).toBe('Neurolog');
    expect(result.specialtyMatches[0].matchPercentage).toBe(90);
    result.specialtyMatches.forEach(match => {
      expect(match).toHaveProperty('name');
      expect(match).toHaveProperty('matchPercentage');
      expect(match).toHaveProperty('reasoning');
      expect(typeof match.matchPercentage).toBe('number');
      expect(match.matchPercentage).toBeGreaterThanOrEqual(0);
      expect(match.matchPercentage).toBeLessThanOrEqual(100);
    });
  });

  it('obsługuje puste odpowiedzi z API', async () => {
    vi.doMock('openai', () => ({
      default: vi.fn().mockImplementation(() => ({
        chat: {
          completions: {
            create: vi.fn().mockResolvedValueOnce({
              choices: [
                {
                  message: {
                    role: 'assistant',
                    content: ''
                  }
                }
              ]
            })
          }
        }
      }))
    }));
    vi.doMock('../../lib/supabase', () => ({
      supabase: {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnValue({
          data: [
            { specialties: 'Neurolog' },
            { specialties: 'Kardiolog' },
            { specialties: 'Okulista' },
            { specialties: 'Internista' }
          ],
          error: null
        })
      }
    }));
    vi.doMock('../../lib/openai', async (importOriginal) => {
      const original = await importOriginal<typeof import('../../lib/openai')>();
      return {
        ...original,
        fetchUniqueDoctorSpecialties: vi.fn().mockResolvedValue([
          'Neurolog',
          'Kardiolog',
          'Okulista',
          'Internista'
        ])
      };
    });
    const { analyzeHealthQueryWithSpecialties } = await import('../../lib/openai');
    await expect(analyzeHealthQueryWithSpecialties('Test')).rejects.toThrow('Otrzymano pustą odpowiedź od API');
  });

  it('obsługuje błędy z API', async () => {
    vi.doMock('openai', () => ({
      default: vi.fn().mockImplementation(() => ({
        chat: {
          completions: {
            create: vi.fn().mockRejectedValueOnce(new Error('API Error'))
          }
        }
      }))
    }));
    vi.doMock('../../lib/supabase', () => ({
      supabase: {
        from: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnValue({
          data: [
            { specialties: 'Neurolog' },
            { specialties: 'Kardiolog' },
            { specialties: 'Okulista' },
            { specialties: 'Internista' }
          ],
          error: null
        })
      }
    }));
    vi.doMock('../../lib/openai', async (importOriginal) => {
      const original = await importOriginal<typeof import('../../lib/openai')>();
      return {
        ...original,
        fetchUniqueDoctorSpecialties: vi.fn().mockResolvedValue([
          'Neurolog',
          'Kardiolog',
          'Okulista',
          'Internista'
        ])
      };
    });
    const { analyzeHealthQueryWithSpecialties } = await import('../../lib/openai');
    await expect(analyzeHealthQueryWithSpecialties('Test')).rejects.toThrow('API Error');
  });
});