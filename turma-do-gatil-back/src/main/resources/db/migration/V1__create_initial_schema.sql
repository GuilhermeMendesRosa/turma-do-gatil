-- ========================================
-- TURMA DO GATIL - SCHEMA INICIAL
-- Sistema de Gestão de Adoção de Gatos
-- ========================================

-- Criação da tabela de gatos (cats)
CREATE TABLE IF NOT EXISTS cats (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(50) NOT NULL,
    sex VARCHAR(10) NOT NULL,
    birth_date TIMESTAMP NOT NULL,
    shelter_entry_date TIMESTAMP NOT NULL,
    photo_url VARCHAR(500),
    adoption_status VARCHAR(50) NOT NULL
);

-- Criação da tabela de adotantes (adopters)
CREATE TABLE IF NOT EXISTS adopters (
    id UUID PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    birth_date TIMESTAMP NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    address VARCHAR(500) NOT NULL,
    registration_date TIMESTAMP NOT NULL
);

-- Criação da tabela de adoções (adoptions)
CREATE TABLE IF NOT EXISTS adoptions (
    id UUID PRIMARY KEY,
    cat_id UUID NOT NULL,
    adopter_id UUID NOT NULL,
    adoption_date TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    CONSTRAINT fk_adoption_cat FOREIGN KEY (cat_id) REFERENCES cats(id) ON DELETE CASCADE,
    CONSTRAINT fk_adoption_adopter FOREIGN KEY (adopter_id) REFERENCES adopters(id) ON DELETE CASCADE
);

-- Criação da tabela de anotações (notes)
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY,
    cat_id UUID NOT NULL,
    date TIMESTAMP NOT NULL,
    text TEXT NOT NULL,
    CONSTRAINT fk_note_cat FOREIGN KEY (cat_id) REFERENCES cats(id) ON DELETE CASCADE
);

-- Criação da tabela de esterilizações (sterilizations)
CREATE TABLE IF NOT EXISTS sterilizations (
    id UUID PRIMARY KEY,
    cat_id UUID NOT NULL,
    sterilization_date TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    CONSTRAINT fk_sterilization_cat FOREIGN KEY (cat_id) REFERENCES cats(id) ON DELETE CASCADE
);

-- Criação de índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_cats_adoption_status ON cats(adoption_status);
CREATE INDEX IF NOT EXISTS idx_cats_name ON cats(name);
CREATE INDEX IF NOT EXISTS idx_adopters_cpf ON adopters(cpf);
CREATE INDEX IF NOT EXISTS idx_adopters_email ON adopters(email);
CREATE INDEX IF NOT EXISTS idx_adoptions_cat_id ON adoptions(cat_id);
CREATE INDEX IF NOT EXISTS idx_adoptions_adopter_id ON adoptions(adopter_id);
CREATE INDEX IF NOT EXISTS idx_adoptions_status ON adoptions(status);
CREATE INDEX IF NOT EXISTS idx_notes_cat_id ON notes(cat_id);
CREATE INDEX IF NOT EXISTS idx_notes_date ON notes(date);
CREATE INDEX IF NOT EXISTS idx_sterilizations_cat_id ON sterilizations(cat_id);
CREATE INDEX IF NOT EXISTS idx_sterilizations_status ON sterilizations(status);

