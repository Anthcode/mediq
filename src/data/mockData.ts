import { Doctor } from '../types';

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'dr Anna Kowalska',
    specialty: 'Kardiolog',
    experience: 15,
    rating: 4.8,
    address: 'ul. Mickiewicza 15, Warszawa',
    profile_image: 'https://images.pexels.com/photos/5214959/pexels-photo-5214959.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    expertise_areas: [
      'Choroby serca',
      'Nadciśnienie tętnicze',
      'Zaburzenia rytmu serca',
      'Diagnostyka kardiologiczna'
    ],
    education: 'Warszawski Uniwersytet Medyczny',
    bio: 'Specjalistka w dziedzinie kardiologii z 15-letnim doświadczeniem. Zajmuje się diagnostyką i leczeniem chorób układu krążenia.',
    schedule: [
      { day: 'Poniedziałek', hours: '9:00 - 17:00' },
      { day: 'Wtorek', hours: '9:00 - 17:00' },
      { day: 'Środa', hours: '12:00 - 20:00' },
      { day: 'Czwartek', hours: '9:00 - 17:00' },
      { day: 'Piątek', hours: '9:00 - 15:00' }
    ]
  },
  {
    id: '2',
    name: 'dr Piotr Nowak',
    specialty: 'Neurolog',
    experience: 12,
    rating: 4.9,
    address: 'ul. Słowackiego 8, Warszawa',
    profile_image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    expertise_areas: [
      'Bóle głowy',
      'Zaburzenia neurologiczne',
      'Choroby układu nerwowego',
      'Migreny'
    ],
    education: 'Uniwersytet Jagielloński Collegium Medicum',
    bio: 'Doświadczony neurolog specjalizujący się w diagnostyce i leczeniu chorób układu nerwowego. Regularnie uczestniczy w międzynarodowych konferencjach neurologicznych.',
    schedule: [
      { day: 'Poniedziałek', hours: '10:00 - 18:00' },
      { day: 'Wtorek', hours: '10:00 - 18:00' },
      { day: 'Środa', hours: '8:00 - 16:00' },
      { day: 'Czwartek', hours: '12:00 - 20:00' },
      { day: 'Piątek', hours: '8:00 - 14:00' }
    ]
  },
  {
    id: '3',
    name: 'dr Maria Wiśniewska',
    specialty: 'Dermatolog',
    experience: 8,
    rating: 4.7,
    address: 'ul. Kopernika 22, Warszawa',
    profile_image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    expertise_areas: [
      'Choroby skóry',
      'Alergie skórne',
      'Dermatologia estetyczna',
      'Diagnostyka zmian skórnych'
    ],
    education: 'Gdański Uniwersytet Medyczny',
    bio: 'Specjalistka dermatolog z doświadczeniem w leczeniu chorób skóry oraz medycynie estetycznej. Stosuje najnowsze metody diagnostyki i leczenia.',
    schedule: [
      { day: 'Poniedziałek', hours: '9:00 - 17:00' },
      { day: 'Wtorek', hours: '11:00 - 19:00' },
      { day: 'Środa', hours: '9:00 - 17:00' },
      { day: 'Czwartek', hours: '9:00 - 17:00' },
      { day: 'Piątek', hours: '8:00 - 14:00' }
    ]
  },
  {
  id: '4',
  name: 'dr Krzysztof Lewandowski',
  specialty: 'Kardiolog',
  experience: 10,
  rating: 4.6,
  address: 'ul. Długa 5, Warszawa',
  profile_image: 'https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  expertise_areas: [
    'Choroby serca',
    'Nadciśnienie tętnicze',
    'Zaburzenia rytmu serca',
    'Diagnostyka kardiologiczna'
  ],
  education: 'Warszawski Uniwersytet Medyczny',
  bio: 'Specjalista kardiolog z doświadczeniem w diagnostyce i leczeniu chorób układu krążenia. Regularnie uczestniczy w konferencjach kardiologicznych.',
  schedule: [
    { day: 'Poniedziałek', hours: '9:00 - 17:00' },
    { day: 'Wtorek', hours: '9:00 - 17:00' },
    { day: 'Środa', hours: '12:00 - 20:00' },
    { day: 'Czwartek', hours: '9:00 - 17:00' },
    { day: 'Piątek', hours: '9:00 - 15:00' }
  ]
  }
];