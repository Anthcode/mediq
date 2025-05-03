import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Users, UserCog, Tag, Brain, Home } from 'lucide-react';
import { theme } from '../../styles/theme';
import { Container } from '../common/Container';

const AdminContainer = styled.div`
  display: flex;
  min-height: calc(100vh - 120px);
`;

const Sidebar = styled.aside`
  width: 280px;
  background-color: ${theme.colors.background.paper};
  border-right: 1px solid ${theme.colors.neutral.light};
  padding: ${theme.spacing(4)} 0;
  flex-shrink: 0;
`;

const MainContent = styled.main`
  flex: 1;
  padding: ${theme.spacing(4)};
  background-color: ${theme.colors.background.default};
`;

const NavMenu = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(1)};
`;

interface NavItemProps {
  $isActive?: boolean;
}

const NavItem = styled(Link)<NavItemProps>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing(2)};
  padding: ${theme.spacing(2)} ${theme.spacing(4)};
  color: ${props => props.$isActive ? theme.colors.primary.main : theme.colors.text.primary};
  text-decoration: none;
  font-weight: ${props => props.$isActive ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular};
  background-color: ${props => props.$isActive ? theme.colors.primary.light + '20' : 'transparent'};
  
  &:hover {
    background-color: ${theme.colors.neutral.light};
  }
`;

const NavIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

const NavText = styled.span`
  font-size: 0.875rem;
`;

const NavSection = styled.div`
  margin-bottom: ${theme.spacing(4)};
  
  &:not(:first-child) {
    border-top: 1px solid ${theme.colors.neutral.light};
    padding-top: ${theme.spacing(4)};
  }
`;

const NavSectionTitle = styled.h2`
  font-size: 0.75rem;
  font-weight: ${theme.typography.fontWeightBold};
  color: ${theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0 ${theme.spacing(4)};
  margin-bottom: ${theme.spacing(2)};
`;

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  return (
    <AdminContainer>
      <Sidebar>
        <NavMenu>
          <NavSection>
            <NavSectionTitle>Ogólne</NavSectionTitle>
            <NavItem to="/" $isActive={location.pathname === '/'}>
              <NavIcon><Home size={18} /></NavIcon>
              <NavText>Strona główna</NavText>
            </NavItem>
            <NavItem to="/admin" $isActive={location.pathname === '/admin'}>
              <NavIcon><UserCog size={18} /></NavIcon>
              <NavText>Panel administratora</NavText>
            </NavItem>
          </NavSection>

          <NavSection>
            <NavSectionTitle>Zarządzanie</NavSectionTitle>
            <NavItem 
              to="/admin/doctors" 
              $isActive={location.pathname.startsWith('/admin/doctors')}
            >
              <NavIcon><Users size={18} /></NavIcon>
              <NavText>Lekarze</NavText>
            </NavItem>
            <NavItem 
              to="/admin/specialties" 
              $isActive={location.pathname.startsWith('/admin/specialties')}
            >
              <NavIcon><Tag size={18} /></NavIcon>
              <NavText>Specjalizacje</NavText>
            </NavItem>
            <NavItem 
              to="/admin/expertise-areas" 
              $isActive={location.pathname.startsWith('/admin/expertise-areas')}
            >
              <NavIcon><Brain size={18} /></NavIcon>
              <NavText>Obszary ekspertyzy</NavText>
            </NavItem>
          </NavSection>
        </NavMenu>
      </Sidebar>
      
      <MainContent>
        <Container $maxWidth="lg">
          {children}
        </Container>
      </MainContent>
    </AdminContainer>
  );
};