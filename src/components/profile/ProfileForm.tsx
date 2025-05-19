import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Button } from '../common/Button';
import { Input, Label, FormGroup, InputError } from '../common/Input';
import { UserProfileDTO, UpdateUserProfileCommand } from '../../types/dto';


const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(3)};
  max-width: 600px;
  margin: 0 auto;
`;

interface FormErrors {
  first_name?: string;
  last_name?: string;
  [key: string]: string | undefined;
}

interface ProfileFormProps {
  profile: UserProfileDTO;
  onSubmit: (data: UpdateUserProfileCommand) => Promise<void>;
  isLoading?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onSubmit,
  isLoading = false
}) => {  const [formData, setFormData] = useState({
    first_name: profile.first_name,
    last_name: profile.last_name,
    // Usunięto pole role, które było wcześniej częścią profile
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.first_name?.trim()) {
      newErrors.first_name = 'Imię jest wymagane';
    }
    if (!formData.last_name?.trim()) {
      newErrors.last_name = 'Nazwisko jest wymagane';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: error instanceof Error ? error.message : 'Wystąpił błąd podczas aktualizacji profilu'
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: undefined
    }));
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="role">Rola</Label>
        <Input
          id="role"
          name="role"          value={profile.role}
          disabled
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="first_name">Imię</Label>
        <Input
          id="first_name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          $error={!!errors.first_name}
          disabled={isLoading}
          required
        />
        {errors.first_name && <InputError>{errors.first_name}</InputError>}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="last_name">Nazwisko</Label>
        <Input
          id="last_name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          $error={!!errors.last_name}
          disabled={isLoading}
          required
        />
        {errors.last_name && <InputError>{errors.last_name}</InputError>}
      </FormGroup>

      {errors.submit && <InputError>{errors.submit}</InputError>}

      <Button
        type="submit"
        disabled={isLoading}
        $fullWidth
      >
        {isLoading ? 'Zapisywanie...' : 'Zapisz zmiany'}
      </Button>
    </FormContainer>
  );
};