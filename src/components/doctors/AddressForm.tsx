import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { FormInput } from '../common/Input';
import { Button } from '../common/Button';
import { CreateAddressCommand } from '../../types/dto';

const AddressContainer = styled.div`
  padding: ${theme.spacing(2)};
  margin-bottom: ${theme.spacing(2)};
  border: 1px solid ${theme.colors.neutral.light};
  border-radius: ${theme.borderRadius.small};
`;

const AddressGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing(2)};
  margin-bottom: ${theme.spacing(2)};

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

interface AddressFormProps {
  address: Partial<CreateAddressCommand>;
  onChange: (address: CreateAddressCommand) => void;
  onRemove?: () => void;
  errors?: Record<string, string>;
  disabled?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  address,
  onChange,
  onRemove,
  errors = {},
  disabled = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newAddress: CreateAddressCommand = {
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      postal_code: address.postal_code || '',
      country: address.country || '',
      doctor_id: address.doctor_id || '',
      [name]: value
    };
    onChange(newAddress);
  };

  return (
    <AddressContainer>
      <AddressGrid>
        <FormInput
          id="street"
          name="street"
          label="Ulica"
          value={address.street || ''}
          onChange={handleChange}
          error={errors.street}
          required
          disabled={disabled}
        />
        <FormInput
          id="city"
          name="city"
          label="Miasto"
          value={address.city || ''}
          onChange={handleChange}
          error={errors.city}
          required
          disabled={disabled}
        />
        <FormInput
          id="state"
          name="state"
          label="Województwo"
          value={address.state || ''}
          onChange={handleChange}
          error={errors.state}
          disabled={disabled}
        />
        <FormInput
          id="postal_code"
          name="postal_code"
          label="Kod pocztowy"
          value={address.postal_code || ''}
          onChange={handleChange}
          error={errors.postal_code}
          required
          disabled={disabled}
        />
        <FormInput
          id="country"
          name="country"
          label="Kraj"
          value={address.country || ''}
          onChange={handleChange}
          error={errors.country}
          disabled={disabled}
        />
      </AddressGrid>
      {onRemove && (
        <Button
          type="button"
          $variant="text"
          onClick={onRemove}
          disabled={disabled}
        >
          Usuń adres
        </Button>
      )}
    </AddressContainer>
  );
};

export default React.memo(AddressForm);