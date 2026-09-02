--06/05/2026 
DROP DATABASE IF EXISTS Anaconda;
CREATE DATABASE Anaconda; 

SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'anaconda'
AND pid <> pg_backend_pid();

--Tablas iniciales (08/05/2026)
CREATE TABLE Rol(
	rol_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	nombre VARCHAR(200) NOT NULL
);

CREATE TABLE Personal (
	personal_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	rol_id INT REFERENCES Rol(rol_id),
	primer_nombre VARCHAR(50) NOT NULL,
	segundo_nombre VARCHAR(50) NULL,
	primer_apellido VARCHAR(50) NOT NULL,
	segundo_apellido VARCHAR(50) NULL,
	
	especialidad VARCHAR(200) NOT NULL,
	tipo_identificacion VARCHAR(100) NOT NULL,
	identificacion VARCHAR(100) NOT NULL,
	direccion VARCHAR(200) NULL,
	carnet VARCHAR(100) NULL,
	usuario VARCHAR(80) NOT NULL,
	contrasena VARCHAR(255),
	activo BOOL NOT NULL,
	created_by UUID REFERENCES Personal(personal_id),
	created_at TIMESTAMP NOT NULL,
	updated_by UUID REFERENCES Personal(personal_id) NULL,
	updated_at TIMESTAMP NULL,

	email_verificado BOOL,
	cuenta_bloqueada BOOL,
	credenciales_expiradas BOOL
);


CREATE TABLE AdultoMayor(
	adulto_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	tipo_identificacion VARCHAR(100) NOT NULL,
	identificacion VARCHAR(200) NOT NULL,
	primer_nombre VARCHAR(50) NOT NULL,
	segundo_nombre VARCHAR(50) NULL,
	primer_apellido VARCHAR(50) NOT NULL,
	segundo_apellido VARCHAR(50) NULL,
	nacionalidad VARCHAR(100) NOT NULL,
	fecha_nacimiento TIMESTAMP NULL,
	sexo VARCHAR(1) CHECK (sexo IN ('F', 'M')) NOT NULL,
	direccion VARCHAR(200) NOT NULL,
	escolaridad VARCHAR(80) NOT NULL,
	grupo_familiar VARCHAR(200),
	pension BOOL NOT NULL,
	funcionalidad_fisica VARCHAR(200) NULL,
	ayuda_biomecanica BOOL NOT NULL,
	fecha_ingreso TIMESTAMP NOT NULL,
	fecha_retiro TIMESTAMP NULL,
	fecha_fallecimiento TIMESTAMP NULL,
	motivo_retiro VARCHAR(200) NULL,
	activo BOOL NOT NULL,
	created_by UUID REFERENCES Personal(personal_id) NOT NULL,
	created_at TIMESTAMP NOT NULL,
	updated_by UUID REFERENCES Personal(personal_id) NULL,
	updated_at TIMESTAMP NULL
);


CREATE TABLE EncargadoLegal(
	encargado_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	tipo_identificacion VARCHAR(100) NOT NULL,
	identificacion VARCHAR(200) NOT NULL,
	primer_nombre VARCHAR(50) NOT NULL,
	segundo_nombre VARCHAR(50) NULL,
	primer_apellido VARCHAR(50) NOT NULL,
	segundo_apellido VARCHAR(50) NULL,
	direccion VARCHAR(200) NOT NULL,
	activo BOOL NOT NULL,
	created_by UUID REFERENCES Personal(personal_id) NOT NULL,
	created_at TIMESTAMP NOT NULL,
	updated_by UUID REFERENCES Personal(personal_id) NULL,
	updated_at TIMESTAMP NULL
);

CREATE TABLE Contacto(
	contacto_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	personal_id UUID NULL REFERENCES Personal(personal_id),
	encargado_id UUID NULL REFERENCES EncargadoLegal(encargado_id),
	valor VARCHAR(100) NOT NULL,
	tipo_valor VARCHAR(50) NULL,
	activo BOOL NOT NUll,
	created_by UUID REFERENCES Personal(personal_id) NOT NULL,
	created_at TIMESTAMP NOT NULL,
	updated_by UUID REFERENCES Personal(personal_id) NULL,
	updated_at TIMESTAMP NULL
);

/** Modified (17/7/2026) **/
CREATE TABLE Documento(
	documento_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,

	personal_id UUID NULL REFERENCES Personal(personal_id),
	encargado_id UUID NULL REFERENCES EncargadoLegal(encargado_id),
	adulto_id UUID NULL REFERENCES AdultoMayor(adulto_id),

	nombre_archivo VARCHAR(200) NOT NULL,
	tipo_archivo VARCHAR(100) NOT NULL,
	tamano_archivo BIGINT NOT NULL,

	archivo BYTEA NOT NULL,
	activo BOOL NOT NULL,

	created_by UUID REFERENCES Personal(personal_id) NOT NULL,
	created_at TIMESTAMP NOT NULL,
	updated_by UUID REFERENCES Personal(personal_id) NULL,
	updated_at TIMESTAMP NULL,

	CONSTRAINT chk_documento_tamano_archivo
	CHECK (tamano_archivo > 0)
);
CREATE INDEX idx_documento_adulto_id
ON Documento(adulto_id);

CREATE INDEX idx_documento_personal_id
ON Documento(personal_id);

CREATE INDEX idx_documento_encargado_id
ON Documento(encargado_id);

CREATE INDEX idx_documento_activo
ON Documento(activo);

CREATE INDEX idx_documento_created_at
ON Documento(created_at);

CREATE TABLE EncargadoAdulto(
    adulto_id    UUID REFERENCES AdultoMayor(adulto_id),
    encargado_id UUID REFERENCES EncargadoLegal(encargado_id),
    PRIMARY KEY (adulto_id, encargado_id)
);

/** Some data **/
INSERT INTO Rol (nombre)
VALUES ('ADMIN'), ('PERSONAL'), ('AYUDANTE');

INSERT INTO Personal (primer_nombre, primer_apellido, rol_id, especialidad, tipo_identificacion, identificacion,
direccion, carnet, usuario, contrasena, activo, created_at, credenciales_expiradas, cuenta_bloqueada, email_verificado)
VALUES ('Default','User',1, 'NUTRICION', 'CIC', '402250833', 'Avenida 123', '123456789', 'hello@gmail.com', '$2a$12$xiiXfivq.xywYjmXbFxg6.BbptpYUiUcZO6zACscQA79OqXGXGjT2',
true, NOW(), false, false, true);

/* Tabla e índices relacionados al modelo de epicrisis documental (17/07/2026)*/
CREATE TABLE Epicrisis(
	epicrisis_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

	documento_id INT NOT NULL REFERENCES Documento(documento_id),

	fecha_emision TIMESTAMP NOT NULL,
	fecha_recepcion TIMESTAMP NULL,
	centro_salud VARCHAR(150) NOT NULL,

	vigente BOOL NOT NULL,

	CONSTRAINT uq_epicrisis_documento UNIQUE(documento_id)
);

CREATE INDEX idx_epicrisis_documento_id
ON Epicrisis(documento_id);

CREATE INDEX idx_epicrisis_fecha_emision
ON Epicrisis(fecha_emision);

CREATE INDEX idx_epicrisis_vigente
ON Epicrisis(vigente);

/* Tabla e índices para auditoría del sistema (23-07-2026)*/
CREATE TABLE Auditoria(
    auditoria_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    usuario_id UUID REFERENCES Personal(personal_id) NOT NULL,

    accion VARCHAR(100) NOT NULL,
    modulo VARCHAR(100) NOT NULL,
    entidad_afectada VARCHAR(100) NOT NULL,
    registro_afectado_id VARCHAR(100) NOT NULL,

    descripcion VARCHAR(500) NULL,
    cambios JSONB NULL,

    created_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_auditoria_usuario_id
ON Auditoria(usuario_id);

CREATE INDEX idx_auditoria_accion
ON Auditoria(accion);

CREATE INDEX idx_auditoria_modulo
ON Auditoria(modulo);

CREATE INDEX idx_auditoria_created_at
ON Auditoria(created_at);

-- 5/8/2026
CREATE TABLE EmailVerificationToken(
	token_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	personal_id UUID NOT NULL REFERENCES Personal(personal_id),
	expires_at TIMESTAMP NOT NULL,
	token VARCHAR(255) NOT NULL,
	usado BOOL NOT NULL

);

CREATE TABLE PasswordResetToken(
	token_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	personal_id UUID NOT NULL REFERENCES Personal(personal_id),
	expires_at TIMESTAMP NOT NULL,
	token VARCHAR(255) NOT NULL,
	usado BOOL NOT NULL
);

-- 16/8/2026
CREATE TABLE Consulta(
	consulta_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	adulto_id UUID NOT NULL REFERENCES AdultoMayor(adulto_id),
	tipo_consulta VARCHAR(255) NOT NULL,
	motivo TEXT NOT NULL,
	descripcion TEXT,
	diagnostico TEXT,
	resultados_evaluaciones TEXT,
	recomendaciones TEXT,
	notas TEXT,
	created_by UUID NOT NULL REFERENCES Personal(personal_id),
	created_at TIMESTAMP NOT NULL,
	updated_by UUID REFERENCES Personal(personal_id),
	updated_at TIMESTAMP,
	activo BOOl NOT NUlL
);

CREATE TABLE ConsultaNutricional(
	consulta_nutricional_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	consulta_id UUID NOT NULL UNIQUE REFERENCES Consulta(consulta_id),
	historia_alimentaria TEXT,
	apetito VARCHAR(30),
	masticacion TEXT,
	deglucion TEXT,
	nauseas BOOLEAN,
	vomitos BOOLEAN,
	distension BOOLEAN,
	gases BOOLEAN,
	reflujo BOOLEAN,
	diarrea BOOLEAN,
	estrenimiento BOOLEAN,
	frecuencia_evacuaciones TEXT,
	consistencia_bristol TEXT,
	estado_cognitivo TEXT
);

CREATE TABLE Antropometria (
	antropometria_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	consulta_nutricional_id UUID NOT NULL UNIQUE REFERENCES ConsultaNutricional(consulta_nutricional_id),

	peso_actual DECIMAL(6,2),
	peso_habitual DECIMAL(6,2),
	peso_hace_6_meses DECIMAL(6,2),
	talla DECIMAL(5,2),
	altura_estimada DECIMAL(5,2),
	imc DECIMAL(5,2),
	circumferencia_pantorrilla DECIMAL(6,2),
	circunferencia_braquial DECIMAL(6,2),
    circunferencia_cintura DECIMAL(6,2),
    perdida_peso_porcentaje DECIMAL(5,2)
);

CREATE TABLE ExamenLaboratorio (
    examen_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    consulta_nutricional_id UUID NOT NULL REFERENCES ConsultaNutricional(consulta_nutricional_id),

    nombre VARCHAR(150) NOT NULL,
    valor VARCHAR(100),
    unidad VARCHAR(50),
    fecha TIMESTAMP,
    observaciones TEXT
);

CREATE TABLE Medicamento(
	medicamento_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	adulto_id UUID NOT NULL REFERENCES AdultoMayor(adulto_id),

	nombre VARCHAR(200) NOT NULl,
	dosis VARCHAR(100),
	horario VARCHAR(100),
	tipo VARCHAR(50),
	observaciones TEXT,
	created_by UUID NOT NULL REFERENCES Personal(personal_id),
	created_at TIMESTAMP NOT NULL,
	updated_by UUID  REFERENCES Personal(personal_id),
	updated_at TIMESTAMP,
	activo BOOl NOT NULL
);

CREATE TABLE Referencia (
	referencia_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	emisor_id UUID NOT NULL REFERENCES Personal(personal_id),
	receptor_id UUID NOT NULL REFERENCES Personal(personal_id),
	consulta_id UUID NOT NULL REFERENCES Consulta(consulta_id),
	mensaje TEXT NOT NULL,
	created_at TIMESTAMP NOT NUll
);

-- 29/08/2026

CREATE TABLE ConsultaPsych(
	consulta_psych_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	consulta_id UUID NOT NULL UNIQUE REFERENCES Consulta(consulta_id),
);

CREATE TABLE Tamizaje(
	tamizaje_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	consulta_id UUID NOT NULL REFERENCES Consulta(consulta_id),

	tipo VARCHAR(30) NOT NULL,
	puntaje DECIMAL(6,2),
	resultado VARCHAR(100),
	observaciones TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_rol_nombre
    ON rol (LOWER(nombre));

CREATE UNIQUE INDEX IF NOT EXISTS ux_personal_usuario
    ON personal (LOWER(usuario));

CREATE UNIQUE INDEX IF NOT EXISTS ux_personal_tipo_identificacion_identificacion
    ON personal (tipo_identificacion, identificacion);

CREATE INDEX IF NOT EXISTS ix_personal_rol_id
    ON personal (rol_id);

CREATE INDEX IF NOT EXISTS ix_personal_created_by
    ON personal (created_by);

CREATE INDEX IF NOT EXISTS ix_personal_updated_by
    ON personal (updated_by)
    WHERE updated_by IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_personal_activo_rol
    ON personal (rol_id, personal_id)
    WHERE activo = TRUE;

CREATE INDEX IF NOT EXISTS ix_contacto_personal_activo
    ON contacto (personal_id)
    WHERE personal_id IS NOT NULL AND activo = TRUE;

CREATE INDEX IF NOT EXISTS ix_contacto_encargado_activo
    ON contacto (encargado_id)
    WHERE encargado_id IS NOT NULL AND activo = TRUE;

CREATE INDEX IF NOT EXISTS ix_contacto_created_by
    ON contacto (created_by);

CREATE INDEX IF NOT EXISTS ix_contacto_updated_by
    ON contacto (updated_by)
    WHERE updated_by IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS ux_email_verification_token_token
    ON emailverificationtoken (token);

CREATE INDEX IF NOT EXISTS ix_email_verification_personal_unused
    ON emailverificationtoken (personal_id, expires_at DESC)
    WHERE usado = FALSE;

CREATE INDEX IF NOT EXISTS ix_email_verification_expires_at
    ON emailverificationtoken (expires_at);

CREATE UNIQUE INDEX IF NOT EXISTS ux_password_reset_token_token
    ON passwordresettoken (token);

CREATE INDEX IF NOT EXISTS ix_password_reset_personal_unused
    ON passwordresettoken (personal_id, expires_at DESC)
    WHERE usado = FALSE;

CREATE INDEX IF NOT EXISTS ix_password_reset_expires_at
    ON passwordresettoken (expires_at);

CREATE INDEX IF NOT EXISTS ix_consulta_adulto_activa_fecha
    ON consulta (adulto_id, created_at DESC)
    WHERE activo = TRUE;

CREATE INDEX IF NOT EXISTS ix_consulta_adulto_tipo_fecha
    ON consulta (adulto_id, tipo_consulta, created_at DESC)
    WHERE activo = TRUE;

CREATE INDEX IF NOT EXISTS ix_consulta_created_by
    ON consulta (created_by);

CREATE INDEX IF NOT EXISTS ix_consulta_updated_by
    ON consulta (updated_by)
    WHERE updated_by IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_tamizaje_consulta_tipo
    ON tamizajenutricional (consulta_nutricional_id, tipo);

-- 30/08/2026
CREATE TABLE RefreshToken (
    refresh_token_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    personal_id UUID NOT NULL
        REFERENCES Personal(personal_id),
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    recordarme BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NOT NULL,
    revocado BOOLEAN NOT NULL DEFAULT FALSE,
    revoked_at TIMESTAMP NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_refresh_token_hash
    ON refreshtoken (token_hash);

CREATE INDEX IF NOT EXISTS ix_refresh_token_personal_activo
    ON refreshtoken (personal_id, expires_at)
    WHERE revocado = FALSE;

-- 02/09/2026
-- Información adicional de pensión del adulto mayor.
ALTER TABLE adultomayor
ADD COLUMN IF NOT EXISTS tipo_pension VARCHAR(100);

ALTER TABLE adultomayor
ADD COLUMN IF NOT EXISTS monto_pension NUMERIC(12, 2);

CREATE INDEX IF NOT EXISTS ix_refresh_token_expires_at
    ON refreshtoken (expires_at);
