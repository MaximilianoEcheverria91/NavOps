-- =============================================================================
-- HABILITAR EXTENSIÓN PG_TRGM PARA BÚSQUEDAS DIFUSAS
-- =============================================================================
-- Esta extensión debe habilitarse ANTES de crear índices gin_trgm_ops
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;
