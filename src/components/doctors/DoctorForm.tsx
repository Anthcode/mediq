import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Button } from '../common/Button';
import { FormInput } from '../common/Input';
import { CreateDoctorCommand, UpdateDoctorCommand, CreateAddressCommand, DoctorDTO } from '../../types/dto';
import AddressForm from './AddressForm';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(3)};
  max-width: 600px;
  margin: 0 auto;
  padding: ${theme.spacing(4)};
  background-color: ${theme.colors.background.paper};
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.medium};
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(2)};
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing(3)};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${theme.spacing(2)};
  justify-content: flex-end;
  margin-top: ${theme.spacing(4)};
`;

const ErrorMessage = styled.p`
  color: ${theme.colors.error.main};
  font-size: 0.875rem;
  margin-top: ${theme.spacing(1)};
`;

interface FormErrors {
  first_name?: string;
  last_name?: string;
  specialties?: string;
  expertise_areas?: string;
  addresses?: string;
  [key: string]: string | undefined;
}

interface DoctorFormProps {
  doctor?: DoctorDTO;
  onSubmit: (data: CreateDoctorCommand | UpdateDoctorCommand) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const initialFormState = (doctor?: DoctorDTO): CreateDoctorCommand => ({
  first_name: doctor?.first_name || '',
  last_name: doctor?.last_name || '',
  active: doctor?.active ?? true,
  experience: doctor?.experience ?? 0,
  education: doctor?.education || '',
  bio: doctor?.bio || '',
  profile_image_url: doctor?.profile_image_url || '',
  specialties: doctor?.specialties || '', // teraz string
  addresses: doctor?.addresses || []
});

const DoctorForm: React.FC<DoctorFormProps> = ({ 
  doctor, 
  onSubmit, 
  onCancel,
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<CreateDoctorCommand>(initialFormState(doctor));
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const isFormDisabled = loading || isLoading;

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => {
      const rest = { ...prev };
      delete rest[name];
      return rest;
    });
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.first_name?.trim()) {
      newErrors.first_name = 'Imię jest wymagane';
    }
    if (!formData.last_name?.trim()) {
      newErrors.last_name = 'Nazwisko jest wymagane';
    }
    if (!formData.specialties?.trim()) {
      newErrors.specialties = 'Podaj specjalizację (pole tekstowe)';
    }
    if (!formData.addresses?.length) {
      newErrors.addresses = 'Dodaj przynajmniej jeden adres';
    } else {
      formData.addresses.forEach((address, index) => {
        if (!address.street?.trim() || !address.city?.trim() || !address.postal_code?.trim()) {
          newErrors[`address_${index}`] = 'Wypełnij wszystkie wymagane pola adresu';
        }
      });
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleAddressChange = useCallback((index: number, address: CreateAddressCommand) => {
    setFormData(prev => {
      const addresses = [...prev.addresses];
      addresses[index] = address;
      return {
        ...prev,
        addresses
      };
    });
    setErrors(prev => {
      const rest = { ...prev };
      delete rest[`address_${index}`];
      return rest;
    });
  }, []);

  const handleAddAddress = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      addresses: [
        ...prev.addresses,
        { 
          street: '',
          city: '', 
          state: '', 
          postal_code: '', 
          country: '',
          doctor_id: '', 
          is_primary: false
        }
      ]
    }));
  }, []);

  const handleRemoveAddress = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index)
    }));
    setErrors(prev => {
      const rest = { ...prev };
      delete rest[`address_${index}`];
      return rest;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: error instanceof Error ? error.message : 'Wystąpił nieoczekiwany błąd'
      }));
    } finally {
      setLoading(false);
    }
  };

  const formSections = useMemo(() => (
    <>
      <FormSection>
        <FormInput
          id="first_name"
          name="first_name"
          label="Imię"
          value={formData.first_name || ''}
          onChange={handleInputChange}
          error={errors.first_name}
          required
          disabled={isFormDisabled}
          aria-invalid={!!errors.first_name}
          aria-describedby={errors.first_name ? 'first-name-error' : undefined}
        />
        <FormInput
          id="last_name"
          name="last_name"
          label="Nazwisko"
          value={formData.last_name || ''}
          onChange={handleInputChange}
          error={errors.last_name}
          required
          disabled={isFormDisabled}
          aria-invalid={!!errors.last_name}
          aria-describedby={errors.last_name ? 'last-name-error' : undefined}
        />
      </FormSection>
      <FormSection>
        <FormInput
          id="experience"
          name="experience"
          label="Doświadczenie (lata)"
          type="number"
          min="0"
          value={formData.experience?.toString() || '0'}
          onChange={handleInputChange}
          disabled={isFormDisabled}
        />
        <FormInput
          id="education"
          name="education"
          label="Edukacja"
          value={formData.education || ''}
          onChange={handleInputChange}
          disabled={isFormDisabled}
        />
      </FormSection>
      <FormSection>
        <FormInput
          id="bio"
          name="bio"
          label="Bio"
          as="textarea"
          value={formData.bio || ''}
          onChange={handleInputChange}
          disabled={isFormDisabled}
        />
        <FormInput
          id="profile_image_url"
          name="profile_image_url"
          label="URL zdjęcia profilowego"
          type="url"
          value={formData.profile_image_url || ''}
          onChange={handleInputChange}
          disabled={isFormDisabled}
        />
      </FormSection>
      <FormSection>
        <FormInput
          id="specialties"
          name="specialties"
          label="Specjalizacje (wpisz tekstowo, np. Internista, Kardiolog)"
          value={formData.specialties || ''}
          onChange={handleInputChange}
          error={errors.specialties}
          required
          disabled={isFormDisabled}
        />
      </FormSection>
    </>
  ), [formData, errors, handleInputChange, isFormDisabled]);

  return (
    <FormContainer onSubmit={handleSubmit} aria-label={doctor ? 'Edycja lekarza' : 'Dodawanie nowego lekarza'}>
      <FormTitle>{doctor ? 'Edytuj lekarza' : 'Dodaj nowego lekarza'}</FormTitle>
      
      {formSections}

      <FormSection>
        <div style={{ marginBottom: theme.spacing(2) }}>
          <h3>Adresy</h3>
          {formData.addresses?.map((address, index) => (
            <AddressForm
              key={index}
              address={address}
              onChange={(addr) => handleAddressChange(index, addr)}
              onRemove={() => handleRemoveAddress(index)}
              errors={typeof errors[`address_${index}`] === 'string' ? { address: errors[`address_${index}`] as string } : undefined}
              disabled={isFormDisabled}
            />
          ))}
          <Button
            type="button"
            $variant="outlined"
            onClick={handleAddAddress}
            disabled={isFormDisabled}
          >
            Dodaj adres
          </Button>
        </div>
      </FormSection>
      
      {errors.submit && (
        <ErrorMessage role="alert">{errors.submit}</ErrorMessage>
      )}

      <ButtonGroup>
        <Button 
          type="button" 
          $variant="outlined" 
          onClick={onCancel}
          disabled={isFormDisabled}
        >
          Anuluj
        </Button>
        <Button 
          type="submit" 
          disabled={isFormDisabled}
        >
          {isFormDisabled ? 'Zapisywanie...' : (doctor ? 'Zapisz zmiany' : 'Dodaj lekarza')}
        </Button>
      </ButtonGroup>
    </FormContainer>
  );
};

export default React.memo(DoctorForm);