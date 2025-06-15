import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { theme } from "../styles/theme";
import { Container } from "../components/common/Container";
import { Card } from "../components/common/Card";
import { TabList, Tab } from "../components/common/TabList";
import { TabPanel } from "../components/common/TabPanel";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { Button } from "../components/common/Button";
import { ProfileForm } from "../components/profile/ProfileForm";
import SearchHistoryList from "../components/profile/SearchHistoryList";
import { useAuth } from "../hooks/useAuth";
import { UserService } from "../services/userService";
import { SearchHistoryService } from "../services/searchHistoryService";
import { supabase } from "../lib/supabase";
import { UserProfileDTO, SearchHistoryDTO } from "../types/dto";

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
    if (!user) return;

    const userService = new UserService(supabase);
    try {
      //console.log('Próba pobrania profilu dla użytkownika:', user.id);
      const data = await userService.getCurrentUserProfile();
      //console.log('Pobrano profil użytkownika:', data);
      setProfile(data);
    } catch (err) {
      console.error('Błąd podczas ładowania profilu:', err);
      setError(
        err instanceof Error ? err.message : "Nie udało się załadować profilu"
      );
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const loadSearchHistory = useCallback(async () => {
    if (!user) return;

    setIsHistoryLoading(true);
    try {
      const searchHistoryService = new SearchHistoryService(supabase);
      const history = await searchHistoryService.getUserSearchHistory(user.id);
      setSearchHistory(history);
    } catch (err) {
      console.error("Błąd podczas ładowania historii wyszukiwań:", err);
    } finally {
      setIsHistoryLoading(false);
    }
  }, [user]);
  useEffect(() => {
    if (user) {
      // Najpierw upewniamy się, że profil i rola użytkownika istnieją
      const userService = new UserService(supabase);
      //console.log('Rozpoczynam sprawdzanie i naprawę profilu użytkownika...');
      userService.ensureUserProfileExists(user.id)
        .then(() => {
          //console.log('Profil użytkownika został sprawdzony/naprawiony, ładowanie danych...');
          loadProfile();
          loadSearchHistory();
        })
        .catch(err => {
          console.error("Błąd podczas sprawdzania/naprawiania profilu:", err);
          setError('Nie udało się zainicjować profilu użytkownika. Odśwież stronę lub skontaktuj się z administratorem.');
          setIsLoading(false);
          setIsHistoryLoading(false);
        });
    } else {
      setIsLoading(false);
      setIsHistoryLoading(false);
    }
  }, [user, loadProfile, loadSearchHistory]);

  const handleUpdateProfile = async (data: Partial<UserProfileDTO>) => {
    if (!user) return;

    const userService = new UserService(supabase);
    setIsSaving(true);
    try {
      const updatedProfile = await userService.updateUserProfile(data);
      setProfile(updatedProfile);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Nie udało się zaktualizować profilu"
      );
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
      setSearchHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Błąd podczas usuwania wpisu z historii:", err);
    }
  };

  const handleClearSearchHistory = async () => {
    if (!user) return;

    try {
      const searchHistoryService = new SearchHistoryService(supabase);
      await searchHistoryService.clearUserSearchHistory(user.id);
      setSearchHistory([]);
    } catch (err) {
      console.error("Błąd podczas czyszczenia historii:", err);
    }
  };

  const handleSearchFromHistory = (query: string) => {
    navigate("/", { state: { searchQuery: query } });
  };
  if (isLoading) {
    return (
      <ProfileContainer>
        <PageTitle>Profil</PageTitle>
        <Card>
          <LoadingSpinner />
        </Card>
      </ProfileContainer>
    );
  }

  if (error) {
    return (
      <ProfileContainer>
        <PageTitle>Profil</PageTitle>
        <Card>
          <ErrorText>{error}</ErrorText>
          <Button 
            onClick={() => window.location.reload()} 
            style={{ margin: '20px auto', display: 'block' }}
          >
            Spróbuj ponownie
          </Button>
        </Card>
      </ProfileContainer>
    );
  }

  if (!user) {
    return (
      <ProfileContainer>
        <PageTitle>Profil</PageTitle>
        <Card>
          <ErrorText>
            Musisz być zalogowany, aby zobaczyć swój profil.
          </ErrorText>
        </Card>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <PageTitle>Profil</PageTitle>
      <Card>
        <TabList>
          <Tab $isActive={activeTab === 0} onClick={() => setActiveTab(0)}>
            Dane profilu
          </Tab>
          <Tab $isActive={activeTab === 1} onClick={() => setActiveTab(1)}>
            Historia wyszukiwań
          </Tab>
        </TabList>

        <TabPanel $isActive={activeTab === 0}>
          {error && <ErrorText>{error}</ErrorText>}{" "}
          {profile && (
            <ProfileForm
              profile={profile}
              onSubmit={handleUpdateProfile}
              isLoading={isSaving}
            />
          )}
        </TabPanel>

        <TabPanel $isActive={activeTab === 1}>
          {" "}
          <SearchHistoryList
            history={searchHistory}
            onDelete={handleDeleteHistoryItem}
            onClearAll={handleClearSearchHistory}
            onSearch={handleSearchFromHistory}
            isLoading={isHistoryLoading ?? false}
          />
        </TabPanel>
      </Card>
    </ProfileContainer>
  );
};
