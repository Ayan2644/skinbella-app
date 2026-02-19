-- =====================================================
-- Fix: Add UNIQUE constraint to leads.email
-- =====================================================
-- Permite upsert em leads com onConflict: 'email'
-- Necessário para webhook Kiwify processar leads

-- Adicionar constraint UNIQUE no email
ALTER TABLE leads ADD CONSTRAINT leads_email_unique UNIQUE (email);
