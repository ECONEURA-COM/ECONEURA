-- ECONEURA Agent Registry Schema
-- Tablas para gestionar agentes automatizados conectados por usuarios

-- Tabla principal de agentes
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('make', 'n8n', 'zapier', 'powerautomate', 'econeura', 'custom')),
    webhook_url TEXT,
    webhook_secret VARCHAR(255),
    department VARCHAR(100) NOT NULL,
    neura_assigned VARCHAR(50) NOT NULL CHECK (neura_assigned IN ('CEO', 'CFO', 'CTO', 'IA', 'CISO', 'CSO', 'COO', 'CHRO', 'CMO', 'CDO')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error', 'inactive')),
    schedule VARCHAR(100), -- cron expression o 'on-demand'
    config JSONB, -- configuración específica del agente
    tags TEXT[], -- tags para filtrado
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_execution TIMESTAMP,
    last_result JSONB,
    execution_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0
);

-- Tabla de ejecuciones de agentes
CREATE TABLE IF NOT EXISTS agent_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    triggered_by VARCHAR(50) NOT NULL CHECK (triggered_by IN ('user', 'neura', 'schedule', 'webhook')),
    triggered_by_user_id UUID,
    input_params JSONB,
    output_result JSONB,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'running', 'success', 'failed', 'timeout', 'cancelled')),
    duration_ms INTEGER,
    error_message TEXT,
    error_details JSONB,
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de logs detallados de ejecuciones
CREATE TABLE IF NOT EXISTS agent_execution_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID NOT NULL REFERENCES agent_executions(id) ON DELETE CASCADE,
    log_level VARCHAR(20) NOT NULL CHECK (log_level IN ('debug', 'info', 'warn', 'error')),
    message TEXT NOT NULL,
    metadata JSONB,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Tabla de métricas de agentes
CREATE TABLE IF NOT EXISTS agent_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    executions_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    avg_duration_ms INTEGER DEFAULT 0,
    total_duration_ms BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(agent_id, metric_date)
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON agents(user_id);
CREATE INDEX IF NOT EXISTS idx_agents_platform ON agents(platform);
CREATE INDEX IF NOT EXISTS idx_agents_department ON agents(department);
CREATE INDEX IF NOT EXISTS idx_agents_neura_assigned ON agents(neura_assigned);
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);
CREATE INDEX IF NOT EXISTS idx_agents_created_at ON agents(created_at);

CREATE INDEX IF NOT EXISTS idx_executions_agent_id ON agent_executions(agent_id);
CREATE INDEX IF NOT EXISTS idx_executions_triggered_by ON agent_executions(triggered_by);
CREATE INDEX IF NOT EXISTS idx_executions_status ON agent_executions(status);
CREATE INDEX IF NOT EXISTS idx_executions_started_at ON agent_executions(started_at);

CREATE INDEX IF NOT EXISTS idx_logs_execution_id ON agent_execution_logs(execution_id);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON agent_execution_logs(timestamp);

CREATE INDEX IF NOT EXISTS idx_metrics_agent_date ON agent_metrics(agent_id, metric_date);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at en agents
CREATE TRIGGER update_agents_updated_at 
    BEFORE UPDATE ON agents 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Función para actualizar métricas después de ejecución
CREATE OR REPLACE FUNCTION update_agent_metrics()
RETURNS TRIGGER AS $$
BEGIN
    -- Actualizar contadores en agents
    IF NEW.status = 'success' THEN
        UPDATE agents 
        SET success_count = success_count + 1,
            execution_count = execution_count + 1,
            last_execution = NEW.started_at,
            last_result = NEW.output_result
        WHERE id = NEW.agent_id;
    ELSIF NEW.status = 'failed' OR NEW.status = 'timeout' THEN
        UPDATE agents 
        SET error_count = error_count + 1,
            execution_count = execution_count + 1,
            last_execution = NEW.started_at,
            last_result = NEW.output_result
        WHERE id = NEW.agent_id;
    END IF;

    -- Actualizar métricas diarias
    INSERT INTO agent_metrics (agent_id, metric_date, executions_count, success_count, error_count, avg_duration_ms, total_duration_ms)
    VALUES (
        NEW.agent_id,
        DATE(NEW.started_at),
        1,
        CASE WHEN NEW.status = 'success' THEN 1 ELSE 0 END,
        CASE WHEN NEW.status IN ('failed', 'timeout') THEN 1 ELSE 0 END,
        COALESCE(NEW.duration_ms, 0),
        COALESCE(NEW.duration_ms, 0)
    )
    ON CONFLICT (agent_id, metric_date) 
    DO UPDATE SET
        executions_count = agent_metrics.executions_count + 1,
        success_count = agent_metrics.success_count + CASE WHEN NEW.status = 'success' THEN 1 ELSE 0 END,
        error_count = agent_metrics.error_count + CASE WHEN NEW.status IN ('failed', 'timeout') THEN 1 ELSE 0 END,
        total_duration_ms = agent_metrics.total_duration_ms + COALESCE(NEW.duration_ms, 0),
        avg_duration_ms = (agent_metrics.total_duration_ms + COALESCE(NEW.duration_ms, 0)) / (agent_metrics.executions_count + 1);

    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar métricas
CREATE TRIGGER update_agent_metrics_trigger
    AFTER UPDATE OF status ON agent_executions
    FOR EACH ROW
    EXECUTE FUNCTION update_agent_metrics();

-- Datos de ejemplo para testing
INSERT INTO agents (id, user_id, name, description, platform, department, neura_assigned, status, schedule, config, tags) VALUES
(
    gen_random_uuid(),
    (SELECT id FROM users LIMIT 1), -- Asumiendo que existe tabla users
    'Invoice Chaser',
    'Agente que persigue facturas impagadas automáticamente',
    'make',
    'Finanzas',
    'CFO',
    'active',
    '0 9 * * MON-FRI', -- Todos los días laborables a las 9am
    '{"threshold_days": 30, "email_template": "invoice_reminder"}',
    ARRAY['facturas', 'cobros', 'finanzas']
),
(
    gen_random_uuid(),
    (SELECT id FROM users LIMIT 1),
    'Cost Report Generator',
    'Genera reportes de costes mensuales automáticamente',
    'n8n',
    'Finanzas',
    'CFO',
    'active',
    '0 0 1 * *', -- Primer día de cada mes
    '{"report_type": "monthly", "recipients": ["cfo@empresa.com"]}',
    ARRAY['reportes', 'costes', 'finanzas']
),
(
    gen_random_uuid(),
    (SELECT id FROM users LIMIT 1),
    'Security Scanner',
    'Escanea vulnerabilidades en sistemas',
    'custom',
    'Seguridad',
    'CISO',
    'active',
    '0 2 * * SUN', -- Todos los domingos a las 2am
    '{"scan_depth": "full", "notify_on_critical": true}',
    ARRAY['seguridad', 'vulnerabilidades', 'scan']
);

-- Comentarios de documentación
COMMENT ON TABLE agents IS 'Registro central de agentes automatizados conectados por usuarios';
COMMENT ON TABLE agent_executions IS 'Historial de ejecuciones de agentes con resultados';
COMMENT ON TABLE agent_execution_logs IS 'Logs detallados de cada ejecución de agente';
COMMENT ON TABLE agent_metrics IS 'Métricas agregadas diarias de agentes para analytics';

COMMENT ON COLUMN agents.platform IS 'Plataforma donde está el agente: make, n8n, zapier, powerautomate, econeura, custom';
COMMENT ON COLUMN agents.neura_assigned IS 'NEURA responsable de gestionar este agente';
COMMENT ON COLUMN agents.status IS 'Estado del agente: active, paused, error, inactive';
COMMENT ON COLUMN agents.schedule IS 'Expresión cron para ejecución automática o on-demand';
COMMENT ON COLUMN agents.config IS 'Configuración específica del agente en formato JSON';
COMMENT ON COLUMN agents.tags IS 'Tags para filtrado y organización';

COMMENT ON COLUMN agent_executions.triggered_by IS 'Quién o qué activó la ejecución: user, neura, schedule, webhook';
COMMENT ON COLUMN agent_executions.status IS 'Estado de la ejecución: pending, running, success, failed, timeout, cancelled';
COMMENT ON COLUMN agent_executions.duration_ms IS 'Duración de la ejecución en milisegundos';
COMMENT ON COLUMN agent_executions.input_params IS 'Parámetros de entrada para la ejecución';
COMMENT ON COLUMN agent_executions.output_result IS 'Resultado de la ejecución';

