import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Settings } from 'lucide-react';
import { Button } from '../common/Button';
import { Container } from '../common/Container';
import { theme } from '../../styles/theme';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { PermissionGate } from '../common/PermissionGate';

const HeaderContainer = styled.header`
  background-color: ${theme.colors.background.default};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing(2)} 0;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: ${theme.typography.fontWeightBold};
  color: ${theme.colors.primary.main};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: ${theme.spacing(1)};
  
  &:hover {
    text-decoration: none;
  }
`;

const LogoImage = styled.img`
  height: 50px;
  width: auto;
`;

const Nav = styled.nav`
  display: flex;
  gap: ${theme.spacing(2)};
`;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
    console.log('Header rendering:', { 
    isLoading,
    user: user ? {
      id: user.id,
      email: user.email,
      role: user.role,
      roleType: typeof user.role
    } : "null",
    userRole: user?.role,
    isAuthenticated: !!user 
  });

  const handleSignOut = async () => {
    try {
      // Pozwól onAuthStateChange obsłużyć zmianę stanu użytkownika dla spójności
      // setUser(null); 
      // Supabase zarządza własnym przechowywaniem sesji
      // localStorage.removeItem('mediq_auth');

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Przekieruj po pomyślnym wylogowaniu
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
    }
  };

  // Jeśli stan autentykacji wciąż się ładuje, pokaż uproszczony nagłówek
  // lub dedykowany komponent ładowania dla nagłówka.
  if (isLoading) {
    return (
      <HeaderContainer>
        <Container $maxWidth="lg">
          <HeaderContent>
            <Logo to="/">
              <LogoImage src="/logo.png" alt="Logo MedIQ" />
            </Logo>
            {/* Można dodać mały spinner lub placeholder dla przycisków nawigacji */}
            <Nav /> 
          </HeaderContent>
        </Container>
      </HeaderContainer>
    );
  }
  
  return (
    <HeaderContainer>
      <Container $maxWidth="lg">
        <HeaderContent>
          <Logo to="/">
            <LogoImage src="/logo.png" alt="Logo MedIQ" />
          </Logo>
            <Nav>
            {user ? (
              <>
                {/* Admin Panel - tylko dla administratorów */}
                <PermissionGate roles={['administrator']}>
                  <Button 
                    as={Link} 
                    to="/admin" 
                    variant="outlined"
                    size="small"
                  >
                    <Settings size={16} style={{ marginRight: '4px' }} />
                    Panel administracyjny
                  </Button>
                </PermissionGate>

                {/* Doctor Panel - dla lekarzy i adminów */}
                <PermissionGate roles={['doctor', 'administrator']}>
                  <Button 
                    as={Link} 
                    to="/doctor" 
                    variant="outlined"
                    size="small"
                  >
                    <User size={16} style={{ marginRight: '4px' }} />
                    Panel lekarza
                  </Button>
                </PermissionGate>

                {/* Profile - dla wszystkich zalogowanych */}
                <Button 
                  as={Link} 
                  to="/profile" 
                  variant="outlined"
                  size="small"
                >
                  <User size={16} style={{ marginRight: '4px' }} />
                  Profil
                </Button>

                <Button 
                  variant="text"
                  size="small"
                  onClick={handleSignOut}
                >
                  <LogOut size={16} style={{ marginRight: '4px' }} />
                  Wyloguj się
                </Button>
              </>
            ) : (
              <>
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outlined"
                  size="small"
                >
                  Zaloguj się
                </Button>
                <Button 
                  as={Link} 
                  to="/signup" 
                  variant="primary"
                  size="small"
                >
                  Zarejestruj się
                </Button>
              </>
            )}
          </Nav>
        </HeaderContent>
      </Container>
    </HeaderContainer>
  );
};

export default Header;