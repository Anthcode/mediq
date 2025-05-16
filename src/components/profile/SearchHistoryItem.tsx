import React from 'react';
import styled from 'styled-components';
import { Search, Trash2 } from 'lucide-react';
import { theme } from '../../styles/theme';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { SearchHistoryDTO } from '../../types/dto';

const HistoryItemContainer = styled.div`
  display: flex;
  align-items: center;
  padding: ${theme.spacing(2)};
  border-radius: ${theme.borderRadius.medium};
  background-color: ${theme.colors.background.paper};
  box-shadow: ${theme.shadows.small};
  margin-bottom: ${theme.spacing(2)};
  transition: transform ${theme.transitions.short}, box-shadow ${theme.transitions.short};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.medium};
  }
`;

const IconContainer = styled.div`
  margin-right: ${theme.spacing(2)};
  color: ${theme.colors.primary.main};
`;

const ContentContainer = styled.div`
  flex: 1;
`;

const QueryText = styled.div`
  font-weight: ${theme.typography.fontWeightMedium};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing(1)};
`;

const SpecialtiesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing(1)};
  margin-bottom: ${theme.spacing(1)};
`;

const SpecialtyTag = styled.div`
  background-color: ${theme.colors.primary.light};
  color: ${theme.colors.primary.dark};
  padding: ${theme.spacing(0.5)} ${theme.spacing(1)};
  border-radius: ${theme.borderRadius.small};
  font-size: 0.75rem;
`;

const DateDisplay = styled.div`
  font-size: 0.75rem;
  color: ${theme.colors.text.secondary};
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: ${theme.spacing(2)};
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.error.main};
  cursor: pointer;
  padding: ${theme.spacing(1)};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: ${theme.colors.error.light};
  }
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary.main};
  cursor: pointer;
  padding: ${theme.spacing(1)};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing(1)};
  
  &:hover {
    background-color: ${theme.colors.primary.light};
  }
`;

interface SearchHistoryItemProps {
  item: SearchHistoryDTO;
  onDelete: (id: string) => void;
  onSearch: (query: string) => void;
}

const SearchHistoryItem: React.FC<SearchHistoryItemProps> = ({ item, onDelete, onSearch }) => {
  const specialties = Array.isArray(item.specialties) 
    ? item.specialties 
    : (typeof item.specialties === 'string' ? [item.specialties] : []);
    
  const formattedDate = format(new Date(item.created_at), 'dd MMMM yyyy, HH:mm', { locale: pl });
  
  return (
    <HistoryItemContainer>
      <IconContainer>
        <Search size={20} />
      </IconContainer>
      <ContentContainer>
        <QueryText>{item.query}</QueryText>
        <SpecialtiesList>
          {specialties.map((specialty, index) => (
            <SpecialtyTag key={index}>{specialty}</SpecialtyTag>
          ))}
        </SpecialtiesList>
        <DateDisplay>{formattedDate}</DateDisplay>
      </ContentContainer>
      <ActionsContainer>
        <SearchButton 
          onClick={() => onSearch(item.query)} 
          title="Wyszukaj ponownie"
        >
          <Search size={16} />
        </SearchButton>
        <DeleteButton 
          onClick={() => onDelete(item.id)} 
          title="Usuń"
        >
          <Trash2 size={16} />
        </DeleteButton>
      </ActionsContainer>
    </HistoryItemContainer>
  );
};

export default SearchHistoryItem;
