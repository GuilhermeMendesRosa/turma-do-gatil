-- ========================================
-- TURMA DO GATIL - DATABASE DUMP EXPANDIDO
-- Sistema de Gestão de Adoção de Gatos
-- Versão com dados ampliados
-- ========================================

-- Limpar todas as tabelas (ordem importante devido às foreign keys)
TRUNCATE TABLE adoptions CASCADE;
TRUNCATE TABLE notes CASCADE;
TRUNCATE TABLE sterilizations CASCADE;
TRUNCATE TABLE cats CASCADE;
TRUNCATE TABLE adopters CASCADE;

-- ========================================
-- INSERIR DADOS DE GATOS (48 gatos)
-- ========================================

INSERT INTO cats (id, name, color, sex, birth_date, shelter_entry_date, photo_url, adoption_status) VALUES
-- Gatos disponíveis para adoção (28 gatos)
('550e8400-e29b-41d4-a716-446655440001', 'Whiskers', 'WHITE', 'FEMALE', '2023-03-15 10:00:00', '2023-05-01 09:30:00', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'EM_PROCESSO'),
('550e8400-e29b-41d4-a716-446655440002', 'Shadow', 'BLACK', 'MALE', '2022-11-20 14:30:00', '2023-02-10 11:15:00', 'https://images.unsplash.com/photo-1506755855567-92ff770e8d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),
('550e8400-e29b-41d4-a716-446655440003', 'Mimi', 'CALICO', 'FEMALE', '2023-07-08 08:45:00', '2023-08-15 16:20:00', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'EM_PROCESSO'),
('550e8400-e29b-41d4-a716-446655440004', 'Tiger', 'ORANGE', 'MALE', '2022-12-03 12:00:00', '2023-03-20 10:45:00', 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),
('550e8400-e29b-41d4-a716-446655440005', 'Luna', 'GRAY', 'FEMALE', '2023-01-25 16:30:00', '2023-04-05 14:00:00', 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),
('550e8400-e29b-41d4-a716-446655440006', 'Simba', 'BROWN', 'MALE', '2022-10-12 09:15:00', '2023-01-18 13:30:00', 'https://images.unsplash.com/photo-1611267254323-4db7b39c732c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),
('550e8400-e29b-41d4-a716-446655440007', 'Nala', 'MIXED', 'FEMALE', '2023-04-02 11:20:00', '2023-06-12 08:45:00', 'https://images.unsplash.com/photo-1571566882372-1598d88abd90?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),
('550e8400-e29b-41d4-a716-446655440008', 'Felix', 'TABBY', 'MALE', '2022-09-18 13:40:00', '2023-01-05 15:10:00', 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),
('550e8400-e29b-41d4-a716-446655440011', 'Garfield', 'ORANGE', 'MALE', '2022-08-22 11:30:00', '2023-01-12 10:15:00', 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),
('550e8400-e29b-41d4-a716-446655440012', 'Mittens', 'WHITE', 'FEMALE', '2023-02-14 09:45:00', '2023-04-20 14:30:00', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),
('550e8400-e29b-41d4-a716-446655440013', 'Smokey', 'GRAY', 'MALE', '2022-12-30 16:20:00', '2023-03-15 11:45:00', 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),
('550e8400-e29b-41d4-a716-446655440014', 'Princess', 'CALICO', 'FEMALE', '2023-05-18 12:15:00', '2023-07-22 09:00:00', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),
('550e8400-e29b-41d4-a716-446655440015', 'Oreo', 'BLACK', 'MALE', '2022-11-05 14:50:00', '2023-02-28 13:20:00', 'https://images.unsplash.com/photo-1506755855567-92ff770e8d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'EM_PROCESSO'),
('550e8400-e29b-41d4-a716-446655440016', 'Chloe', 'BROWN', 'FEMALE', '2023-01-08 10:30:00', '2023-03-25 15:45:00', 'https://images.unsplash.com/photo-1611267254323-4db7b39c732c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),
('550e8400-e29b-41d4-a716-446655440017', 'Boots', 'TABBY', 'MALE', '2022-10-28 08:15:00', '2023-01-30 12:00:00', 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),
('550e8400-e29b-41d4-a716-446655440018', 'Patches', 'MIXED', 'FEMALE', '2023-06-12 13:25:00', '2023-08-05 10:40:00', 'https://images.unsplash.com/photo-1571566882372-1598d88abd90?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),
('550e8400-e29b-41d4-a716-446655440019', 'Ginger', 'ORANGE', 'FEMALE', '2022-09-03 15:10:00', '2022-12-18 11:30:00', 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),
('550e8400-e29b-41d4-a716-446655440020', 'Snowball', 'WHITE', 'MALE', '2023-04-25 09:55:00', '2023-06-30 14:15:00', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),
('550e8400-e29b-41d4-a716-446655440021', 'Midnight', 'BLACK', 'FEMALE', '2022-07-16 12:40:00', '2022-11-08 16:25:00', 'https://images.unsplash.com/photo-1506755855567-92ff770e8d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'EM_PROCESSO'),
('550e8400-e29b-41d4-a716-446655440022', 'Pumpkin', 'ORANGE', 'MALE', '2023-03-07 11:05:00', '2023-05-14 09:50:00', 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),
('550e8400-e29b-41d4-a716-446655440023', 'Duchess', 'GRAY', 'FEMALE', '2022-12-11 14:20:00', '2023-02-05 13:35:00', 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),
('550e8400-e29b-41d4-a716-446655440024', 'Bandit', 'TABBY', 'MALE', '2023-08-01 10:45:00', '2023-09-20 15:10:00', 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),
('550e8400-e29b-41d4-a716-446655440025', 'Rosie', 'CALICO', 'FEMALE', '2022-11-28 16:30:00', '2023-01-22 12:45:00', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),
('550e8400-e29b-41d4-a716-446655440026', 'Chester', 'BROWN', 'MALE', '2023-02-28 08:20:00', '2023-04-15 11:00:00', 'https://images.unsplash.com/photo-1611267254323-4db7b39c732c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'EM_PROCESSO'),
('550e8400-e29b-41d4-a716-446655440027', 'Daisy', 'MIXED', 'FEMALE', '2023-07-20 13:15:00', '2023-09-10 10:30:00', 'https://images.unsplash.com/photo-1571566882372-1598d88abd90?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),
('550e8400-e29b-41d4-a716-446655440028', 'Oscar', 'BLACK', 'MALE', '2022-10-15 15:40:00', '2023-01-08 14:25:00', 'https://images.unsplash.com/photo-1506755855567-92ff770e8d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),
('550e8400-e29b-41d4-a716-446655440029', 'Lily', 'WHITE', 'FEMALE', '2023-05-03 09:10:00', '2023-07-18 16:45:00', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),
('550e8400-e29b-41d4-a716-446655440030', 'Rusty', 'ORANGE', 'MALE', '2022-08-09 12:55:00', '2022-12-03 09:20:00', 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),

-- Gatos já adotados (20 gatos)
('550e8400-e29b-41d4-a716-446655440009', 'Bella', 'WHITE', 'FEMALE', '2022-08-14 10:30:00', '2022-12-20 09:00:00', 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'ADOTADO'),
('550e8400-e29b-41d4-a716-446655440010', 'Max', 'BLACK', 'MALE', '2022-06-30 14:15:00', '2022-11-15 11:30:00', 'https://images.unsplash.com/photo-1551717743-49959800b1f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'ADOTADO'),
('550e8400-e29b-41d4-a716-446655440031', 'Charlie', 'TABBY', 'MALE', '2022-05-20 11:45:00', '2022-09-12 14:20:00', 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'ADOTADO'),
('550e8400-e29b-41d4-a716-446655440032', 'Sophie', 'CALICO', 'FEMALE', '2022-07-08 09:30:00', '2022-10-25 16:15:00', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'ADOTADO'),
('550e8400-e29b-41d4-a716-446655440033', 'Buddy', 'BROWN', 'MALE', '2022-04-15 13:20:00', '2022-08-30 10:45:00', 'https://images.unsplash.com/photo-1611267254323-4db7b39c732c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'ADOTADO'),
('550e8400-e29b-41d4-a716-446655440034', 'Molly', 'GRAY', 'FEMALE', '2022-09-25 15:10:00', '2023-01-14 12:30:00', 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'ADOTADO'),
('550e8400-e29b-41d4-a716-446655440035', 'Rocky', 'BLACK', 'MALE', '2022-03-12 10:25:00', '2022-07-18 14:50:00', 'https://images.unsplash.com/photo-1506755855567-92ff770e8d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'ADOTADO'),
('550e8400-e29b-41d4-a716-446655440036', 'Zoe', 'ORANGE', 'FEMALE', '2022-11-03 12:40:00', '2023-02-20 09:15:00', 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'ADOTADO'),
('550e8400-e29b-41d4-a716-446655440037', 'Toby', 'MIXED', 'MALE', '2022-06-18 14:55:00', '2022-10-08 11:20:00', 'https://images.unsplash.com/photo-1571566882372-1598d88abd90?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'ADOTADO'),
('550e8400-e29b-41d4-a716-446655440038', 'Coco', 'BROWN', 'FEMALE', '2022-12-07 16:35:00', '2023-03-15 13:45:00', 'https://images.unsplash.com/photo-1611267254323-4db7b39c732c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'ADOTADO'),
('550e8400-e29b-41d4-a716-446655440039', 'Leo', 'TABBY', 'MALE', '2022-08-28 11:15:00', '2022-12-12 15:30:00', 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'ADOTADO'),
('550e8400-e29b-41d4-a716-446655440040', 'Ruby', 'CALICO', 'FEMALE', '2022-10-05 09:50:00', '2023-01-28 12:10:00', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'ADOTADO'),
('550e8400-e29b-41d4-a716-446655440041', 'Jasper', 'GRAY', 'MALE', '2022-07-22 13:25:00', '2022-11-30 10:40:00', 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'ADOTADO'),
('550e8400-e29b-41d4-a716-446655440042', 'Penny', 'WHITE', 'FEMALE', '2022-09-14 15:05:00', '2023-01-05 14:25:00', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'ADOTADO'),
('550e8400-e29b-41d4-a716-446655440043', 'Buster', 'BLACK', 'MALE', '2022-05-30 12:20:00', '2022-09-25 16:45:00', 'https://images.unsplash.com/photo-1506755855567-92ff770e8d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'ADOTADO'),
('550e8400-e29b-41d4-a716-446655440044', 'Hazel', 'BROWN', 'FEMALE', '2022-11-18 10:35:00', '2023-02-12 13:20:00', 'https://images.unsplash.com/photo-1611267254323-4db7b39c732c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'ADOTADO'),
('550e8400-e29b-41d4-a716-446655440045', 'Milo', 'ORANGE', 'MALE', '2022-04-08 14:10:00', '2022-08-15 11:55:00', 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'ADOTADO'),
('550e8400-e29b-41d4-a716-446655440046', 'Stella', 'MIXED', 'FEMALE', '2022-12-22 16:45:00', '2023-04-10 09:30:00', 'https://images.unsplash.com/photo-1571566882372-1598d88abd90?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'ADOTADO'),
('550e8400-e29b-41d4-a716-446655440047', 'Tucker', 'TABBY', 'MALE', '2022-06-05 11:25:00', '2022-10-20 15:15:00', 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'ADOTADO'),
('550e8400-e29b-41d4-a716-446655440048', 'Lola', 'CALICO', 'FEMALE', '2022-08-17 09:40:00', '2022-12-28 12:50:00', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'ADOTADO');

-- ========================================
-- INSERIR DADOS DE ADOTANTES (30 adotantes)
-- ========================================

INSERT INTO adopters (id, first_name, last_name, birth_date, cpf, phone, email, address, registration_date) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Maria', 'Silva', '1985-04-12 00:00:00', '12345678901', '(11) 99999-1111', 'maria.silva@email.com', 'Rua das Flores, 123, São Paulo, SP', '2023-01-15 10:30:00'),
('660e8400-e29b-41d4-a716-446655440002', 'João', 'Santos', '1990-08-25 00:00:00', '23456789012', '(11) 99999-2222', 'joao.santos@email.com', 'Av. Paulista, 456, São Paulo, SP', '2023-02-20 14:15:00'),
('660e8400-e29b-41d4-a716-446655440003', 'Ana', 'Costa', '1992-11-08 00:00:00', '34567890123', '(11) 99999-3333', 'ana.costa@email.com', 'Rua dos Lírios, 789, São Paulo, SP', '2023-03-10 09:45:00'),
('660e8400-e29b-41d4-a716-446655440004', 'Carlos', 'Oliveira', '1988-02-14 00:00:00', '45678901234', '(11) 99999-4444', 'carlos.oliveira@email.com', 'Rua das Rosas, 321, São Paulo, SP', '2023-04-05 16:20:00'),
('660e8400-e29b-41d4-a716-446655440005', 'Fernanda', 'Lima', '1995-06-30 00:00:00', '56789012345', '(11) 99999-5555', 'fernanda.lima@email.com', 'Av. Brasil, 654, São Paulo, SP', '2023-05-12 11:10:00'),
('660e8400-e29b-41d4-a716-446655440006', 'Roberto', 'Almeida', '1987-09-18 00:00:00', '67890123456', '(11) 99999-6666', 'roberto.almeida@email.com', 'Rua da Paz, 987, São Paulo, SP', '2023-06-08 13:25:00'),
('660e8400-e29b-41d4-a716-446655440007', 'Juliana', 'Ferreira', '1991-12-22 00:00:00', '78901234567', '(11) 99999-7777', 'juliana.ferreira@email.com', 'Rua das Acácias, 147, São Paulo, SP', '2022-11-18 15:40:00'),
('660e8400-e29b-41d4-a716-446655440008', 'Pedro', 'Martins', '1986-05-17 00:00:00', '89012345678', '(11) 99999-8888', 'pedro.martins@email.com', 'Av. Independência, 258, São Paulo, SP', '2022-12-05 12:20:00'),
('660e8400-e29b-41d4-a716-446655440009', 'Camila', 'Rodrigues', '1993-03-09 00:00:00', '90123456789', '(11) 99999-9999', 'camila.rodrigues@email.com', 'Rua dos Girassóis, 369, São Paulo, SP', '2023-01-28 09:15:00'),
('660e8400-e29b-41d4-a716-446655440010', 'Lucas', 'Pereira', '1989-07-31 00:00:00', '01234567890', '(11) 99999-0000', 'lucas.pereira@email.com', 'Av. das Nações, 741, São Paulo, SP', '2022-10-12 14:50:00'),
('660e8400-e29b-41d4-a716-446655440011', 'Beatriz', 'Gomes', '1994-10-14 00:00:00', '11234567890', '(11) 98888-1111', 'beatriz.gomes@email.com', 'Rua das Palmeiras, 852, São Paulo, SP', '2022-09-25 11:35:00'),
('660e8400-e29b-41d4-a716-446655440012', 'Rafael', 'Barbosa', '1987-01-26 00:00:00', '22345678901', '(11) 98888-2222', 'rafael.barbosa@email.com', 'Av. Central, 963, São Paulo, SP', '2022-08-14 16:10:00'),
('660e8400-e29b-41d4-a716-446655440013', 'Larissa', 'Carvalho', '1992-08-03 00:00:00', '33456789012', '(11) 98888-3333', 'larissa.carvalho@email.com', 'Rua dos Cravos, 174, São Paulo, SP', '2023-02-07 13:45:00'),
('660e8400-e29b-41d4-a716-446655440014', 'Thiago', 'Nascimento', '1990-04-19 00:00:00', '44567890123', '(11) 98888-4444', 'thiago.nascimento@email.com', 'Av. Liberdade, 285, São Paulo, SP', '2022-12-30 10:25:00'),
('660e8400-e29b-41d4-a716-446655440015', 'Gabriela', 'Sousa', '1988-11-07 00:00:00', '55678901234', '(11) 98888-5555', 'gabriela.sousa@email.com', 'Rua das Violetas, 396, São Paulo, SP', '2023-03-22 15:20:00'),
('660e8400-e29b-41d4-a716-446655440016', 'Diego', 'Ribeiro', '1991-06-12 00:00:00', '66789012345', '(11) 98888-6666', 'diego.ribeiro@email.com', 'Av. Progresso, 507, São Paulo, SP', '2022-11-08 12:55:00'),
('660e8400-e29b-41d4-a716-446655440017', 'Mariana', 'Teixeira', '1993-09-28 00:00:00', '77890123456', '(11) 98888-7777', 'mariana.teixeira@email.com', 'Rua dos Jasmins, 618, São Paulo, SP', '2023-01-16 09:40:00'),
('660e8400-e29b-41d4-a716-446655440018', 'Gustavo', 'Moreira', '1985-12-05 00:00:00', '88901234567', '(11) 98888-8888', 'gustavo.moreira@email.com', 'Av. Esperança, 729, São Paulo, SP', '2022-10-28 14:30:00'),
('660e8400-e29b-41d4-a716-446655440019', 'Natália', 'Cardoso', '1994-02-21 00:00:00', '99012345678', '(11) 98888-9999', 'natalia.cardoso@email.com', 'Rua das Orquídeas, 830, São Paulo, SP', '2023-04-14 11:15:00'),
('660e8400-e29b-41d4-a716-446655440020', 'Bruno', 'Mendes', '1989-05-16 00:00:00', '00123456789', '(11) 98888-0000', 'bruno.mendes@email.com', 'Av. Vitória, 941, São Paulo, SP', '2022-09-12 16:45:00'),
('660e8400-e29b-41d4-a716-446655440021', 'Patrícia', 'Araújo', '1986-08-29 00:00:00', '10234567890', '(11) 97777-1111', 'patricia.araujo@email.com', 'Rua dos Lírios, 152, São Paulo, SP', '2023-05-30 13:20:00'),
('660e8400-e29b-41d4-a716-446655440022', 'Rodrigo', 'Dias', '1992-11-11 00:00:00', '20345678901', '(11) 97777-2222', 'rodrigo.dias@email.com', 'Av. Harmonia, 263, São Paulo, SP', '2022-12-18 10:05:00'),
('660e8400-e29b-41d4-a716-446655440023', 'Vanessa', 'Pinto', '1990-03-24 00:00:00', '30456789012', '(11) 97777-3333', 'vanessa.pinto@email.com', 'Rua das Margaridas, 374, São Paulo, SP', '2023-02-25 15:50:00'),
('660e8400-e29b-41d4-a716-446655440024', 'Felipe', 'Castro', '1987-07-08 00:00:00', '40567890123', '(11) 97777-4444', 'felipe.castro@email.com', 'Av. Alegria, 485, São Paulo, SP', '2022-11-22 12:35:00'),
('660e8400-e29b-41d4-a716-446655440025', 'Amanda', 'Ramos', '1995-10-13 00:00:00', '50678901234', '(11) 97777-5555', 'amanda.ramos@email.com', 'Rua dos Crisântemos, 596, São Paulo, SP', '2023-01-09 09:25:00'),
('660e8400-e29b-41d4-a716-446655440026', 'Marcelo', 'Freitas', '1988-01-27 00:00:00', '60789012345', '(11) 97777-6666', 'marcelo.freitas@email.com', 'Av. Serenidade, 607, São Paulo, SP', '2022-08-30 14:10:00'),
('660e8400-e29b-41d4-a716-446655440027', 'Renata', 'Correia', '1991-04-15 00:00:00', '70890123456', '(11) 97777-7777', 'renata.correia@email.com', 'Rua das Azaleias, 718, São Paulo, SP', '2023-03-18 11:45:00'),
('660e8400-e29b-41d4-a716-446655440028', 'André', 'Lopes', '1993-06-02 00:00:00', '80901234567', '(11) 97777-8888', 'andre.lopes@email.com', 'Av. Tranquilidade, 829, São Paulo, SP', '2022-10-05 16:30:00'),
('660e8400-e29b-41d4-a716-446655440029', 'Carolina', 'Machado', '1989-09-20 00:00:00', '90012345678', '(11) 97777-9999', 'carolina.machado@email.com', 'Rua dos Narcisos, 930, São Paulo, SP', '2023-04-28 13:15:00'),
('660e8400-e29b-41d4-a716-446655440030', 'Vinícius', 'Cunha', '1986-12-09 00:00:00', '01123456789', '(11) 97777-0000', 'vinicius.cunha@email.com', 'Av. Felicidade, 041, São Paulo, SP', '2022-07-15 10:50:00');

-- ========================================
-- INSERIR DADOS DE ADOÇÕES (35 adoções)
-- ========================================

INSERT INTO adoptions (id, cat_id, adopter_id, adoption_date, status) VALUES
-- Adoções completadas (20)
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440001', '2023-02-15 14:30:00', 'COMPLETED'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440002', '2023-03-20 10:15:00', 'COMPLETED'),
('770e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440031', '660e8400-e29b-41d4-a716-446655440007', '2022-12-05 15:20:00', 'COMPLETED'),
('770e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440032', '660e8400-e29b-41d4-a716-446655440008', '2022-12-28 11:45:00', 'COMPLETED'),
('770e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440033', '660e8400-e29b-41d4-a716-446655440009', '2023-01-18 09:30:00', 'COMPLETED'),
('770e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440034', '660e8400-e29b-41d4-a716-446655440010', '2023-02-28 14:15:00', 'COMPLETED'),
('770e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440035', '660e8400-e29b-41d4-a716-446655440011', '2022-10-15 16:40:00', 'COMPLETED'),
('770e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440036', '660e8400-e29b-41d4-a716-446655440012', '2023-03-25 12:20:00', 'COMPLETED'),
('770e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440037', '660e8400-e29b-41d4-a716-446655440013', '2022-11-30 10:55:00', 'COMPLETED'),
('770e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440038', '660e8400-e29b-41d4-a716-446655440014', '2023-04-08 15:10:00', 'COMPLETED'),
('770e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440039', '660e8400-e29b-41d4-a716-446655440015', '2023-01-05 13:35:00', 'COMPLETED'),
('770e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440040', '660e8400-e29b-41d4-a716-446655440016', '2023-02-18 11:25:00', 'COMPLETED'),
('770e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440041', '660e8400-e29b-41d4-a716-446655440017', '2022-12-22 09:50:00', 'COMPLETED'),
('770e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440042', '660e8400-e29b-41d4-a716-446655440018', '2023-01-28 14:45:00', 'COMPLETED'),
('770e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440043', '660e8400-e29b-41d4-a716-446655440019', '2022-10-28 16:15:00', 'COMPLETED'),
('770e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440044', '660e8400-e29b-41d4-a716-446655440020', '2023-03-12 12:40:00', 'COMPLETED'),
('770e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440045', '660e8400-e29b-41d4-a716-446655440021', '2022-09-18 10:20:00', 'COMPLETED'),
('770e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440046', '660e8400-e29b-41d4-a716-446655440022', '2023-05-05 15:30:00', 'COMPLETED'),
('770e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440047', '660e8400-e29b-41d4-a716-446655440023', '2022-11-12 13:55:00', 'COMPLETED'),
('770e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440048', '660e8400-e29b-41d4-a716-446655440024', '2023-01-22 11:10:00', 'COMPLETED'),

-- Adoções pendentes (10)
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', '2024-01-10 09:00:00', 'PENDING'),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440004', '2024-01-15 11:30:00', 'PENDING'),
('770e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440015', '660e8400-e29b-41d4-a716-446655440025', '2024-01-20 14:15:00', 'PENDING'),
('770e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440021', '660e8400-e29b-41d4-a716-446655440026', '2024-01-25 10:45:00', 'PENDING'),
('770e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440026', '660e8400-e29b-41d4-a716-446655440027', '2024-02-01 16:20:00', 'PENDING'),
('770e8400-e29b-41d4-a716-446655440027', '550e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440028', '2024-02-05 13:30:00', 'PENDING'),
('770e8400-e29b-41d4-a716-446655440028', '550e8400-e29b-41d4-a716-446655440014', '660e8400-e29b-41d4-a716-446655440029', '2024-02-10 09:15:00', 'PENDING'),
('770e8400-e29b-41d4-a716-446655440029', '550e8400-e29b-41d4-a716-446655440019', '660e8400-e29b-41d4-a716-446655440030', '2024-02-12 11:50:00', 'PENDING'),
('770e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440022', '660e8400-e29b-41d4-a716-446655440006', '2024-02-15 15:25:00', 'PENDING'),
('770e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440025', '660e8400-e29b-41d4-a716-446655440005', '2024-02-18 12:40:00', 'PENDING'),

-- Adoções canceladas (5)
('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440005', '2023-12-20 16:45:00', 'CANCELED'),
('770e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440012', '660e8400-e29b-41d4-a716-446655440011', '2023-11-15 14:20:00', 'CANCELED'),
('770e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440016', '660e8400-e29b-41d4-a716-446655440013', '2023-10-28 10:35:00', 'CANCELED'),
('770e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440020', '660e8400-e29b-41d4-a716-446655440017', '2023-12-05 13:15:00', 'CANCELED'),
('770e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-446655440028', '660e8400-e29b-41d4-a716-446655440019', '2023-11-22 15:50:00', 'CANCELED');

-- ========================================
-- INSERIR DADOS DE ANOTAÇÕES (120+ anotações)
-- ========================================

INSERT INTO notes (id, cat_id, date, text) VALUES
-- Anotações para Whiskers
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '2023-05-01 09:30:00', 'Whiskers chegou ao abrigo em boas condições de saúde. Muito carinhosa e sociável.'),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '2023-05-15 14:20:00', 'Whiskers passou por consulta veterinária. Vacinação em dia.'),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '2023-06-01 10:45:00', 'Whiskers demonstra interesse em brinquedos. Adora carinho na barriga.'),
('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', '2023-12-15 16:30:00', 'Whiskers interage bem com visitantes. Potencial para adoção rápida.'),

-- Anotações para Shadow
('880e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', '2023-02-10 11:15:00', 'Shadow resgatado da rua. Inicialmente tímido, mas se adaptou bem ao ambiente.'),
('880e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', '2023-03-01 16:30:00', 'Shadow tratamento para vermes concluído. Ganhou peso e está mais ativo.'),
('880e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440002', '2023-08-20 14:15:00', 'Shadow gosta de dormir em lugares altos. Muito observador.'),

-- Anotações para Mimi
('880e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', '2023-08-15 16:20:00', 'Mimi muito brincalhona. Adora outros gatos e é muito sociável.'),
('880e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440003', '2023-09-10 11:30:00', 'Mimi adora brincar com bolinhas de papel. Muito ativa durante a manhã.'),
('880e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440003', '2023-11-25 13:45:00', 'Mimi necessita de escovação regular devido ao pelo longo.'),

-- Anotações para Tiger
('880e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440004', '2023-03-20 10:45:00', 'Tiger de grande porte. Muito calmo e dócil. Ideal para famílias com crianças.'),
('880e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440004', '2023-04-10 09:15:00', 'Tiger teve pequeno problema digestivo, mas já resolvido com medicação.'),
('880e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440004', '2023-07-18 15:20:00', 'Tiger tem preferência por ração seca. Come bem e mantém peso ideal.'),

-- Anotações para Luna
('880e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440005', '2023-04-05 14:00:00', 'Luna muito independente. Prefere ambientes calmos e tranquilos.'),
('880e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440005', '2023-06-22 10:30:00', 'Luna apresentou melhora significativa no comportamento social.'),
('880e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440005', '2023-09-05 16:45:00', 'Luna adora carinho atrás das orelhas. Ronrona muito.'),

-- Anotações para Simba
('880e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440006', '2023-01-18 13:30:00', 'Simba tem hábito de seguir os cuidadores pelo abrigo.'),
('880e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440006', '2023-05-12 11:20:00', 'Simba prefere ambientes com menos movimento. Gato mais reservado.'),

-- Anotações para Nala
('880e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440007', '2023-06-12 08:45:00', 'Nala excelente apetite. Come tanto ração seca quanto úmida.'),
('880e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440007', '2023-08-30 14:25:00', 'Nala muito curiosa. Investiga todos os cantos do ambiente.'),

-- Anotações para Felix
('880e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440008', '2023-01-05 15:10:00', 'Felix adora brincar com bolinhas de papel. Muito ativo durante a manhã.'),
('880e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440008', '2023-04-18 12:35:00', 'Felix tem preferência por ração seca. Come bem e mantém peso ideal.'),

-- Anotações para Garfield
('880e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440011', '2023-01-12 10:15:00', 'Garfield gosta de dormir em lugares altos. Muito observador.'),
('880e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440011', '2023-03-28 15:40:00', 'Garfield interage bem com visitantes. Potencial para adoção rápida.'),
('880e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440011', '2023-07-14 09:25:00', 'Garfield necessita de escovação regular devido ao pelo longo.'),

-- Anotações para Mittens
('880e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440012', '2023-04-20 14:30:00', 'Mittens apresentou melhora significativa no comportamento social.'),
('880e8400-e29b-41d4-a716-446655440027', '550e8400-e29b-41d4-a716-446655440012', '2023-08-08 11:15:00', 'Mittens adora carinho atrás das orelhas. Ronrona muito.'),

-- Anotações para Smokey
('880e8400-e29b-41d4-a716-446655440028', '550e8400-e29b-41d4-a716-446655440013', '2023-03-15 11:45:00', 'Smokey tem hábito de seguir os cuidadores pelo abrigo.'),
('880e8400-e29b-41d4-a716-446655440029', '550e8400-e29b-41d4-a716-446655440013', '2023-06-30 16:20:00', 'Smokey prefere ambientes com menos movimento. Gato mais reservado.'),
('880e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440013', '2023-10-12 13:10:00', 'Smokey excelente apetite. Come tanto ração seca quanto úmida.'),

-- Anotações para Princess
('880e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440014', '2023-07-22 09:00:00', 'Princess muito curiosa. Investiga todos os cantos do ambiente.'),
('880e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440014', '2023-09-16 14:45:00', 'Princess adora brincar com bolinhas de papel. Muito ativa durante a manhã.'),

-- Anotações para Oreo
('880e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440015', '2023-02-28 13:20:00', 'Oreo tem preferência por ração seca. Come bem e mantém peso ideal.'),
('880e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440015', '2023-06-14 10:35:00', 'Oreo gosta de dormir em lugares altos. Muito observador.'),
('880e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-446655440015', '2023-11-08 15:50:00', 'Oreo interage bem com visitantes. Potencial para adoção rápida.'),

-- Anotações para Chloe
('880e8400-e29b-41d4-a716-446655440036', '550e8400-e29b-41d4-a716-446655440016', '2023-03-25 15:45:00', 'Chloe necessita de escovação regular devido ao pelo longo.'),
('880e8400-e29b-41d4-a716-446655440037', '550e8400-e29b-41d4-a716-446655440016', '2023-07-11 12:20:00', 'Chloe apresentou melhora significativa no comportamento social.'),

-- Anotações para Boots
('880e8400-e29b-41d4-a716-446655440038', '550e8400-e29b-41d4-a716-446655440017', '2023-01-30 12:00:00', 'Boots adora carinho atrás das orelhas. Ronrona muito.'),
('880e8400-e29b-41d4-a716-446655440039', '550e8400-e29b-41d4-a716-446655440017', '2023-05-25 09:40:00', 'Boots tem hábito de seguir os cuidadores pelo abrigo.'),
('880e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440017', '2023-09-12 16:15:00', 'Boots prefere ambientes com menos movimento. Gato mais reservado.'),

-- Anotações para Patches
('880e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440018', '2023-08-05 10:40:00', 'Patches excelente apetite. Come tanto ração seca quanto úmida.'),
('880e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440018', '2023-11-20 14:25:00', 'Patches muito curiosa. Investiga todos os cantos do ambiente.'),

-- Anotações para Ginger
('880e8400-e29b-41d4-a716-446655440043', '550e8400-e29b-41d4-a716-446655440019', '2022-12-18 11:30:00', 'Ginger adora brincar com bolinhas de papel. Muito ativa durante a manhã.'),
('880e8400-e29b-41d4-a716-446655440044', '550e8400-e29b-41d4-a716-446655440019', '2023-04-03 15:10:00', 'Ginger tem preferência por ração seca. Come bem e mantém peso ideal.'),
('880e8400-e29b-41d4-a716-446655440045', '550e8400-e29b-41d4-a716-446655440019', '2023-08-17 12:45:00', 'Ginger gosta de dormir em lugares altos. Muito observadora.'),

-- Anotações para Snowball
('880e8400-e29b-41d4-a716-446655440046', '550e8400-e29b-41d4-a716-446655440020', '2023-06-30 14:15:00', 'Snowball interage bem com visitantes. Potencial para adoção rápida.'),
('880e8400-e29b-41d4-a716-446655440047', '550e8400-e29b-41d4-a716-446655440020', '2023-10-05 11:30:00', 'Snowball necessita de escovação regular devido ao pelo longo.'),

-- Anotações para Midnight
('880e8400-e29b-41d4-a716-446655440048', '550e8400-e29b-41d4-a716-446655440021', '2022-11-08 16:25:00', 'Midnight apresentou melhora significativa no comportamento social.'),
('880e8400-e29b-41d4-a716-446655440049', '550e8400-e29b-41d4-a716-446655440021', '2023-02-22 13:50:00', 'Midnight adora carinho atrás das orelhas. Ronrona muito.'),
('880e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440021', '2023-06-08 10:15:00', 'Midnight tem hábito de seguir os cuidadores pelo abrigo.'),

-- Anotações para Pumpkin
('880e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440022', '2023-05-14 09:50:00', 'Pumpkin prefere ambientes com menos movimento. Gato mais reservado.'),
('880e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440022', '2023-09-28 15:25:00', 'Pumpkin excelente apetite. Come tanto ração seca quanto úmida.'),

-- Anotações para Duchess
('880e8400-e29b-41d4-a716-446655440053', '550e8400-e29b-41d4-a716-446655440023', '2023-02-05 13:35:00', 'Duchess muito curiosa. Investiga todos os cantos do ambiente.'),
('880e8400-e29b-41d4-a716-446655440054', '550e8400-e29b-41d4-a716-446655440023', '2023-05-19 11:40:00', 'Duchess adora brincar com bolinhas de papel. Muito ativa durante a manhã.'),
('880e8400-e29b-41d4-a716-446655440055', '550e8400-e29b-41d4-a716-446655440023', '2023-08-26 16:55:00', 'Duchess tem preferência por ração seca. Come bem e mantém peso ideal.'),

-- Anotações para Bandit
('880e8400-e29b-41d4-a716-446655440056', '550e8400-e29b-41d4-a716-446655440024', '2023-09-20 15:10:00', 'Bandit gosta de dormir em lugares altos. Muito observador.'),
('880e8400-e29b-41d4-a716-446655440057', '550e8400-e29b-41d4-a716-446655440024', '2023-12-10 12:30:00', 'Bandit interage bem com visitantes. Potencial para adoção rápida.'),

-- Anotações para Rosie
('880e8400-e29b-41d4-a716-446655440058', '550e8400-e29b-41d4-a716-446655440025', '2023-01-22 12:45:00', 'Rosie necessita de escovação regular devido ao pelo longo.'),
('880e8400-e29b-41d4-a716-446655440059', '550e8400-e29b-41d4-a716-446655440025', '2023-04-07 14:20:00', 'Rosie apresentou melhora significativa no comportamento social.'),
('880e8400-e29b-41d4-a716-446655440060', '550e8400-e29b-41d4-a716-446655440025', '2023-07-23 10:35:00', 'Rosie adora carinho atrás das orelhas. Ronrona muito.'),

-- Anotações para Chester
('880e8400-e29b-41d4-a716-446655440061', '550e8400-e29b-41d4-a716-446655440026', '2023-04-15 11:00:00', 'Chester tem hábito de seguir os cuidadores pelo abrigo.'),
('880e8400-e29b-41d4-a716-446655440062', '550e8400-e29b-41d4-a716-446655440026', '2023-08-01 15:45:00', 'Chester prefere ambientes com menos movimento. Gato mais reservado.'),

-- Anotações para Daisy
('880e8400-e29b-41d4-a716-446655440063', '550e8400-e29b-41d4-a716-446655440027', '2023-09-10 10:30:00', 'Daisy excelente apetite. Come tanto ração seca quanto úmida.'),
('880e8400-e29b-41d4-a716-446655440064', '550e8400-e29b-41d4-a716-446655440027', '2023-12-03 13:15:00', 'Daisy muito curiosa. Investiga todos os cantos do ambiente.'),

-- Anotações para Oscar
('880e8400-e29b-41d4-a716-446655440065', '550e8400-e29b-41d4-a716-446655440028', '2023-01-08 14:25:00', 'Oscar adora brincar com bolinhas de papel. Muito ativo durante a manhã.'),
('880e8400-e29b-41d4-a716-446655440066', '550e8400-e29b-41d4-a716-446655440028', '2023-05-16 11:50:00', 'Oscar tem preferência por ração seca. Come bem e mantém peso ideal.'),
('880e8400-e29b-41d4-a716-446655440067', '550e8400-e29b-41d4-a716-446655440028', '2023-09-22 16:10:00', 'Oscar gosta de dormir em lugares altos. Muito observador.'),

-- Anotações para Lily
('880e8400-e29b-41d4-a716-446655440068', '550e8400-e29b-41d4-a716-446655440029', '2023-07-18 16:45:00', 'Lily interage bem com visitantes. Potencial para adoção rápida.'),
('880e8400-e29b-41d4-a716-446655440069', '550e8400-e29b-41d4-a716-446655440029', '2023-11-12 14:20:00', 'Lily necessita de escovação regular devido ao pelo longo.'),

-- Anotações para Rusty
('880e8400-e29b-41d4-a716-446655440070', '550e8400-e29b-41d4-a716-446655440030', '2022-12-03 09:20:00', 'Rusty apresentou melhora significativa no comportamento social.'),
('880e8400-e29b-41d4-a716-446655440071', '550e8400-e29b-41d4-a716-446655440030', '2023-03-18 12:35:00', 'Rusty adora carinho atrás das orelhas. Ronrona muito.'),
('880e8400-e29b-41d4-a716-446655440072', '550e8400-e29b-41d4-a716-446655440030', '2023-06-25 15:40:00', 'Rusty tem hábito de seguir os cuidadores pelo abrigo.'),
('880e8400-e29b-41d4-a716-446655440073', '550e8400-e29b-41d4-a716-446655440030', '2023-10-30 11:05:00', 'Rusty prefere ambientes com menos movimento. Gato mais reservado.'),

-- Anotações para gatos adotados
('880e8400-e29b-41d4-a716-446655440074', '550e8400-e29b-41d4-a716-446655440009', '2023-02-15 14:30:00', 'Bella foi adotada com sucesso. Adaptação perfeita à nova família.'),
('880e8400-e29b-41d4-a716-446655440075', '550e8400-e29b-41d4-a716-446655440010', '2023-03-20 10:15:00', 'Max relatório positivo da nova família. Está se adaptando muito bem.'),
('880e8400-e29b-41d4-a716-446655440076', '550e8400-e29b-41d4-a716-446655440031', '2022-12-05 15:20:00', 'Charlie nova família enviou fotos. Gato está feliz e saudável.'),
('880e8400-e29b-41d4-a716-446655440077', '550e8400-e29b-41d4-a716-446655440032', '2022-12-28 11:45:00', 'Sophie follow-up da adoção: tudo correndo perfeitamente.'),
('880e8400-e29b-41d4-a716-446655440078', '550e8400-e29b-41d4-a716-446655440033', '2023-01-18 09:30:00', 'Buddy adotante relatou que o gato se integrou bem com outros pets.'),
('880e8400-e29b-41d4-a716-446655440079', '550e8400-e29b-41d4-a716-446655440034', '2023-02-28 14:15:00', 'Molly primeira semana de adaptação foi excelente.'),
('880e8400-e29b-41d4-a716-446655440080', '550e8400-e29b-41d4-a716-446655440035', '2022-10-15 16:40:00', 'Rocky gato demonstrou carinho imediato pela nova família.'),
('880e8400-e29b-41d4-a716-446655440081', '550e8400-e29b-41d4-a716-446655440036', '2023-03-25 12:20:00', 'Zoe adoção bem-sucedida. Família muito satisfeita.'),
('880e8400-e29b-41d4-a716-446655440082', '550e8400-e29b-41d4-a716-446655440037', '2022-11-30 10:55:00', 'Toby relatório de 30 dias: adaptação completa e satisfatória.'),
('880e8400-e29b-41d4-a716-446655440083', '550e8400-e29b-41d4-a716-446655440038', '2023-04-08 15:10:00', 'Coco nova família elogiou o temperamento dócil do gato.'),
('880e8400-e29b-41d4-a716-446655440084', '550e8400-e29b-41d4-a716-446655440039', '2023-01-05 13:35:00', 'Leo foi adotado com sucesso. Adaptação perfeita à nova família.'),
('880e8400-e29b-41d4-a716-446655440085', '550e8400-e29b-41d4-a716-446655440040', '2023-02-18 11:25:00', 'Ruby relatório positivo da nova família. Está se adaptando muito bem.'),
('880e8400-e29b-41d4-a716-446655440086', '550e8400-e29b-41d4-a716-446655440041', '2022-12-22 09:50:00', 'Jasper nova família enviou fotos. Gato está feliz e saudável.'),
('880e8400-e29b-41d4-a716-446655440087', '550e8400-e29b-41d4-a716-446655440042', '2023-01-28 14:45:00', 'Penny follow-up da adoção: tudo correndo perfeitamente.'),
('880e8400-e29b-41d4-a716-446655440088', '550e8400-e29b-41d4-a716-446655440043', '2022-10-28 16:15:00', 'Buster adotante relatou que o gato se integrou bem com outros pets.'),
('880e8400-e29b-41d4-a716-446655440089', '550e8400-e29b-41d4-a716-446655440044', '2023-03-12 12:40:00', 'Hazel primeira semana de adaptação foi excelente.'),
('880e8400-e29b-41d4-a716-446655440090', '550e8400-e29b-41d4-a716-446655440045', '2022-09-18 10:20:00', 'Milo gato demonstrou carinho imediato pela nova família.'),
('880e8400-e29b-41d4-a716-446655440091', '550e8400-e29b-41d4-a716-446655440046', '2023-05-05 15:30:00', 'Stella adoção bem-sucedida. Família muito satisfeita.'),
('880e8400-e29b-41d4-a716-446655440092', '550e8400-e29b-41d4-a716-446655440047', '2022-11-12 13:55:00', 'Tucker relatório de 30 dias: adaptação completa e satisfatória.'),
('880e8400-e29b-41d4-a716-446655440093', '550e8400-e29b-41d4-a716-446655440048', '2023-01-22 11:10:00', 'Lola nova família elogiou o temperamento dócil da gata.');

-- ========================================
-- INSERIR DADOS DE ESTERILIZAÇÕES (40 esterilizações)
-- ========================================

INSERT INTO sterilizations (id, cat_id, sterilization_date, status, notes) VALUES
-- Esterilizações completadas (25)
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440009', '2023-01-10 09:00:00', 'COMPLETED', 'Procedimento realizado com sucesso pelo Dr. Silva. Recuperação normal.'),
('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440010', '2022-12-15 14:30:00', 'COMPLETED', 'Castração realizada antes da adoção. Sem complicações.'),
('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '2023-04-20 10:15:00', 'COMPLETED', 'Procedimento padrão. Gato se recuperou bem e está ativo.'),
('990e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', '2023-05-25 11:45:00', 'COMPLETED', 'Esterilização da Luna realizada com sucesso. Sem intercorrências.'),
('990e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440031', '2022-11-20 09:30:00', 'COMPLETED', 'Castração do Charlie realizada pelo Dr. Martins. Recuperação excelente.'),
('990e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440032', '2022-10-05 14:15:00', 'COMPLETED', 'Esterilização da Sophie sem complicações. Procedimento padrão.'),
('990e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440033', '2022-08-18 10:45:00', 'COMPLETED', 'Buddy castrado com sucesso. Adaptação pós-cirúrgica normal.'),
('990e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440034', '2023-01-25 16:20:00', 'COMPLETED', 'Molly esterilizada pelo Dr. Santos. Sem intercorrências.'),
('990e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440035', '2022-07-30 11:15:00', 'COMPLETED', 'Rocky castrado com sucesso. Recuperação dentro do esperado.'),
('990e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440036', '2023-02-08 13:40:00', 'COMPLETED', 'Zoe esterilizada sem complicações. Procedimento realizado pela Dra. Lima.'),
('990e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440037', '2022-10-12 09:25:00', 'COMPLETED', 'Toby castrado com sucesso. Adaptação excelente pós-cirurgia.'),
('990e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440038', '2023-03-18 15:10:00', 'COMPLETED', 'Coco esterilizada pelo Dr. Silva. Recuperação normal.'),
('990e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440039', '2022-12-28 10:30:00', 'COMPLETED', 'Leo castrado antes da adoção. Procedimento padrão.'),
('990e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440040', '2023-01-15 14:45:00', 'COMPLETED', 'Ruby esterilizada com sucesso. Sem complicações pós-operatórias.'),
('990e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440041', '2022-11-08 12:20:00', 'COMPLETED', 'Jasper castrado pelo Dr. Martins. Recuperação excelente.'),
('990e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440042', '2023-01-02 16:35:00', 'COMPLETED', 'Penny esterilizada sem intercorrências. Procedimento padrão.'),
('990e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440043', '2022-09-15 11:50:00', 'COMPLETED', 'Buster castrado com sucesso. Adaptação pós-cirúrgica normal.'),
('990e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440044', '2023-02-22 13:15:00', 'COMPLETED', 'Hazel esterilizada pela Dra. Lima. Recuperação dentro do esperado.'),
('990e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440045', '2022-08-25 09:40:00', 'COMPLETED', 'Milo castrado antes da adoção. Sem complicações.'),
('990e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440046', '2023-04-05 15:25:00', 'COMPLETED', 'Stella esterilizada com sucesso. Procedimento realizado pelo Dr. Santos.'),
('990e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440047', '2022-10-20 12:10:00', 'COMPLETED', 'Tucker castrado sem intercorrências. Recuperação excelente.'),
('990e8400-e29b-41d4-a716-446655440026', '550e8400-e29b-41d4-a716-446655440048', '2022-12-18 14:55:00', 'COMPLETED', 'Lola esterilizada antes da adoção. Procedimento padrão.'),
('990e8400-e29b-41d4-a716-446655440027', '550e8400-e29b-41d4-a716-446655440013', '2023-06-15 10:20:00', 'COMPLETED', 'Smokey castrado com sucesso pelo Dr. Silva. Sem complicações.'),
('990e8400-e29b-41d4-a716-446655440028', '550e8400-e29b-41d4-a716-446655440017', '2023-07-22 13:45:00', 'COMPLETED', 'Boots esterilizado pela Dra. Lima. Recuperação normal.'),
('990e8400-e29b-41d4-a716-446655440029', '550e8400-e29b-41d4-a716-446655440023', '2023-08-10 11:30:00', 'COMPLETED', 'Duchess esterilizada sem intercorrências. Procedimento padrão.'),

-- Esterilizações agendadas (10)
('990e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', '2024-02-15 09:30:00', 'SCHEDULED', 'Procedimento agendado com veterinário Dr. Silva para fevereiro.'),
('990e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', '2024-02-20 14:00:00', 'SCHEDULED', 'Esterilização da Mimi agendada. Pré-operatório normal.'),
('990e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440004', '2024-03-10 10:30:00', 'SCHEDULED', 'Castração do Tiger agendada para março. Aguardando período adequado.'),
('990e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440011', '2024-02-25 15:15:00', 'SCHEDULED', 'Garfield agendado para castração. Pré-operatório em andamento.'),
('990e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440012', '2024-03-05 11:45:00', 'SCHEDULED', 'Mittens agendada para esterilização com Dr. Martins.'),
('990e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440014', '2024-03-12 09:20:00', 'SCHEDULED', 'Princess agendada para procedimento. Exames pré-operatórios OK.'),
('990e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440016', '2024-03-18 14:30:00', 'SCHEDULED', 'Chloe agendada para esterilização. Aguardando data disponível.'),
('990e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440018', '2024-03-25 10:50:00', 'SCHEDULED', 'Patches agendada com Dra. Lima. Pré-operatório normal.'),
('990e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-446655440020', '2024-04-02 13:15:00', 'SCHEDULED', 'Snowball agendado para castração. Exames em dia.'),
('990e8400-e29b-41d4-a716-446655440036', '550e8400-e29b-41d4-a716-446655440022', '2024-04-08 16:40:00', 'SCHEDULED', 'Pumpkin agendado com Dr. Santos. Aguardando confirmação.'),

-- Esterilizações canceladas (5)
('990e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440006', '2024-01-25 15:20:00', 'CANCELED', 'Procedimento cancelado devido a problema de saúde. Reagendamento necessário.'),
('990e8400-e29b-41d4-a716-446655440037', '550e8400-e29b-41d4-a716-446655440007', '2023-12-10 11:30:00', 'CANCELED', 'Nala apresentou febre no dia do procedimento. Cancelado por precaução.'),
('990e8400-e29b-41d4-a716-446655440038', '550e8400-e29b-41d4-a716-446655440008', '2023-11-22 14:45:00', 'CANCELED', 'Felix cancelado devido a problema respiratório. Tratamento em andamento.'),
('990e8400-e29b-41d4-a716-446655440039', '550e8400-e29b-41d4-a716-446655440019', '2023-10-15 09:15:00', 'CANCELED', 'Ginger cancelada por estar no cio. Reagendamento para próximo mês.'),
('990e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440024', '2023-12-28 12:25:00', 'CANCELED', 'Bandit cancelado devido a alteração nos exames pré-operatórios.');
