import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Doctor, CreateDoctorCommand, UpdateDoctorCommand } from '../../types';
import { DoctorService } from '../../services/doctorService';
import { supabase } from '../../lib/supabase';
import SpecialtySelect from './SpecialtySelect';
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

interface DoctorFormProps {
  doctor?: Doctor;
  onSubmit: (data: CreateDoctorCommand | UpdateDoctorCommand) => Promise<void>;
  onCancel: () => void;
}

const DoctorForm: React.FC<DoctorFormProps> = ({ doctor, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<CreateDoctorCommand | UpdateDoctorCommand>({
    first_name: doctor?.first_name || '',
    last_name: doctor?.last_name || '',
    active: doctor?.active ?? true,
    experience: doctor?.experience || 0,
    education: doctor?.education || '',
    bio: doctor?.bio || '',
    profile_image_url: doctor?.profile_image_url || '',
    specialties: doctor?.specialties?.map(s => s.id) || [],
    expertise_areas: doctor?.expertise_areas?.map(a => a.id) || [],
    addresses: doctor?.address ? [{
      street: doctor.address.street,
      city: doctor.address.city,
      state: doctor.address.state,
      postal_code: doctor.address.postal_code,
      country: doctor.address.country
    }] : []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Usuń błąd dla tego pola, jeśli istnieje
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name) {
      newErrors.first_name = 'Imię jest wymagane';
    }
    if (!formData.last_name) {
      newErrors.last_name = 'Nazwisko jest wymagane';
    }
    if (!formData.specialties?.length) {
      newErrors.specialties = 'Wybierz przynajmniej jedną specjalizację';
    }
    if (!formData.expertise_areas?.length) {
      newErrors.expertise_areas = 'Wybierz przynajmniej jeden obszar ekspertyzy';
    }
    if (!formData.addresses?.length) {
      newErrors.addresses = 'Dodaj przynajmniej jeden adres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSpecialtiesChange = (ids: string[]) => {
    setFormData(prev => ({
      ...prev,
      specialties: ids
    }));
  };

  const handleExpertiseAreasChange = (ids: string[]) => {
    setFormData(prev => ({
      ...prev,
      expertise_areas: ids
    }));
  };

  const handleAddressChange = (index: number, address: any) => {
    setFormData(prev => ({
      ...prev,
      addresses: [
        ...prev.addresses.slice(0, index),
        address,
        ...prev.addresses.slice(index + 1)
      ]
    }));
  };

  const handleAddAddress = () => {
    setFormData(prev => ({
      ...prev,
      addresses: [
        ...prev.addresses,
        { street: '', city: '', state: '', postal_code: '', country: '' }
      ]
    }));
  };

  const handleRemoveAddress = (index: number) => {
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      if (error instanceof Error) {
        setErrors(prev => ({
          ...prev,
          submit: error.message
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormTitle>{doctor ? 'Edytuj lekarza' : 'Dodaj nowego lekarza'}</FormTitle>
      
      <FormSection>
        <Input
          label="Imię"
          name="first_name"
          value={formData.first_name}
          onChange={handleInputChange}
          error={errors.first_name}
          required
        />
        <Input
          label="Nazwisko"
          name="last_name"
          value={formData.last_name}
          onChange={handleInputChange}
          error={errors.last_name}
          required
        />
      </FormSection>

      <FormSection>
        <Input
          label="Doświadczenie (lata)"
          name="experience"
          type="number"
          value={formData.experience?.toString()}
          onChange={handleInputChange}
        />
        <Input
          label="Edukacja"
          name="education"
          value={formData.education}
          onChange={handleInputChange}
        />
      </FormSection>

      <FormSection>
        <Input
          label="Bio"
          name="bio"
          as="textarea"
          value={formData.bio}
          onChange={handleInputChange}
        />
        <Input
          label="URL zdjęcia profilowego"
          name="profile_image_url"
          type="url"
          value={formData.profile_image_url}
          onChange={handleInputChange}
        />
      </FormSection>

      <FormSection>
        <SpecialtySelect
          type="specialty"
          selectedIds={formData.specialties}
          onChange={handleSpecialtiesChange}
          error={errors.specialties}
        />
        <SpecialtySelect
          type="expertise"
          selectedIds={formData.expertise_areas}
          onChange={handleExpertiseAreasChange}
          error={errors.expertise_areas}
        />
      </FormSection>

      <FormSection>
        <div style={{ marginBottom: theme.spacing(2) }}>
          <h3>Adresy</h3>
          {formData.addresses.map((address, index) => (
            <AddressForm
              key={index}
              address={address}
              onChange={(newAddress) => handleAddressChange(index, newAddress)}
              onRemove={formData.addresses.length > 1 ? () => handleRemoveAddress(index) : undefined}
              errors={errors[`address_${index}`] as Record<string, string>}
            />
          ))}
          <Button
            type="button"
            variant="outlined"
            onClick={handleAddAddress}
          >
            Dodaj adres
          </Button>
        </div>
      </FormSection>
      
      {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}

      <ButtonGroup>
        <Button 
          type="button" 
          variant="outlined" 
          onClick={onCancel}
        >
          Anuluj
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
        >
          {loading ? 'Zapisywanie...' : (doctor ? 'Zapisz zmiany' : 'Dodaj lekarza')}
        </Button>
      </ButtonGroup>
    </FormContainer>
  );
};

export default DoctorForm;