import React from 'react';
import styled from 'styled-components';
import { MapPin, Award, Briefcase, GraduationCap, Star } from 'lucide-react';
import { theme } from '../../styles/theme';
import { Button } from '../common/Button';
import type { DoctorDTO } from '../../types/dto';

const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (min-width: ${theme.breakpoints.md}) {
    flex-direction: row;
    gap: ${theme.spacing(6)};
  }
`;

const InfoSection = styled.div`
  flex: 1;
  
  @media (min-width: ${theme.breakpoints.md}) {
    flex: 2;
  }
`;

const SideSection = styled.div`
  flex: 1;
  margin-top: ${theme.spacing(4)};
  
  @media (min-width: ${theme.breakpoints.md}) {
    margin-top: 0;
  }
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${theme.spacing(4)};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Avatar = styled.img`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid ${theme.colors.primary.light};
  margin-right: ${theme.spacing(4)};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    margin-bottom: ${theme.spacing(3)};
    margin-right: 0;
  }
`;

const HeaderInfo = styled.div`
  flex: 1;
`;

const DoctorName = styled.h1`
  font-size: 2rem;
  margin-bottom: ${theme.spacing(1)};
`;

const DoctorSpecialty = styled.h2`
  font-size: 1.25rem;
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing(2)};
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing(0.5)};
  margin-bottom: ${theme.spacing(1)};
`;

const RatingValue = styled.span`
  font-weight: ${theme.typography.fontWeightBold};
`;

const InfoCard = styled.div`
  background-color: ${theme.colors.background.paper};
  border-radius: ${theme.borderRadius.medium};
  padding: ${theme.spacing(3)};
  margin-bottom: ${theme.spacing(3)};
  box-shadow: ${theme.shadows.small};
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: ${theme.spacing(3)};
  padding-bottom: ${theme.spacing(1.5)};
  border-bottom: 1px solid ${theme.colors.neutral.light};
`;

const InfoList = styled.div`
  margin-bottom: ${theme.spacing(3)};
`;

const InfoItem = styled.div`
  display: flex;
  margin-bottom: ${theme.spacing(2)};
  align-items: flex-start;
`;

const InfoIcon = styled.div`
  margin-right: ${theme.spacing(2)};
  color: ${theme.colors.primary.main};
  margin-top: ${theme.spacing(0.5)};
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.h4`
  font-size: 1rem;
  margin-bottom: ${theme.spacing(0.5)};
`;

const InfoText = styled.p`
  color: ${theme.colors.text.secondary};
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(2)};
`;

interface DoctorDetailProps {
  doctor: DoctorDTO;
}

const DoctorDetail: React.FC<DoctorDetailProps> = ({ doctor }) => {
  const primaryAddress = doctor.addresses?.[0];
  // Zabezpieczenie przed brakiem danych imienia/nazwiska
  const firstName = doctor.first_name || '';
  const lastName = doctor.last_name || '';

  return (
    <DetailContainer>
      <InfoSection>
        <ProfileHeader>
          <Avatar src={doctor.profile_image_url || undefined} alt={`${firstName} ${lastName}`} />
          <HeaderInfo>
            <DoctorName>{`${firstName} ${lastName}`.trim() || 'Lekarz'}</DoctorName>
            <DoctorSpecialty>{doctor.specialties}</DoctorSpecialty>
            <RatingContainer>
              <Star size={20} color={theme.colors.warning.main} />
              <RatingValue>Brak ocen</RatingValue>
              <span>z 5</span>
            </RatingContainer>
          </HeaderInfo>
        </ProfileHeader>
      
        <InfoCard>
          <CardTitle>O lekarzu</CardTitle>
          <InfoText>{doctor.bio}</InfoText>
        </InfoCard>
      </InfoSection>
      
      <SideSection>
        <InfoCard>
          <CardTitle>Informacje</CardTitle>
          <InfoList>
            <InfoItem>
              <InfoIcon>
                <MapPin size={20} />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Adres</InfoLabel>
                <InfoText>
                  {primaryAddress ? 
                    `${primaryAddress.street}, ${primaryAddress.city}` : 
                    "Brak adresu"
                  }
                </InfoText>
              </InfoContent>
            </InfoItem>
            
            <InfoItem>
              <InfoIcon>
                <Briefcase size={20} />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Doświadczenie</InfoLabel>
                <InfoText>{doctor.experience} lat</InfoText>
              </InfoContent>
            </InfoItem>
            
            <InfoItem>
              <InfoIcon>
                <GraduationCap size={20} />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Edukacja</InfoLabel>
                <InfoText>{doctor.education}</InfoText>
              </InfoContent>
            </InfoItem>
            
            <InfoItem>
              <InfoIcon>
                <Award size={20} />
              </InfoIcon>
              <InfoContent>
                <InfoLabel>Specjalizacja</InfoLabel>
                <InfoText>{doctor.specialties}</InfoText>
              </InfoContent>
            </InfoItem>
          </InfoList>
          
          <ButtonGroup>
            <Button $fullWidth>Umów wizytę</Button>
            <Button variant="outlined" $fullWidth>Kontakt z gabinetem</Button>
          </ButtonGroup>
        </InfoCard>
      </SideSection>
    </DetailContainer>
  );
};

export default DoctorDetail;