import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Plus, Search } from 'lucide-react';
import { theme } from '../../styles/theme';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import DoctorsList from '../../components/doctors/DoctorsList';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import { DoctorService } from '../../services/doctorService';
import type { DoctorDTO } from '../../types/dto';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing(4)};
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  color: ${theme.colors.text.primary};
`;

const SearchContainer = styled.div`
  margin-bottom: ${theme.spacing(4)};
  max-width: 400px;
`;

const SearchInput = styled(Input)`
  padding-left: ${theme.spacing(5)};
`;

const SearchWrapper = styled.div`
  position: relative;

  svg {
    position: absolute;
    left: ${theme.spacing(1.5)};
    top: 50%;
    transform: translateY(-50%);
    color: ${theme.colors.text.secondary};
  }
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error.main};
  text-align: center;
  padding: ${theme.spacing(2)};
  background-color: ${theme.colors.error.light};
  border-radius: ${theme.borderRadius.medium};
  margin-bottom: ${theme.spacing(3)};
`;

const DoctorsPage: React.FC = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<DoctorDTO[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<DoctorDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDoctors = async () => {
    try {
      const doctorService = new DoctorService(supabase);
      const data = await doctorService.getDoctors();
      setDoctors(data);
      setFilteredDoctors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas ładowania lekarzy');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    const filterDoctors = () => {
      const query = searchQuery.toLowerCase();
      const filtered = doctors.filter(doctor => 
        doctor.first_name.toLowerCase().includes(query) ||
        doctor.last_name.toLowerCase().includes(query) ||
        (doctor.specialties && doctor.specialties.toLowerCase().includes(query))
      );
      setFilteredDoctors(filtered);
    };
    filterDoctors();
  }, [searchQuery, doctors]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDoctorDelete = async (id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
    setFilteredDoctors(prev => prev.filter(d => d.id !== id));
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <LoadingSpinner />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader>
        <PageTitle>Zarządzanie lekarzami</PageTitle>
        <Button onClick={() => navigate('/admin/doctors/new')}>
          <Plus size={18} style={{ marginRight: theme.spacing(1) }} />
          Dodaj lekarza
        </Button>
      </PageHeader>

      <SearchContainer>
        <SearchWrapper>
          <Search size={18} />
          <SearchInput
            type="text"
            placeholder="Szukaj lekarzy..."
            value={searchQuery}
            onChange={handleSearchChange}
            $fullWidth
          />
        </SearchWrapper>
      </SearchContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <DoctorsList 
        doctors={filteredDoctors} 
        isAdmin={true}
        onDeleteDoctor={handleDoctorDelete}
      />
    </AdminLayout>
  );
};

export default DoctorsPage;