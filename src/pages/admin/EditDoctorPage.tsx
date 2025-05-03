import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft } from 'lucide-react';
import { theme } from '../../styles/theme';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Button } from '../../components/common/Button';
import DoctorForm from '../../components/doctors/DoctorForm';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { supabase } from '../../lib/supabase';
import { DoctorService } from '../../services/doctorService';
import type { DoctorDTO, CreateDoctorCommand, UpdateDoctorCommand } from '../../types/dto';

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${theme.spacing(4)};
`;

const BackButton = styled(Button)`
  margin-right: ${theme.spacing(2)};
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  color: ${theme.colors.text.primary};
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error.main};
  text-align: center;
  padding: ${theme.spacing(2)};
  background-color: ${theme.colors.error.light};
  border-radius: ${theme.borderRadius.medium};
  margin-bottom: ${theme.spacing(3)};
`;

const EditDoctorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<DoctorDTO | null>(null);
  const [isLoading, setIsLoading] = useState(id ? true : false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) return;

      try {
        const doctorService = new DoctorService(supabase);
        const data = await doctorService.getDoctorById(id);
        setDoctor(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Nie udało się załadować danych lekarza');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDoctor();
    }
  }, [id]);

  const handleSubmit = async (data: CreateDoctorCommand | UpdateDoctorCommand) => {
    setIsSaving(true);
    try {
      const doctorService = new DoctorService(supabase);
      if (id) {
        await doctorService.updateDoctor(id, data as UpdateDoctorCommand);
      } else {
        await doctorService.createDoctor(data as CreateDoctorCommand);
      }
      navigate('/admin/doctors');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udało się zapisać danych lekarza');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/doctors');
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
        <BackButton 
          variant="text" 
          onClick={handleCancel}
        >
          <ArrowLeft size={18} style={{ marginRight: '4px' }} />
          Powrót
        </BackButton>
        <PageTitle>
          {id ? 'Edytuj lekarza' : 'Dodaj nowego lekarza'}
        </PageTitle>
      </PageHeader>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <DoctorForm
        doctor={doctor || undefined}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isSaving}
      />
    </AdminLayout>
  );
};

export default EditDoctorPage;