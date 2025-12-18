-- ========================================
-- CRIAÇÃO DA TABELA DE ENDEREÇOS
-- Separação do endereço em campos estruturados
-- ========================================

-- Criação da tabela de endereços (addresses)
CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY,
    street VARCHAR(255) NOT NULL,
    neighborhood VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(2) NOT NULL,
    number VARCHAR(20) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    complement VARCHAR(255),
    adopter_id UUID NOT NULL UNIQUE,
    CONSTRAINT fk_address_adopter FOREIGN KEY (adopter_id) REFERENCES adopters(id) ON DELETE CASCADE
);

-- Criar índice para busca por adopter_id
CREATE INDEX IF NOT EXISTS idx_addresses_adopter_id ON addresses(adopter_id);

-- Migrar dados existentes: mover endereço atual para o campo street
INSERT INTO addresses (id, street, neighborhood, city, state, number, zip_code, complement, adopter_id)
SELECT 
    gen_random_uuid(),
    COALESCE(address, ''),
    '',
    '',
    '',
    '',
    '',
    NULL,
    id
FROM adopters;

-- Remover coluna address da tabela adopters
ALTER TABLE adopters DROP COLUMN address;
