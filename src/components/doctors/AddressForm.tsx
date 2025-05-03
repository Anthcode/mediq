import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

const AddressContainer = styled.div`
  border: 1px solid ${theme.colors.neutral.light};
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing(3)};
  margin-bottom: ${theme.spacing(3)};
`;

const AddressFields = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing(2)};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${theme.spacing(2)};
`;

interface Address {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

interface AddressFormProps {
  address: Address;
  onChange: (address: Address) => void;
  onRemove?: () => void;
  errors?: Record<string, string>;
}

const AddressForm: React.FC<AddressFormProps> = ({
  address,
  onChange,
  onRemove,
  errors = {}
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({
      ...address,
      [name]: value
    });
  };

  return (
    <AddressContainer>
      <AddressFields>
        <Input
          label="Ulica"
          name="street"
          value={address.street}
          onChange={handleChange}
          error={errors.street}
          required
        />
        <Input
          label="Miasto"
          name="city"
          value={address.city}
          onChange={handleChange}
          error={errors.city}
          required
        />
        <Input
          label="Województwo"
          name="state"
          value={address.state}
          onChange={handleChange}
          error={errors.state}
          required
        />
        <Input
          label="Kod pocztowy"
          name="postal_code"
          value={address.postal_code}
          onChange={handleChange}
          error={errors.postal_code}
          required
        />
        <Input
          label="Kraj"
          name="country"
          value={address.country}
          onChange={handleChange}
          error={errors.country}
          required
        />
      </AddressFields>
      
      {onRemove && (
        <ButtonContainer>
          <Button
            type="button"
            variant="outlined"
            color="error"
            onClick={onRemove}
          >
            Usuń adres
          </Button>
        </ButtonContainer>
      )}
    </AddressContainer>
  );
};

export default AddressForm;