import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { StarIcon, MapPin } from 'lucide-react';
import { theme } from '../../styles/theme';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../common/Card';
import { Button } from '../common/Button';
import { Doctor } from '../../types';

const DoctorCardContainer = styled(Card)`
  display: flex;
  flex-direction: column;
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

const ExpertiseArea = styled.span`
  background-color: ${theme.colors.primary.light};
  color: ${theme.colors.primary.contrastText};
  padding: ${theme.spacing(0.5)} ${theme.spacing(1)};
  border-radius: ${theme.borderRadius.small};
  font-size: 0.75rem;
  margin-right: ${theme.spacing(0.5)};
  margin-bottom: ${theme.spacing(0.5)};
  display: inline-block;
`;

const ExpertiseContainer = styled.div`
  margin-top: ${theme.spacing(2)};
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

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <DoctorCardContainer>
      {doctor.relevance_score && (
        <RelevanceScore score={doctor.relevance_score}>
          {doctor.relevance_score}% Dopasowania
        </RelevanceScore>
      )}
      
      <AvatarContainer>
        <Avatar src={doctor.profile_image} alt={doctor.name} />
      </AvatarContainer>
      
      <CardHeader>
        <CardTitle>{doctor.name}</CardTitle>
        <p>{doctor.specialty} • {doctor.experience} lat doświadczenia</p>
        <RatingContainer>
          <StarFilled size={16} />
          <Rating>{doctor.rating.toFixed(1)}</Rating>
        </RatingContainer>
      </CardHeader>
      
      <CardContent>
        <InfoList>
          <InfoItem>
            <MapPin size={16} />
            {doctor.address}
          </InfoItem>
        </InfoList>
        
        <ExpertiseContainer>
          {doctor.expertise_areas.slice(0, 4).map((area, index) => (
            <ExpertiseArea key={index}>{area}</ExpertiseArea>
          ))}
          {doctor.expertise_areas.length > 4 && (
            <ExpertiseArea>+{doctor.expertise_areas.length - 4} więcej</ExpertiseArea>
          )}
        </ExpertiseContainer>
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
  );
};

export default DoctorCard;