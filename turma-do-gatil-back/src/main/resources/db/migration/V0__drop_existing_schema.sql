-- ========================================
-- TURMA DO GATIL - LIMPEZA DE SCHEMA EXISTENTE
-- Esta migration garante que começamos com um banco limpo
-- ========================================

-- Desabilitar verificações de foreign key temporariamente
SET session_replication_role = 'replica';

-- Dropar tabelas se existirem (ordem inversa das foreign keys)
DROP TABLE IF EXISTS sterilizations CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS adoptions CASCADE;
DROP TABLE IF EXISTS cats CASCADE;
DROP TABLE IF EXISTS adopters CASCADE;

-- Dropar sequências se existirem
DROP SEQUENCE IF EXISTS cats_seq CASCADE;
DROP SEQUENCE IF EXISTS adopters_seq CASCADE;
DROP SEQUENCE IF EXISTS adoptions_seq CASCADE;
DROP SEQUENCE IF EXISTS notes_seq CASCADE;
DROP SEQUENCE IF EXISTS sterilizations_seq CASCADE;

-- Reabilitar verificações de foreign key
SET session_replication_role = 'origin';

-- Comentário informativo
COMMENT ON SCHEMA public IS 'Schema limpo e pronto para receber as tabelas do Turma do Gatil';

