-- ========================================
-- TURMA DO GATIL - DATABASE DUMP
-- Sistema de Gestão de Adoção de Gatos
-- ========================================

-- Limpar todas as tabelas (ordem importante devido às foreign keys)
TRUNCATE TABLE adoptions CASCADE;
TRUNCATE TABLE notes CASCADE;
TRUNCATE TABLE sterilizations CASCADE;
TRUNCATE TABLE cats CASCADE;
TRUNCATE TABLE adopters CASCADE;

-- ========================================
-- INSERIR DADOS DE GATOS
-- ========================================

INSERT INTO cats (id, name, color, sex, birth_date, shelter_entry_date, photo_url, adoption_status) VALUES
-- Gatos disponíveis para adoção
('550e8400-e29b-41d4-a716-446655440001', 'Whiskers', 'WHITE', 'FEMALE', '2023-03-15 10:00:00', '2023-05-01 09:30:00', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'EM_PROCESSO'),
('550e8400-e29b-41d4-a716-446655440002', 'Shadow', 'BLACK', 'MALE', '2022-11-20 14:30:00', '2023-02-10 11:15:00', 'https://images.unsplash.com/photo-1506755855567-92ff770e8d00?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),
('550e8400-e29b-41d4-a716-446655440003', 'Mimi', 'CALICO', 'FEMALE', '2023-07-08 08:45:00', '2023-08-15 16:20:00', 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'EM_PROCESSO'),
('550e8400-e29b-41d4-a716-446655440004', 'Tiger', 'ORANGE', 'MALE', '2022-12-03 12:00:00', '2023-03-20 10:45:00', 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),
('550e8400-e29b-41d4-a716-446655440005', 'Luna', 'GRAY', 'FEMALE', '2023-01-25 16:30:00', '2023-04-05 14:00:00', 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),
('550e8400-e29b-41d4-a716-446655440006', 'Simba', 'BROWN', 'MALE', '2022-10-12 09:15:00', '2023-01-18 13:30:00', 'https://images.unsplash.com/photo-1611267254323-4db7b39c732c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),
('550e8400-e29b-41d4-a716-446655440007', 'Nala', 'MIXED', 'FEMALE', '2023-04-02 11:20:00', '2023-06-12 08:45:00', 'https://images.unsplash.com/photo-1571566882372-1598d88abd90?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),
('550e8400-e29b-41d4-a716-446655440008', 'Felix', 'TABBY', 'MALE', '2022-09-18 13:40:00', '2023-01-05 15:10:00', 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'NAO_ADOTADO'),

-- Gatos já adotados
('550e8400-e29b-41d4-a716-446655440009', 'Bella', 'WHITE', 'FEMALE', '2022-08-14 10:30:00', '2022-12-20 09:00:00', 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'ADOTADO'),
('550e8400-e29b-41d4-a716-446655440010', 'Max', 'BLACK', 'MALE', '2022-06-30 14:15:00', '2022-11-15 11:30:00', 'https://images.unsplash.com/photo-1551717743-49959800b1f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'ADOTADO');

-- ========================================
-- INSERIR DADOS DE ADOTANTES
-- ========================================

INSERT INTO adopters (id, first_name, last_name, birth_date, cpf, phone, email, address, registration_date) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Maria', 'Silva', '1985-04-12 00:00:00', '12345678901', '(11) 99999-1111', 'maria.silva@email.com', 'Rua das Flores, 123, São Paulo, SP', '2023-01-15 10:30:00'),
('660e8400-e29b-41d4-a716-446655440002', 'João', 'Santos', '1990-08-25 00:00:00', '23456789012', '(11) 99999-2222', 'joao.santos@email.com', 'Av. Paulista, 456, São Paulo, SP', '2023-02-20 14:15:00'),
('660e8400-e29b-41d4-a716-446655440003', 'Ana', 'Costa', '1992-11-08 00:00:00', '34567890123', '(11) 99999-3333', 'ana.costa@email.com', 'Rua dos Lírios, 789, São Paulo, SP', '2023-03-10 09:45:00'),
('660e8400-e29b-41d4-a716-446655440004', 'Carlos', 'Oliveira', '1988-02-14 00:00:00', '45678901234', '(11) 99999-4444', 'carlos.oliveira@email.com', 'Rua das Rosas, 321, São Paulo, SP', '2023-04-05 16:20:00'),
('660e8400-e29b-41d4-a716-446655440005', 'Fernanda', 'Lima', '1995-06-30 00:00:00', '56789012345', '(11) 99999-5555', 'fernanda.lima@email.com', 'Av. Brasil, 654, São Paulo, SP', '2023-05-12 11:10:00'),
('660e8400-e29b-41d4-a716-446655440006', 'Roberto', 'Almeida', '1987-09-18 00:00:00', '67890123456', '(11) 99999-6666', 'roberto.almeida@email.com', 'Rua da Paz, 987, São Paulo, SP', '2023-06-08 13:25:00');

-- ========================================
-- INSERIR DADOS DE ADOÇÕES
-- ========================================

INSERT INTO adoptions (id, cat_id, adopter_id, adoption_date, status) VALUES
-- Adoções completadas
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440001', '2023-02-15 14:30:00', 'COMPLETED'),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440002', '2023-03-20 10:15:00', 'COMPLETED'),

-- Adoções pendentes
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', '2024-01-10 09:00:00', 'PENDING'),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440004', '2024-01-15 11:30:00', 'PENDING'),

-- Adoção cancelada
('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440005', '2023-12-20 16:45:00', 'CANCELED');

-- ========================================
-- INSERIR DADOS DE ANOTAÇÕES
-- ========================================

INSERT INTO notes (id, cat_id, date, text) VALUES
-- Notas sobre Whiskers
('880e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '2023-05-01 09:30:00', 'Gata chegou ao abrigo em boas condições de saúde. Muito carinhosa e sociável.'),
('880e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '2023-05-15 14:20:00', 'Passou por consulta veterinária. Vacinação em dia. Recomendada castração.'),
('880e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '2023-06-01 10:45:00', 'Demonstra interesse em brinquedos. Adora carinho na barriga.'),

-- Notas sobre Shadow
('880e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '2023-02-10 11:15:00', 'Gato resgatado da rua. Inicialmente tímido, mas se adaptou bem ao ambiente.'),
('880e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', '2023-03-01 16:30:00', 'Tratamento para vermes concluído. Ganhou peso e está mais ativo.'),

-- Notas sobre Mimi
('880e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', '2023-08-15 16:20:00', 'Gatinha muito brincalhona. Adora outros gatos e é muito sociável.'),

-- Notas sobre Tiger
('880e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440004', '2023-03-20 10:45:00', 'Gato de grande porte. Muito calmo e dócil. Ideal para famílias com crianças.'),
('880e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440004', '2023-04-10 09:15:00', 'Teve pequeno problema digestivo, mas já resolvido com medicação.'),

-- Notas sobre Luna
('880e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440005', '2023-04-05 14:00:00', 'Gata muito independente. Prefere ambientes calmos e tranquilos.'),

-- Notas sobre gatos adotados
('880e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440009', '2023-02-15 14:30:00', 'Adotada pela Maria Silva. Adaptação perfeita à nova família.'),
('880e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440010', '2023-03-20 10:15:00', 'Adotado pelo João Santos. Relatório positivo da nova família.');

-- ========================================
-- INSERIR DADOS DE ESTERILIZAÇÕES
-- ========================================

INSERT INTO sterilizations (id, cat_id, sterilization_date, status, notes) VALUES
-- Esterilizações completadas
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440009', '2023-01-10 09:00:00', 'COMPLETED', 'Procedimento realizado com sucesso pelo Dr. Silva. Recuperação normal.'),
('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440010', '2022-12-15 14:30:00', 'COMPLETED', 'Castração realizada antes da adoção. Sem complicações.'),
('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '2023-04-20 10:15:00', 'COMPLETED', 'Procedimento padrão. Gato se recuperou bem e está ativo.'),
('990e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005', '2023-05-25 11:45:00', 'COMPLETED', 'Esterilização da Luna realizada com sucesso. Sem intercorrências.'),

-- Esterilizações agendadas
('990e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', '2024-02-15 09:30:00', 'SCHEDULED', 'Procedimento agendado com veterinário Dr. Silva para fevereiro.'),
('990e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', '2024-02-20 14:00:00', 'SCHEDULED', 'Esterilização da Mimi agendada. Pré-operatório normal.'),
('990e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440004', '2024-03-10 10:30:00', 'SCHEDULED', 'Castração do Tiger agendada para março. Aguardando período adequado.'),

-- Esterilização cancelada
('990e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440006', '2024-01-25 15:20:00', 'CANCELED', 'Procedimento cancelado devido a problema de saúde. Reagendamento necessário.');

-- ========================================
-- VERIFICAÇÃO DOS DADOS INSERIDOS
-- ========================================

-- Verificar contagem de registros
SELECT 'Gatos' as tabela, COUNT(*) as total FROM cats
UNION ALL
SELECT 'Adotantes' as tabela, COUNT(*) as total FROM adopters
UNION ALL
SELECT 'Adoções' as tabela, COUNT(*) as total FROM adoptions
UNION ALL
SELECT 'Anotações' as tabela, COUNT(*) as total FROM notes
UNION ALL
SELECT 'Esterilizações' as tabela, COUNT(*) as total FROM sterilizations;

-- Verificar gatos disponíveis para adoção
SELECT
    name as "Nome do Gato",
    color as "Cor",
    sex as "Sexo",
    adopted as "Adotado"
FROM cats
WHERE adopted = false
ORDER BY name;

-- Verificar adoções pendentes
SELECT
    c.name as "Gato",
    CONCAT(a.first_name, ' ', a.last_name) as "Adotante",
    ad.status as "Status",
    ad.adoption_date as "Data da Adoção"
FROM adoptions ad
JOIN cats c ON ad.cat_id = c.id
JOIN adopters a ON ad.adopter_id = a.id
WHERE ad.status = 'PENDING'
ORDER BY ad.adoption_date;

-- ========================================
-- QUERIES ÚTEIS PARA TESTES
-- ========================================

/*
-- Buscar gatos por cor
SELECT * FROM cats WHERE color = 'WHITE';

-- Buscar adotantes por nome
SELECT * FROM adopters WHERE LOWER(first_name || ' ' || last_name) LIKE LOWER('%silva%');

-- Buscar adoções por período
SELECT * FROM adoptions WHERE adoption_date BETWEEN '2023-01-01' AND '2023-12-31';

-- Buscar notas por conteúdo
SELECT * FROM notes WHERE LOWER(text) LIKE LOWER('%saúde%');

-- Buscar esterilizações por status
SELECT * FROM sterilizations WHERE status = 'SCHEDULED';

-- Estatísticas gerais
SELECT
    (SELECT COUNT(*) FROM cats WHERE adopted = false) as "Gatos Disponíveis",
    (SELECT COUNT(*) FROM cats WHERE adopted = true) as "Gatos Adotados",
    (SELECT COUNT(*) FROM adoptions WHERE status = 'PENDING') as "Adoções Pendentes",
    (SELECT COUNT(*) FROM sterilizations WHERE status = 'SCHEDULED') as "Esterilizações Agendadas";
*/

-- ========================================
-- FIM DO DUMP
-- ========================================
