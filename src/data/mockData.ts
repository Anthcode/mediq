import { DoctorDTO } from '../types/dto';

export const mockDoctors: DoctorDTO[] = [
  {
    id: '1',
    first_name: 'Anna',
    last_name: 'Kowalska',
    active: true,
    experience: 15,
    education: 'Warszawski Uniwersytet Medyczny',
    bio: 'Specjalistka kardiolog z doświadczeniem w leczeniu chorób układu krążenia. Regularnie uczestniczy w konferencjach kardiologicznych.',
    profile_image_url: 'https://images.pexels.com/photos/5214959/pexels-photo-5214959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    specialties: [
      { id: 's1', name: 'Kardiologia', created_at: '', updated_at: '' }
    ],
    expertise_areas: [
      { id: 'e1', name: 'Choroby serca', created_at: '', updated_at: '' },
      { id: 'e2', name: 'Nadciśnienie tętnicze', created_at: '', updated_at: '' },
      { id: 'e3', name: 'Zaburzenia rytmu serca', created_at: '', updated_at: '' },
      { id: 'e4', name: 'Diagnostyka kardiologiczna', created_at: '', updated_at: '' }
    ],
    addresses: [
      {
        id: 'a1',
        doctor_id: '1',
        street: 'ul. Mickiewicza 15',
        city: 'Warszawa',
        state: 'mazowieckie',
        postal_code: '00-001',
        country: 'Polska',
        created_at: '',
        updated_at: ''
      }
    ],
    ratings: []
  },
  {
    id: '2',
    first_name: 'Maria',
    last_name: 'Nowak',
    active: true,
    experience: 12,
    education: 'Gdański Uniwersytet Medyczny',
    bio: 'Specjalistka dermatolog z doświadczeniem w leczeniu chorób skóry oraz medycynie estetycznej. Stosuje najnowsze metody diagnostyki i leczenia.',
    profile_image_url: 'https://images.pexels.com/photos/5214961/pexels-photo-5214961.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    specialties: [
      { id: 's2', name: 'Dermatologia', created_at: '', updated_at: '' }
    ],
    expertise_areas: [
      { id: 'e5', name: 'Choroby skóry', created_at: '', updated_at: '' },
      { id: 'e6', name: 'Dermatologia dziecięca', created_at: '', updated_at: '' },
      { id: 'e7', name: 'Dermatologia estetyczna', created_at: '', updated_at: '' },
      { id: 'e8', name: 'Diagnostyka zmian skórnych', created_at: '', updated_at: '' }
    ],
    addresses: [
      {
        id: 'a2',
        doctor_id: '2',
        street: 'ul. Długa 5',
        city: 'Gdańsk',
        state: 'pomorskie',
        postal_code: '80-001',
        country: 'Polska',
        created_at: '',
        updated_at: ''
      }
    ],
    ratings: []
  },
  {
    id: '3',
    first_name: 'Krzysztof',
    last_name: 'Lewandowski',
    active: true,
    experience: 10,
    education: 'Warszawski Uniwersytet Medyczny',
    bio: 'Specjalista kardiolog z doświadczeniem w diagnostyce i leczeniu chorób układu krążenia. Regularnie uczestniczy w konferencjach kardiologicznych.',
    profile_image_url: 'https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    specialties: [
      { id: 's1', name: 'Kardiologia', created_at: '', updated_at: '' }
    ],
    expertise_areas: [
      { id: 'e1', name: 'Choroby serca', created_at: '', updated_at: '' },
      { id: 'e2', name: 'Nadciśnienie tętnicze', created_at: '', updated_at: '' },
      { id: 'e3', name: 'Zaburzenia rytmu serca', created_at: '', updated_at: '' },
      { id: 'e4', name: 'Diagnostyka kardiologiczna', created_at: '', updated_at: '' }
    ],
    addresses: [
      {
        id: 'a3',
        doctor_id: '3',
        street: 'ul. Długa 5',
        city: 'Warszawa',
        state: 'mazowieckie',
        postal_code: '00-001',
        country: 'Polska',
        created_at: '',
        updated_at: ''
      }
    ],
    ratings: []
  }
];