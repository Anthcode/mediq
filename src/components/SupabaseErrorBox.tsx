import React from "react";
import styled from "styled-components";
import { useSupabaseError } from "../hooks/useSupabaseErrorBoundary";

const ErrorBox = styled.div`
  background: #ffeaea;
  color: #d8000c;
  border: 1px solid #d8000c;
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
`;

export const SupabaseErrorBox: React.FC = React.memo(() => {
  const { error, setError } = useSupabaseError();

  if (!error) return null;

  return (
    <ErrorBox role="alert">
      Nie można połączyć z bazą danych. Spróbuj ponownie później.
      <br />
      <small>{error}</small>
      <br />
      <button onClick={() => setError(null)}>Zamknij</button>
    </ErrorBox>
  );
});