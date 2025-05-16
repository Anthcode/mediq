import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Search, Lock } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { theme } from '../../styles/theme';
import { useAuth } from '../../hooks/useAuth';

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const Form = styled.form`
  position: relative;
  display: flex;
  gap: ${theme.spacing(1)};
  width: 100%;

  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const SearchInput = styled(Input)`
  flex: 1;
  padding: ${theme.spacing(2)};
  font-size: 1rem;
  border-radius: ${theme.borderRadius.medium};
  padding-left: ${theme.spacing(5)};
  height: 50px;
  
  &:focus {
    border-color: ${theme.colors.primary.main};
    box-shadow: 0 0 0 3px rgba(30, 136, 229, 0.2);
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: ${theme.spacing(1.5)};
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.text.secondary};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    top: ${theme.spacing(2)};
  }
`;

const pulseAnimation = keyframes`
  0% {
    transform: scale(0.95);
  }
  70% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.95);
  }
`;

const SearchButton = styled(Button)`
  min-width: 120px;
  
  &:disabled {
    animation: ${pulseAnimation} 1.5s infinite;
  }
  
  @media (max-width: ${theme.breakpoints.sm}) {
    width: 100%;
  }
`;

const AuthRequiredInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing(1)};
  color: ${theme.colors.text.secondary};
  font-size: 0.875rem;
  margin-top: ${theme.spacing(1)};
  justify-content: center;

  svg {
    color: ${theme.colors.warning.main};
  }
`;

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  initialQuery?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading, initialQuery = '' }) => {
  const { user } = useAuth();
  const [query, setQuery] = useState(initialQuery);
  
  React.useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      onSearch(initialQuery);
    }
  }, [initialQuery, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading && user) {
      onSearch(query);
    }
  };
  
  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <SearchIconWrapper>
          <Search size={20} />
        </SearchIconWrapper>
        <SearchInput 
          placeholder={user ? "Opisz swoje objawy lub dolegliwości..." : "Zaloguj się, aby wyszukać lekarza"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={!user}
          $fullWidth
        />
        <SearchButton 
          type="submit" 
          disabled={isLoading || !query.trim() || !user}
        >
          {isLoading ? 'Analizuję...' : 'Szukaj lekarza'}
        </SearchButton>
      </Form>
      {!user && (
        <AuthRequiredInfo>
          <Lock size={16} />
          <span>Wyszukiwanie dostępne tylko dla zalogowanych użytkowników</span>
        </AuthRequiredInfo>
      )}
    </Container>
  );
};

export default SearchBar;