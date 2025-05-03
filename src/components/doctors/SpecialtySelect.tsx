import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { supabase } from '../../lib/supabase';
import { Specialty, ExpertiseArea } from '../../types';

const SelectContainer = styled.div`
  margin-bottom: ${theme.spacing(2)};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${theme.spacing(1)};
  color: ${theme.colors.text.primary};
  font-weight: ${theme.typography.fontWeightMedium};
`;

const ChipContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing(1)};
  margin-top: ${theme.spacing(1)};
`;

const Chip = styled.div<{ $selected?: boolean }>`
  padding: ${theme.spacing(1)} ${theme.spacing(2)};
  border-radius: ${theme.borderRadius.small};
  background-color: ${props => props.$selected ? theme.colors.primary.main : theme.colors.background.paper};
  color: ${props => props.$selected ? theme.colors.primary.contrastText : theme.colors.text.primary};
  border: 1px solid ${props => props.$selected ? theme.colors.primary.main : theme.colors.neutral.main};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.$selected ? theme.colors.primary.dark : theme.colors.primary.light};
    color: ${theme.colors.primary.contrastText};
  }
`;

const ErrorText = styled.span`
  color: ${theme.colors.error.main};
  font-size: 0.875rem;
  margin-top: ${theme.spacing(0.5)};
  display: block;
`;

interface SelectProps {
  type: 'specialty' | 'expertise';
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  error?: string;
}

const SpecialtySelect: React.FC<SelectProps> = ({
  type,
  selectedIds,
  onChange,
  error
}) => {
  const [items, setItems] = useState<(Specialty | ExpertiseArea)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from(type === 'specialty' ? 'specialties' : 'expertise_areas')
        .select('*')
        .order('name');

      if (!error && data) {
        setItems(data);
      }
      setLoading(false);
    };

    fetchItems();
  }, [type]);

  const handleToggle = (id: string) => {
    const newIds = selectedIds.includes(id)
      ? selectedIds.filter(selectedId => selectedId !== id)
      : [...selectedIds, id];
    onChange(newIds);
  };

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  return (
    <SelectContainer>
      <Label>
        {type === 'specialty' ? 'Specjalizacje' : 'Obszary ekspertyzy'}
      </Label>
      <ChipContainer>
        {items.map(item => (
          <Chip
            key={item.id}
            $selected={selectedIds.includes(item.id)}
            onClick={() => handleToggle(item.id)}
          >
            {item.name}
          </Chip>
        ))}
      </ChipContainer>
      {error && <ErrorText>{error}</ErrorText>}
    </SelectContainer>
  );
};

export default SpecialtySelect;