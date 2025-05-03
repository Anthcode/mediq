import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Container } from '../components/common/Container';
import { Card } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ProfileForm } from '../components/profile/ProfileForm';
import { useAuth } from '../hooks/useAuth';
import { UserService } from '../services/userService';
import { supabase } from '../lib/supabase';
import { UserProfileDTO } from '../types/dto';

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
  const [profile, setProfile] = useState<UserProfileDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      setIsLoading(false);
    }
  }, [user, loadProfile]);

  const handleUpdateProfile = async (data: Partial<UserProfileDTO>) => {
    const userService = new UserService(supabase);
    setIsSaving(true);
    try {
      const updatedProfile = await userService.updateUserProfile(data);
      setProfile(updatedProfile);
      // TODO: Dodać powiadomienie o sukcesie
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udało się zaktualizować profilu');
      throw err;
    } finally {
      setIsSaving(false);
    }
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
        {error && <ErrorText>{error}</ErrorText>}
        <ProfileForm
          profile={profile}
          onSubmit={handleUpdateProfile}
          isLoading={isSaving}
        />
      </Card>
    </ProfileContainer>
  );
};