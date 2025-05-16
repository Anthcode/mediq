import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Users, Tag,  Clock } from 'lucide-react';
import { theme } from '../../styles/theme';
import { Card } from '../../components/common/Card';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { supabase } from '../../lib/supabase';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing(3)};
  margin-bottom: ${theme.spacing(4)};
`;

const StatCard = styled(Card)`
  display: flex;
  align-items: center;
  padding: ${theme.spacing(3)};
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${theme.borderRadius.medium};
  background-color: ${theme.colors.primary.light};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing(3)};
  
  svg {
    color: ${theme.colors.primary.main};
  }
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: ${theme.typography.fontWeightBold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing(0.5)};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${theme.colors.text.secondary};
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: ${theme.spacing(4)};
  color: ${theme.colors.text.primary};
`;

interface DashboardStats {
  doctorsCount: number;
  specialtiesCount: number;

  recentSignupsCount: number;
}

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: doctorsCount },
          specialtiesResult,
      
          { count: recentSignupsCount }
        ] = await Promise.all([
          supabase.from('doctors').select('*', { count: 'exact', head: true }),
          supabase.from('doctors').select('specialties').not('specialties', 'is', null),
          
          supabase.from('profiles')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        ]);

        // Count unique specialties by creating a Set from the specialties array
        const specialtiesCount = new Set(specialtiesResult.data?.map(d => d.specialties)).size;

        setStats({
          doctorsCount: doctorsCount || 0,
          specialtiesCount: specialtiesCount || 0,
          recentSignupsCount: recentSignupsCount || 0
        });
      } catch (err) {
        setError('Wystąpił błąd podczas ładowania statystyk');
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <AdminLayout>
        <LoadingSpinner />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div>{error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageTitle>Panel administratora</PageTitle>
      
      <DashboardGrid>
        <StatCard>
          <StatIcon>
            <Users size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats?.doctorsCount}</StatValue>
            <StatLabel>Lekarzy w bazie</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon>
            <Tag size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats?.specialtiesCount}</StatValue>
            <StatLabel>Specjalizacji</StatLabel>
          </StatContent>
        </StatCard>

        {/* <StatCard>
          <StatIcon>
            <Brain size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats?.expertiseAreasCount}</StatValue>
            <StatLabel>Obszarów ekspertyzy</StatLabel>
          </StatContent>
        </StatCard> */}

        <StatCard>
          <StatIcon>
            <Clock size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats?.recentSignupsCount}</StatValue>
            <StatLabel>Nowych użytkowników (30 dni)</StatLabel>
          </StatContent>
        </StatCard>
      </DashboardGrid>
    </AdminLayout>
  );
};

export default AdminDashboardPage;