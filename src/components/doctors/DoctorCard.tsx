import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { StarIcon, MapPin, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { theme } from '../../styles/theme';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../common/Card';
import { Button } from '../common/Button';
import { DoctorDTO } from '../../types/dto';
import type { Rating as RatingType } from '../../types/database.types';
import { supabase } from '../../lib/supabase';
import { DoctorService } from '../../services/doctorService';
import { PermissionGate } from '../common/PermissionGate';

const DoctorCardContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const AvatarContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${theme.spacing(2)};
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${theme.colors.primary.light};
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing(0.5)};
  margin-bottom: ${theme.spacing(1)};
`;

const Rating = styled.span`
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.fontWeightMedium};
`;

const StarFilled = styled(StarIcon)`
  color: ${theme.colors.warning.main};
`;

const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const InfoItem = styled.li`
  margin-bottom: ${theme.spacing(1)};
  color: ${theme.colors.text.secondary};
  display: flex;
  align-items: center;
  gap: ${theme.spacing(1)};
`;

const RelevanceScore = styled.div<{ score: number }>`
  position: absolute;
  top: ${theme.spacing(1)};
  right: ${theme.spacing(1)};
  background-color: ${props => {
    const score = props.score;
    if (score >= 90) return theme.colors.success.main;
    if (score >= 70) return theme.colors.secondary.main;
    if (score >= 50) return theme.colors.warning.main;
    return theme.colors.neutral.main;
  }};
  color: white;
  border-radius: ${theme.borderRadius.small};
  padding: ${theme.spacing(0.5)} ${theme.spacing(1)};
  font-size: 0.75rem;
  font-weight: ${theme.typography.fontWeightBold};
`;

const AdminActions = styled.div`
  position: absolute;
  top: ${theme.spacing(1)};
  right: ${theme.spacing(1)};
  display: flex;
  gap: ${theme.spacing(1)};
`;

const IconButton = styled(Button)`
  padding: ${theme.spacing(1)};
  min-width: unset;
  border-radius: 50%;
`;

const DeleteDialog = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${theme.colors.background.paper};
  padding: ${theme.spacing(4)};
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.large};
  max-width: 400px;
  width: 90%;
  z-index: 1000;
`;

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const DialogContent = styled.div`
  text-align: center;
`;

const DialogTitle = styled.h3`
  color: ${theme.colors.error.main};
  margin-bottom: ${theme.spacing(2)};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing(1)};
`;

const DialogText = styled.p`
  margin-bottom: ${theme.spacing(3)};
  color: ${theme.colors.text.secondary};
`;

const DialogActions = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing(2)};
`;

interface DoctorCardProps {
  doctor: DoctorDTO & {
    matchPercentage?: number;
  };
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

const calculateAverageRating = (ratings: RatingType[] | null | undefined): string => {
  if (!ratings?.length) return "Brak ocen";
  const sum = ratings.reduce((acc: number, r: RatingType) => acc + r.rating, 0);
  return (sum / ratings.length).toFixed(1);
};

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, isAdmin = false, onDelete }) => {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const primaryAddress = doctor.addresses?.[0];
  const displayName = `${doctor.first_name} ${doctor.last_name}`;
  const addressText = primaryAddress 
    ? `${primaryAddress.street}, ${primaryAddress.city}` 
    : "Brak adresu";
  const averageRating = calculateAverageRating(doctor.ratings);

  const handleEdit = () => {
    navigate(`/admin/doctors/${doctor.id}/edit`);
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      const doctorService = new DoctorService(supabase);
      await doctorService.deleteDoctor(doctor.id);
      setIsDeleteDialogOpen(false);
      onDelete?.(doctor.id);
    } catch (error) {
      console.error('Błąd podczas usuwania lekarza:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DoctorCardContainer>
        {doctor.matchPercentage !== undefined && (
          <RelevanceScore score={doctor.matchPercentage}>
            {doctor.matchPercentage}% Dopasowania
          </RelevanceScore>
        )}        {isAdmin && (
          <PermissionGate roles={['administrator']}>
            <AdminActions>
              <IconButton 
                variant="outlined" 
                onClick={handleEdit}
                title="Edytuj"
              >
                <Edit2 size={16} />
              </IconButton>
              <IconButton 
                variant="outlined" 
                onClick={handleDeleteClick}
                title="Usuń"
              >
                <Trash2 size={16} color={theme.colors.error.main} />
              </IconButton>
            </AdminActions>
          </PermissionGate>
        )}
        
        <AvatarContainer>
          <Avatar 
            src={doctor.profile_image_url || undefined} 
            alt={displayName}
          />
        </AvatarContainer>
        
        <CardHeader>
          <CardTitle>{displayName}</CardTitle>
          <p>{doctor.specialties}</p> 
          <p>• {doctor.experience} lat doświadczenia</p>
          <RatingContainer>
            <StarFilled size={16} />
            <Rating>{averageRating}</Rating>
          </RatingContainer>
        </CardHeader>
        
        <CardContent>
          <InfoList>
            <InfoItem>
              <MapPin size={16} />
              {addressText}
            </InfoItem>
          </InfoList>
          {/* Usunięto wyświetlanie expertise_areas, bo nie istnieje w modelu */}
        </CardContent>
        
        <CardFooter>
          <Button 
            as={Link} 
            to={`/doctors/${doctor.id}`}
            variant="outlined"
            $fullWidth
          >
            Zobacz profil
          </Button>
        </CardFooter>
      </DoctorCardContainer>

      {isDeleteDialogOpen && (
        <>
          <DialogOverlay onClick={() => !isDeleting && setIsDeleteDialogOpen(false)} />
          <DeleteDialog>
            <DialogContent>
              <DialogTitle>
                <AlertCircle size={24} />
                Potwierdź usunięcie
              </DialogTitle>
              <DialogText>
                Czy na pewno chcesz usunąć profil lekarza {displayName}? 
                Tej operacji nie można cofnąć.
              </DialogText>
              <DialogActions>
                <Button
                  variant="outlined"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  disabled={isDeleting}
                >
                  Anuluj
                </Button>
                <Button
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  $danger
                >
                  {isDeleting ? 'Usuwanie...' : 'Usuń'}
                </Button>
              </DialogActions>
            </DialogContent>
          </DeleteDialog>
        </>
      )}
    </>
  );
};

export default React.memo(DoctorCard);