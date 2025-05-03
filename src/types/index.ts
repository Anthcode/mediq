// Eksport typów bazodanowych
export type { 
    Doctor,
    Address,
    Specialty,
    ExpertiseArea,
    Rating,
    SearchHistory,
    DoctorSpecialty,
    DoctorExpertiseArea,
    DoctorInsert,
    DoctorUpdate,
    AddressInsert,
    AddressUpdate
} from './database.types';

// Eksport typów DTO i Command Models
export type {
    DoctorDTO,
    CreateDoctorCommand,
    UpdateDoctorCommand,
    CreateAddressCommand,
    DoctorRatingDTO,
    CreateRatingCommand,
    SearchHistoryDTO,
    CreateSearchHistoryCommand,
    AIAnalysisDTO,
    UserProfileDTO,
    UpdateUserProfileCommand,
    LoginDTO,
    AuthResponseDTO,
    RegisterDTO
} from './dto';

// Eksport typów związanych z wyszukiwaniem
export type {
    SearchResult,
    SearchAnalysis
} from './search';

// Eksport typów związanych z autentykacją
export type { User } from './auth';