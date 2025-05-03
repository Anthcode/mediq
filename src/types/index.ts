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
    // Export insert and update types as well for future use
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