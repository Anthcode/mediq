import React from "react";
import styled from "styled-components";

const WrapperContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${({ theme }) =>
    theme.colors?.background?.default || "#f5f5f5"};
  padding: 2rem;
  width: 100%;
`;

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  background-color: ${({ theme }) => theme.colors?.success?.light || "#e8f5e8"};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors?.success?.main || "#4caf50"};
  margin: 1rem 0;
`;

const SuccessIcon = styled.div`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors?.success?.main || "#4caf50"};
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors?.success?.dark || "#2e7d32"};
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const Message = styled.p`
  color: ${({ theme }) => theme.colors?.text?.primary || "#333"};
  line-height: 1.6;
  margin-bottom: 1rem;
  max-width: 400px;
`;

const EmailNote = styled.p`
  color: ${({ theme }) => theme.colors?.text?.secondary || "#666"};
  font-size: 0.9rem;
  font-style: italic;
`;

interface RegistrationSuccessProps {
  email: string;
}

export const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({
  email,
}) => {
  return (
    <WrapperContainer>
      <SuccessContainer>
        <SuccessIcon>✉️</SuccessIcon>
        <Title>Rejestracja zakończona pomyślnie!</Title>
        <Message>
          Dziękujemy za rejestrację w MedIQ. Aby aktywować swoje konto, sprawdź
          swoją skrzynkę pocztową i kliknij w link potwierdzający.
        </Message>
        <EmailNote>
          Email został wysłany na adres: <strong>{email}</strong>
        </EmailNote>
      </SuccessContainer>
    </WrapperContainer>
  );
};
