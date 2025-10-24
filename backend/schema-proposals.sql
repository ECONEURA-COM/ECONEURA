-- ECONEURA Proposals Schema
-- Sistema de propuestas con Human-in-the-Loop obligatorio

-- Tabla principal de propuestas
CREATE TABLE IF NOT EXISTS proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    
    -- Información básica
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    -- Clasificación
    action_type VARCHAR(50) NOT NULL, -- financial, operational, strategic, technical
    impact_level VARCHAR(20) NOT NULL, -- low, medium, high, critical
    
    -- Aprobaciones
    required_approvers TEXT[] NOT NULL, -- Array de roles (CEO, CFO, CTO, etc.)
    approvals JSONB DEFAULT '[]', -- Array de aprobaciones recibidas
    
    -- Impacto financiero
    estimated_cost DECIMAL(15,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'EUR',
    
    -- Análisis de riesgo
    risk_assessment TEXT,
    rollback_plan TEXT,
    
    -- Estado y seguimiento
    status VARCHAR(20) DEFAULT 'pending_approval', -- pending_approval, approved, rejected, executed, cancelled
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
    
    -- Metadatos
    created_by VARCHAR(50) NOT NULL, -- NEURA que creó la propuesta (a-cfo-01, etc.)
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Fechas de aprobación
    approved_at TIMESTAMP NULL,
    executed_at TIMESTAMP NULL,
    
    -- Comentarios y evidencia
    comments TEXT,
    evidence JSONB DEFAULT '[]', -- Array de evidencias/documentos
    
    -- Auditoría
    audit_trail JSONB DEFAULT '[]' -- Historial completo de cambios
    
    -- Índices implícitos en PRIMARY KEY
);

-- Tabla de aprobaciones individuales
CREATE TABLE IF NOT EXISTS proposal_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
    
    -- Aprobador
    approver_role VARCHAR(50) NOT NULL, -- CEO, CFO, CTO, etc.
    approver_user_id UUID, -- ID del usuario que aprobó (si aplica)
    approver_name VARCHAR(255), -- Nombre del aprobador
    
    -- Decisión
    decision VARCHAR(20) NOT NULL, -- approved, rejected, delegated
    comment TEXT,
    
    -- Metadatos
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Constraint único por propuesta y rol
    UNIQUE(proposal_id, approver_role)
);

-- Tabla de ejecuciones de propuestas
CREATE TABLE IF NOT EXISTS proposal_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
    
    -- Detalles de ejecución
    execution_type VARCHAR(50) NOT NULL, -- agent_execution, manual_action, api_call
    target_agent_id UUID, -- Si se ejecuta un agente
    execution_params JSONB DEFAULT '{}',
    
    -- Resultado
    status VARCHAR(20) NOT NULL, -- pending, running, success, failed, cancelled
    result JSONB,
    error_message TEXT,
    
    -- Timing
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    duration_ms INTEGER,
    
    -- Ejecutor
    executed_by VARCHAR(50), -- NEURA o usuario que ejecutó
    executed_by_user_id UUID
);

-- Tabla de notificaciones de propuestas
CREATE TABLE IF NOT EXISTS proposal_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
    
    -- Destinatario
    recipient_role VARCHAR(50) NOT NULL,
    recipient_user_id UUID,
    recipient_email VARCHAR(255),
    
    -- Notificación
    notification_type VARCHAR(50) NOT NULL, -- approval_request, approval_received, proposal_approved, proposal_rejected
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Estado
    sent_at TIMESTAMP DEFAULT NOW(),
    read_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'sent' -- sent, delivered, read, failed
    
    -- Constraint único por propuesta, destinatario y tipo
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_proposals_user_id ON proposals(user_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_impact_level ON proposals(impact_level);
CREATE INDEX IF NOT EXISTS idx_proposals_action_type ON proposals(action_type);
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON proposals(created_at);
CREATE INDEX IF NOT EXISTS idx_proposals_created_by ON proposals(created_by);

CREATE INDEX IF NOT EXISTS idx_proposal_approvals_proposal_id ON proposal_approvals(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_approvals_approver_role ON proposal_approvals(approver_role);
CREATE INDEX IF NOT EXISTS idx_proposal_approvals_decision ON proposal_approvals(decision);

CREATE INDEX IF NOT EXISTS idx_proposal_executions_proposal_id ON proposal_executions(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_executions_status ON proposal_executions(status);
CREATE INDEX IF NOT EXISTS idx_proposal_executions_target_agent_id ON proposal_executions(target_agent_id);

CREATE INDEX IF NOT EXISTS idx_proposal_notifications_proposal_id ON proposal_notifications(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_notifications_recipient_role ON proposal_notifications(recipient_role);
CREATE INDEX IF NOT EXISTS idx_proposal_notifications_status ON proposal_notifications(status);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_proposal_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER trigger_proposal_updated_at
    BEFORE UPDATE ON proposals
    FOR EACH ROW
    EXECUTE FUNCTION update_proposal_updated_at();

-- Función para validar aprobaciones requeridas
CREATE OR REPLACE FUNCTION validate_proposal_approvals()
RETURNS TRIGGER AS $$
DECLARE
    required_approvers TEXT[];
    approval_count INTEGER;
BEGIN
    -- Obtener aprobadores requeridos
    SELECT required_approvers INTO required_approvers 
    FROM proposals 
    WHERE id = NEW.proposal_id;
    
    -- Contar aprobaciones recibidas
    SELECT COUNT(*) INTO approval_count
    FROM proposal_approvals 
    WHERE proposal_id = NEW.proposal_id 
    AND decision = 'approved';
    
    -- Si se alcanzaron todas las aprobaciones requeridas, marcar como aprobada
    IF approval_count >= array_length(required_approvers, 1) THEN
        UPDATE proposals 
        SET status = 'approved', approved_at = NOW()
        WHERE id = NEW.proposal_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para validar aprobaciones
CREATE TRIGGER trigger_validate_proposal_approvals
    AFTER INSERT ON proposal_approvals
    FOR EACH ROW
    EXECUTE FUNCTION validate_proposal_approvals();

-- Función para generar audit trail
CREATE OR REPLACE FUNCTION add_proposal_audit_entry()
RETURNS TRIGGER AS $$
DECLARE
    audit_entry JSONB;
BEGIN
    -- Crear entrada de auditoría
    audit_entry = jsonb_build_object(
        'timestamp', NOW(),
        'action', TG_OP,
        'user_id', COALESCE(NEW.user_id, OLD.user_id),
        'changes', CASE 
            WHEN TG_OP = 'INSERT' THEN to_jsonb(NEW)
            WHEN TG_OP = 'UPDATE' THEN jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
            WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
        END
    );
    
    -- Actualizar audit_trail
    IF TG_OP = 'INSERT' THEN
        NEW.audit_trail = COALESCE(NEW.audit_trail, '[]'::jsonb) || audit_entry;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        NEW.audit_trail = COALESCE(NEW.audit_trail, '[]'::jsonb) || audit_entry;
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para audit trail
CREATE TRIGGER trigger_proposal_audit_trail
    BEFORE INSERT OR UPDATE ON proposals
    FOR EACH ROW
    EXECUTE FUNCTION add_proposal_audit_entry();

-- Comentarios en tablas
COMMENT ON TABLE proposals IS 'Propuestas que requieren aprobación humana (HITL)';
COMMENT ON TABLE proposal_approvals IS 'Aprobaciones individuales de propuestas';
COMMENT ON TABLE proposal_executions IS 'Ejecuciones de propuestas aprobadas';
COMMENT ON TABLE proposal_notifications IS 'Notificaciones relacionadas con propuestas';

-- Comentarios en columnas importantes
COMMENT ON COLUMN proposals.impact_level IS 'Nivel de impacto: low, medium, high, critical';
COMMENT ON COLUMN proposals.required_approvers IS 'Array de roles que deben aprobar (CEO, CFO, CTO, etc.)';
COMMENT ON COLUMN proposals.approvals IS 'Array de aprobaciones recibidas con timestamp y comentarios';
COMMENT ON COLUMN proposals.audit_trail IS 'Historial completo de cambios para compliance';

-- Datos de ejemplo para testing (opcional)
-- INSERT INTO proposals (user_id, title, description, action_type, impact_level, required_approvers, estimated_cost, created_by) 
-- VALUES (
--     '00000000-0000-0000-0000-000000000000',
--     'Ejemplo: Actualización de software crítico',
--     'Actualizar sistema de facturación a versión 2.1 para corregir vulnerabilidad de seguridad',
--     'technical',
--     'high',
--     ARRAY['CTO', 'CISO'],
--     5000.00,
--     'a-cto-01'
-- );

