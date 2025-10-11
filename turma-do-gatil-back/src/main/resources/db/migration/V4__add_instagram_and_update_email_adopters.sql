-- ========================================
-- TURMA DO GATIL - MIGRATION V4
-- Adiciona campo instagram e torna email opcional na tabela adopters
-- ========================================

-- Adiciona coluna instagram à tabela adopters
ALTER TABLE adopters ADD COLUMN IF NOT EXISTS instagram VARCHAR(255);

-- Torna a coluna email opcional (remove a restrição NOT NULL)
ALTER TABLE adopters ALTER COLUMN email DROP NOT NULL;

