-- ========================================
-- MIGRAÇÃO: Adicionar enum CatAdoptionStatus
-- Converte boolean adopted para enum adoption_status
-- ========================================

-- 1. Adicionar a nova coluna com o enum
ALTER TABLE cats ADD COLUMN adoption_status VARCHAR(20) DEFAULT 'NAO_ADOTADO' NOT NULL;

-- 2. Migrar os dados existentes
UPDATE cats 
SET adoption_status = CASE 
    WHEN adopted = true THEN 'ADOTADO'
    ELSE 'NAO_ADOTADO'
END;

-- 3. Atualizar status baseado nas adoções pendentes
UPDATE cats 
SET adoption_status = 'EM_PROCESSO'
WHERE id IN (
    SELECT DISTINCT cat_id 
    FROM adoptions 
    WHERE status = 'PENDING'
    AND cat_id NOT IN (
        SELECT cat_id 
        FROM adoptions 
        WHERE status = 'COMPLETED'
    )
);

-- 4. Manter a coluna adopted para compatibilidade (será removida futuramente)
-- ALTER TABLE cats DROP COLUMN adopted; -- Descomente quando tiver certeza de que não há mais dependências

-- 5. Adicionar índice para performance
CREATE INDEX idx_cats_adoption_status ON cats(adoption_status);

-- ========================================
-- VERIFICAÇÃO: Contar registros por status
-- ========================================
SELECT 
    adoption_status,
    COUNT(*) as total
FROM cats 
GROUP BY adoption_status
ORDER BY adoption_status;
