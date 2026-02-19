-- =====================================================
-- Add Admin Role System
-- =====================================================
-- Adiciona campo is_admin na tabela users
-- Permite diferenciar admins de usuários regulares

-- Adicionar campo is_admin
ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

-- Criar índice para consultas de admin
CREATE INDEX idx_users_is_admin ON users(is_admin) WHERE is_admin = TRUE;

-- Comentário
COMMENT ON COLUMN users.is_admin IS 'Flag para identificar usuários administradores';

-- Criar primeiro admin (ajuste o email!)
-- IMPORTANTE: Execute manualmente depois com email correto
-- UPDATE users SET is_admin = TRUE WHERE email = 'seu-email-admin@exemplo.com';
