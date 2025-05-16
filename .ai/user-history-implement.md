# Implementacja CRUD dla Historii Zapytań Użytkownika

## 1. Implementacja Serwisu SearchHistoryService

Najpierw stwórzmy serwis odpowiedzialny za obsługę historii zapytań:

```typescript
// src/services/searchHistoryService.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { SearchHistoryDTO, CreateSearchHistoryCommand } from '../types/dto';

export class SearchHistoryService {
  constructor(private supabase: SupabaseClient) {}

  async getUserSearchHistory(userId: string): Promise<SearchHistoryDTO[]> {
    const { data, error } = await this.supabase
      .from('search_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Nie udało się pobrać historii wyszukiwań: ${error.message}`);
    }

    return data as SearchHistoryDTO[];
  }

  async saveSearchHistory(command: CreateSearchHistoryCommand): Promise<SearchHistoryDTO> {
    const { data, error } = await this.supabase
      .from('search_history')
      .insert(command)
      .select()
      .single();

    if (error) {
      throw new Error(`Nie udało się zapisać historii wyszukiwania: ${error.message}`);
    }

    return data as SearchHistoryDTO;
  }

  async deleteSearchHistoryItem(id: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('search_history')
      .delete()
      .eq('id', id)
      .eq('user_id', userId); // Dodatkowe zabezpieczenie, aby użytkownicy usuwali tylko swoje wpisy

    if (error) {
      throw new Error(`Nie udało się usunąć wpisu z historii: ${error.message}`);
    }
  }

  async clearUserSearchHistory(userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('search_history')
      .delete()
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Nie udało się wyczyścić historii wyszukiwań: ${error.message}`);
    }
  }
}
```

## 2. Integracja z HomePage.tsx

Dodajmy zapis historii wyszukiwań w komponencie HomePage:

```typescript
// Modyfikacja w src/pages/HomePage.tsx - dodaj w funkcji handleSearch:

// Po pomyślnym wyszukiwaniu i analizie zapytania
try {
  // Istniejący kod analizy zapytania i pobierania lekarzy
  
  // Dodajemy zapis do historii zapytań dla zalogowanego użytkownika
  if (user) {
    const searchHistoryService = new SearchHistoryService(supabase);
    await searchHistoryService.saveSearchHistory({
      user_id: user.id,
      query: query,
      specialties: result.specialtyMatches.map(s => s.name)
    });
  }
  
  // Reszta istniejącego kodu
} catch (error) {
  // Obsługa błędów
}
```

## 3. Komponenty do Wyświetlania Historii Zapytań

### Komponent pojedynczego wpisu historii

```typescript
// src/components/profile/SearchHistoryItem.tsx
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
```

### Komponent listy historii zapytań

```typescript
// src/components/profile/SearchHistoryList.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { History, Trash2 } from 'lucide-react';
import { theme } from '../../styles/theme';
import { Button } from '../common/Button';
import SearchHistoryItem from './SearchHistoryItem';
import { SearchHistoryDTO } from '../../types/dto';
import { LoadingSpinner } from '../common/LoadingSpinner';

const HistoryContainer = styled.div`
  margin-top: ${theme.spacing(4)};
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing(3)};
`;

const HistoryTitle = styled.h2`
  font-size: 1.25rem;
  color: ${theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing(1)};
`;

const EmptyHistory = styled.div`
  text-align: center;
  padding: ${theme.spacing(4)};
  background-color: ${theme.colors.background.paper};
  border-radius: ${theme.borderRadius.medium};
`;

const EmptyHistoryText = styled.p`
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing(2)};
`;

const ConfirmationModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${theme.colors.background.paper};
  padding: ${theme.spacing(4)};
  border-radius: ${theme.borderRadius.medium};
  max-width: 400px;
  width: 90%;
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: ${theme.spacing(2)};
  color: ${theme.colors.error.main};
  display: flex;
  align-items: center;
  gap: ${theme.spacing(1)};
`;

const ModalText = styled.p`
  margin-bottom: ${theme.spacing(3)};
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing(2)};
`;

interface SearchHistoryListProps {
  history: SearchHistoryDTO[];
  onDelete: (id: string) => Promise<void>;
  onClearAll: () => Promise<void>;
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

const SearchHistoryList: React.FC<SearchHistoryListProps> = ({ 
  history, 
  onDelete, 
  onClearAll, 
  onSearch,
  isLoading = false 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
    } catch (error) {
      console.error('Błąd podczas usuwania wpisu historii:', error);
      // Tutaj można dodać obsługę wyświetlania błędu
    }
  };

  const handleClearAll = async () => {
    setIsDeleting(true);
    try {
      await onClearAll();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Błąd podczas czyszczenia historii:', error);
      // Tutaj można dodać obsługę wyświetlania błędu
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <HistoryContainer>
        <HistoryHeader>
          <HistoryTitle>
            <History size={20} />
            Historia wyszukiwań
          </HistoryTitle>
        </HistoryHeader>
        <LoadingSpinner />
      </HistoryContainer>
    );
  }

  return (
    <HistoryContainer>
      <HistoryHeader>
        <HistoryTitle>
          <History size={20} />
          Historia wyszukiwań
        </HistoryTitle>
        {history.length > 0 && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => setIsModalOpen(true)}
          >
            <Trash2 size={16} style={{ marginRight: '4px' }} />
            Wyczyść historię
          </Button>
        )}
      </HistoryHeader>

      {history.length === 0 ? (
        <EmptyHistory>
          <EmptyHistoryText>
            Nie masz jeszcze żadnych wyszukiwań w historii.
          </EmptyHistoryText>
        </EmptyHistory>
      ) : (
        history.map(item => (
          <SearchHistoryItem 
            key={item.id} 
            item={item} 
            onDelete={handleDelete}
            onSearch={onSearch}
          />
        ))
      )}

      {isModalOpen && (
        <ConfirmationModal>
          <ModalContent>
            <ModalTitle>
              <Trash2 size={20} />
              Potwierdź czyszczenie historii
            </ModalTitle>
            <ModalText>
              Czy na pewno chcesz usunąć całą historię wyszukiwań? Tej operacji nie można cofnąć.
            </ModalText>
            <ModalActions>
              <Button 
                variant="outlined" 
                onClick={() => setIsModalOpen(false)}
                disabled={isDeleting}
              >
                Anuluj
              </Button>
              <Button 
                variant="primary" 
                $danger
                onClick={handleClearAll}
                disabled={isDeleting}
              >
                {isDeleting ? 'Usuwanie...' : 'Usuń wszystko'}
              </Button>
            </ModalActions>
          </ModalContent>
        </ConfirmationModal>
      )}
    </HistoryContainer>
  );
};

export default SearchHistoryList;
```

## 4. Implementacja Zakładki Historii Wyszukiwań w Profilu Użytkownika

Rozbudujmy istniejący profil użytkownika o zakładkę z historią wyszukiwań:

```typescript
// src/pages/ProfilePage.tsx - zmodyfikowana wersja
import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Container } from '../components/common/Container';
import { Card } from '../components/common/Card';
import { TabList, Tab, TabPanel } from '../components/common/Tabs'; // Zakładam, że taki komponent istnieje lub trzeba go utworzyć
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ProfileForm } from '../components/profile/ProfileForm';
import SearchHistoryList from '../components/profile/SearchHistoryList';
import { useAuth } from '../hooks/useAuth';
import { UserService } from '../services/userService';
import { SearchHistoryService } from '../services/searchHistoryService';
import { supabase } from '../lib/supabase';
import { UserProfileDTO, SearchHistoryDTO } from '../types/dto';
import { useNavigate } from 'react-router-dom';

const PageTitle = styled.h1`
  margin-bottom: ${theme.spacing(4)};
  color: ${theme.colors.text.primary};
  font-size: 2rem;
`;

const ProfileContainer = styled(Container)`
  padding-top: ${theme.spacing(4)};
  padding-bottom: ${theme.spacing(4)};
`;

const ErrorText = styled.p`
  color: ${theme.colors.error.main};
  text-align: center;
  margin: ${theme.spacing(2)} 0;
`;

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfileDTO | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryDTO[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadProfile = useCallback(async () => {
    const userService = new UserService(supabase);
    try {
      const data = await userService.getCurrentUserProfile();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udało się załadować profilu');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadSearchHistory = useCallback(async () => {
    if (!user) return;
    
    setIsHistoryLoading(true);
    try {
      const searchHistoryService = new SearchHistoryService(supabase);
      const history = await searchHistoryService.getUserSearchHistory(user.id);
      setSearchHistory(history);
    } catch (err) {
      console.error('Błąd podczas ładowania historii wyszukiwań:', err);
      // Nie ustawiamy globalnego błędu, bo to nie jest krytyczne
    } finally {
      setIsHistoryLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadSearchHistory();
    } else {
      setIsLoading(false);
      setIsHistoryLoading(false);
    }
  }, [user, loadProfile, loadSearchHistory]);

  const handleUpdateProfile = async (data: Partial<UserProfileDTO>) => {
    const userService = new UserService(supabase);
    setIsSaving(true);
    try {
      const updatedProfile = await userService.updateUserProfile(data);
      setProfile(updatedProfile);
      // Możesz tu dodać powiadomienie o sukcesie
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udało się zaktualizować profilu');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteHistoryItem = async (id: string) => {
    if (!user) return;
    
    try {
      const searchHistoryService = new SearchHistoryService(supabase);
      await searchHistoryService.deleteSearchHistoryItem(id, user.id);
      
      // Aktualizacja lokalnej historii bez ponownego pobierania z bazy
      setSearchHistory(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Błąd podczas usuwania wpisu z historii:', err);
      // Możesz tu dodać obsługę wyświetlania błędu
    }
  };

  const handleClearSearchHistory = async () => {
    if (!user) return;
    
    try {
      const searchHistoryService = new SearchHistoryService(supabase);
      await searchHistoryService.clearUserSearchHistory(user.id);
      
      // Czyścimy lokalną historię
      setSearchHistory([]);
    } catch (err) {
      console.error('Błąd podczas czyszczenia historii wyszukiwań:', err);
      // Możesz tu dodać obsługę wyświetlania błędu
    }
  };

  const handleSearchFromHistory = (query: string) => {
    // Przekierowanie do strony głównej z zapytaniem
    navigate('/', { state: { searchQuery: query } });
  };

  if (isLoading) {
    return (
      <ProfileContainer>
        <LoadingSpinner />
      </ProfileContainer>
    );
  }

  if (!user) {
    return (
      <ProfileContainer>
        <ErrorText>
          Musisz być zalogowany, aby zobaczyć swój profil
        </ErrorText>
      </ProfileContainer>
    );
  }

  if (error) {
    return (
      <ProfileContainer>
        <ErrorText>{error}</ErrorText>
      </ProfileContainer>
    );
  }

  if (!profile) {
    return (
      <ProfileContainer>
        <LoadingSpinner />
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <PageTitle>Twój profil</PageTitle>
      <Card>
        <TabList activeTab={activeTab} onChange={setActiveTab}>
          <Tab>Dane profilu</Tab>
          <Tab>Historia wyszukiwań</Tab>
        </TabList>

        <TabPanel active={activeTab === 0}>
          {error && <ErrorText>{error}</ErrorText>}
          <ProfileForm
            profile={profile}
            onSubmit={handleUpdateProfile}
            isLoading={isSaving}
          />
        </TabPanel>

        <TabPanel active={activeTab === 1}>
          <SearchHistoryList
            history={searchHistory}
            onDelete={handleDeleteHistoryItem}
            onClearAll={handleClearSearchHistory}
            onSearch={handleSearchFromHistory}
            isLoading={isHistoryLoading}
          />
        </TabPanel>
      </Card>
    </ProfileContainer>
  );
};
```

## 5. Implementacja Komponentu Tabs

Zaimplementujmy komponenty do obsługi zakładek:

```typescript
// src/components/common/Tabs.tsx
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface TabListProps {
  activeTab: number;
  onChange: (index: number) => void;
  children: ReactNode;
}

interface TabProps {
  children: ReactNode;
  $active?: boolean;
}

interface TabPanelProps {
  children: ReactNode;
  active: boolean;
}

const TabListContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${theme.colors.neutral.light};
  margin-bottom: ${theme.spacing(4)};
  overflow-x: auto;
`;

const TabButton = styled.button<{ $active?: boolean }>`
  padding: ${theme.spacing(2)} ${theme.spacing(3)};
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.$active ? theme.colors.primary.main : 'transparent'};
  color: ${props => props.$active ? theme.colors.primary.main : theme.colors.text.primary};
  font-weight: ${props => props.$active ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular};
  cursor: pointer;
  transition: all ${theme.transitions.short};
  white-space: nowrap;
  
  &:hover {
    color: ${theme.colors.primary.main};
  }
`;

const TabPanelContainer = styled.div<{ visible: boolean }>`
  display: ${props => props.visible ? 'block' : 'none'};
`;

export const TabList: React.FC<TabListProps> = ({ activeTab, onChange, children }) => {
  return (
    <TabListContainer>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<TabProps>, {
            $active: activeTab === index,
            onClick: () => onChange(index)
          });
        }
        return child;
      })}
    </TabListContainer>
  );
};

export const Tab: React.FC<TabProps & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ 
  children, 
  $active, 
  ...props 
}) => {
  return (
    <TabButton $active={$active} {...props}>
      {children}
    </TabButton>
  );
};

export const TabPanel: React.FC<TabPanelProps> = ({ children, active }) => {
  return (
    <TabPanelContainer visible={active}>
      {children}
    </TabPanelContainer>
  );
};
```

## 6. Modyfikacja HomePage.tsx aby obsługiwać wyszukiwanie z przekierowania

Dodajmy obsługę wyszukiwania po przekierowaniu z historii:

```typescript
// Modyfikacja w src/pages/HomePage.tsx - w komponencie HomePage

// Dodaj import useLocation
import { useLocation } from 'react-router-dom';
import { Location } from 'history';

interface LocationState {
  searchQuery?: string;
}

// Wewnątrz komponentu HomePage
const location = useLocation() as Location<LocationState>;
const [searchQuery, setSearchQuery] = useState('');

// Dodaj useEffect do obsługi przekierowania z historii
useEffect(() => {
  const state = location.state as LocationState;
  if (state?.searchQuery) {
    setSearchQuery(state.searchQuery);
    // Automatyczne wyszukiwanie po przekierowaniu z historii
    if (user) {
      handleSearch(state.searchQuery);
    }
    // Czyścimy state po użyciu, aby uniknąć ponownego wyszukiwania
    // przy odświeżeniu strony
    window.history.replaceState({}, document.title);
  }
}, [location, user]);

// W komponencie SearchBar przekazujemy wartość searchQuery
<SearchBar 
  onSearch={handleSearch} 
  isLoading={isLoading} 
  initialQuery={searchQuery}
/>
```

Trzeba również zmodyfikować komponent SearchBar.tsx, aby obsługiwał inicjalną wartość:

```typescript
// src/components/search/SearchBar.tsx - dodaj prop initialQuery

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  initialQuery?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading, initialQuery = '' }) => {
  const { user } = useAuth();
  const [query, setQuery] = useState(initialQuery);
  
  // Aktualizacja query po zmianie initialQuery
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);
  
  // Reszta kodu pozostaje bez zmian
};
```

## 7. Optymalizacja wydajności i bezpieczeństwa

1. Dodaj indeks w bazie danych dla wydajniejszego pobierania historii:

```sql
-- Dodaj do pliku migracji lub utwórz nowy plik migracji
CREATE INDEX IF NOT EXISTS idx_search_history_user_id_created_at ON search_history(user_id, created_at DESC);
```

2. Zabezpiecz polityki RLS w Supabase, aby użytkownicy mogli widzieć tylko swoją historię:

```sql
-- Doprecyzuj polityki RLS dla search_history
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- Polityki RLS dla search_history
CREATE POLICY "Users can view their own search history"
    ON search_history FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create search history entries"
    ON search_history FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own search history"
    ON search_history FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
```