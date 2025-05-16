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
