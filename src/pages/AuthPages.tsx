import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';
import { theme } from '../styles/theme';
import { Container } from '../components/common/Container';
import { Button } from '../components/common/Button';
import { Input, Label, FormGroup, InputError } from '../components/common/Input';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: ${theme.spacing(4)} 0;
`;

const AuthCard = styled.div`
  background-color: ${theme.colors.background.paper};
  border-radius: ${theme.borderRadius.medium};
  box-shadow: ${theme.shadows.medium};
  padding: ${theme.spacing(6)};
  width: 100%;
  max-width: 480px;
`;

const AuthHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing(6)};
`;

const AuthTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: ${theme.spacing(1)};
`;

const AuthSubtitle = styled.p`
  color: ${theme.colors.text.secondary};
`;

const Form = styled.form`
  margin-bottom: ${theme.spacing(4)};
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: ${theme.spacing(1.5)};
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.text.secondary};
`;

const StyledInput = styled(Input)`
  padding-left: ${theme.spacing(5)};
`;

const Separator = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: ${theme.spacing(3)} 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid ${theme.colors.neutral.light};
  }
  
  &::before {
    margin-right: ${theme.spacing(1)};
  }
  
  &::after {
    margin-left: ${theme.spacing(1)};
  }
`;

const SeparatorText = styled.span`
  color: ${theme.colors.text.secondary};
  font-size: 0.875rem;
`;

const AuthFooter = styled.div`
  text-align: center;
  margin-top: ${theme.spacing(3)};
  font-size: 0.875rem;
  color: ${theme.colors.text.secondary};
`;

const AuthLink = styled(Link)`
  color: ${theme.colors.primary.main};
  font-weight: ${theme.typography.fontWeightMedium};
  margin-left: ${theme.spacing(0.5)};
`;

interface AuthFormData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface AuthError {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  general?: string;
}

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<AuthError>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const validateForm = (): boolean => {
    const newErrors: AuthError = {};
    
    if (!formData.email) {
      newErrors.email = 'Email jest wymagany';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Nieprawidłowy format email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Hasło jest wymagane';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Hasło musi mieć co najmniej 6 znaków';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof AuthError]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          throw new Error('Nie udało się pobrać profilu użytkownika');
        }

        setUser({
          id: data.user.id,
          email: data.user.email || '',
          first_name: data.user.user_metadata.first_name,
          last_name: data.user.user_metadata.last_name,
          role: profile.role
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Błąd logowania:', error);
      setErrors({
        general: 'Nieprawidłowy email lub hasło'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContainer>
      <Container $maxWidth="xs">
        <AuthCard>
          <AuthHeader>
            <AuthTitle>Zaloguj się</AuthTitle>
            <AuthSubtitle>Witaj ponownie w MedIQ</AuthSubtitle>
          </AuthHeader>
          
          <Form onSubmit={handleSubmit}>
            {errors.general && (
              <InputError style={{ marginBottom: theme.spacing(3), textAlign: 'center' }}>
                Nieprawidłowy email lub hasło
              </InputError>
            )}
            
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <InputWrapper>
                <InputIcon>
                  <Mail size={18} />
                </InputIcon>
                <StyledInput
                  id="email"
                  name="email"
                  type="email"
                  placeholder="twoj.email@przykład.pl"
                  value={formData.email}
                  onChange={handleChange}
                  $error={!!errors.email}
                  $fullWidth
                />
              </InputWrapper>
              {errors.email && <InputError>{errors.email}</InputError>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="password">Hasło</Label>
              <InputWrapper>
                <InputIcon>
                  <Lock size={18} />
                </InputIcon>
                <StyledInput
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  value={formData.password}
                  onChange={handleChange}
                  $error={!!errors.password}
                  $fullWidth
                />
              </InputWrapper>
              {errors.password && <InputError>{errors.password}</InputError>}
            </FormGroup>
            
            <Button 
              type="submit" 
              $fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Logowanie...' : 'Zaloguj się'}
            </Button>
          </Form>
          
          <Separator>
            <SeparatorText>Nie masz jeszcze konta?</SeparatorText>
          </Separator>
          
          <Button 
            as={Link} 
            to="/signup" 
            variant="outlined" 
            $fullWidth
          >
            Utwórz konto
            <ArrowRight size={16} style={{ marginLeft: '4px' }} />
          </Button>
        </AuthCard>
      </Container>
    </AuthContainer>
  );
};

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [errors, setErrors] = useState<AuthError>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const validateForm = (): boolean => {
    const newErrors: AuthError = {};
    
    if (!formData.firstName) {
      newErrors.firstName = 'Imię jest wymagane';
    }
    
    if (!formData.lastName) {
      newErrors.lastName = 'Nazwisko jest wymagane';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email jest wymagany';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Nieprawidłowy format email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Hasło jest wymagane';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Hasło musi mieć co najmniej 6 znaków';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof AuthError]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // 1. Próba utworzenia konta użytkownika
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName
          }
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
        if (data.user) {
        // 2. Utworzenie rekordu w tabeli profiles
        const { error: profileError } = await supabase.rpc('create_user_profile', {
          user_id: data.user.id,
          user_email: formData.email,
          user_first_name: formData.firstName,
          user_last_name: formData.lastName
        });

        if (profileError) {
          console.error('Błąd tworzenia profilu:', profileError);
          // W przypadku błędu przy tworzeniu profilu, próbujemy usunąć utworzone konto
          await supabase.auth.admin.deleteUser(data.user.id);
          throw new Error('Nie udało się utworzyć profilu użytkownika: ' + profileError.message);
        }

        setUser({
          id: data.user.id,
          email: data.user.email || '',
          first_name: formData.firstName!,
          last_name: formData.lastName!,
          role: 'user'
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Błąd rejestracji:', error);
      setErrors({
        general: `${error instanceof Error ? error.message : 'Nieznany błąd'}`
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContainer>
      <Container $maxWidth="xs">
        <AuthCard>
          <AuthHeader>
            <AuthTitle>Utwórz konto</AuthTitle>
            <AuthSubtitle>Dołącz do MedIQ i znajdź odpowiedniego lekarza</AuthSubtitle>
          </AuthHeader>
          
          <Form onSubmit={handleSubmit}>
            {errors.general && (
              <InputError style={{ marginBottom: theme.spacing(3), textAlign: 'center' }}>
                {errors.general}
              </InputError>
            )}
            
            <FormGroup>
              <Label htmlFor="firstName">Imię</Label>
              <InputWrapper>
                <InputIcon>
                  <User size={18} />
                </InputIcon>
                <StyledInput
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Jan"
                  value={formData.firstName}
                  onChange={handleChange}
                  $error={!!errors.firstName}
                  $fullWidth
                />
              </InputWrapper>
              {errors.firstName && <InputError>{errors.firstName}</InputError>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="lastName">Nazwisko</Label>
              <InputWrapper>
                <InputIcon>
                  <User size={18} />
                </InputIcon>
                <StyledInput
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Kowalski"
                  value={formData.lastName}
                  onChange={handleChange}
                  $error={!!errors.lastName}
                  $fullWidth
                />
              </InputWrapper>
              {errors.lastName && <InputError>{errors.lastName}</InputError>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <InputWrapper>
                <InputIcon>
                  <Mail size={18} />
                </InputIcon>
                <StyledInput
                  id="email"
                  name="email"
                  type="email"
                  placeholder="twoj.email@przykład.pl"
                  value={formData.email}
                  onChange={handleChange}
                  $error={!!errors.email}
                  $fullWidth
                />
              </InputWrapper>
              {errors.email && <InputError>{errors.email}</InputError>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="password">Hasło</Label>
              <InputWrapper>
                <InputIcon>
                  <Lock size={18} />
                </InputIcon>
                <StyledInput
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  value={formData.password}
                  onChange={handleChange}
                  $error={!!errors.password}
                  $fullWidth
                />
              </InputWrapper>
              {errors.password && <InputError>{errors.password}</InputError>}
            </FormGroup>
            
            <Button 
              type="submit" 
              $fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Tworzenie konta...' : 'Utwórz konto'}
            </Button>
          </Form>
          
          <AuthFooter>
            Masz już konto?
            <AuthLink to="/login">Zaloguj się</AuthLink>
          </AuthFooter>
        </AuthCard>
      </Container>
    </AuthContainer>
  );
};