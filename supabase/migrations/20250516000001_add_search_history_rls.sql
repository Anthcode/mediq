-- Dodanie polityk RLS dla tabeli search_history
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- Polityki RLS dla search_history
CREATE POLICY "Users can view their own search history"
    ON search_history FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create search history entries"
    ON search_history FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own search history"
    ON search_history FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
