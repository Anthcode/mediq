-- Funkcja do zarządzania adresami lekarza
CREATE OR REPLACE FUNCTION manage_doctor_addresses(
    p_doctor_id uuid,
    p_addresses jsonb
) RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    -- Usuń istniejące adresy
    DELETE FROM addresses WHERE doctor_id = p_doctor_id;
    
    -- Dodaj nowe adresy
    INSERT INTO addresses (
        doctor_id,
        street,
        city,
        state,
        postal_code,
        country
    )
    SELECT 
        p_doctor_id,
        (addr->>'street')::text,
        (addr->>'city')::text,
        (addr->>'state')::text,
        (addr->>'postal_code')::text,
        (addr->>'country')::text
    FROM jsonb_array_elements(p_addresses) as addr;
END;
$$;
