--06/05/2026 
DROP DATABASE IF EXISTS Anaconda;
CREATE DATABASE Anaconda; 

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
	sexo VARCHAR(1) CHECK (sexo IN ('H', 'M')) NOT NULL,
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
	tipo_valor VARCHAR(50) NULL
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

CREATE TABLE Consulta(
	consulta_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	adulto_id UUID REFERENCES AdultoMayor(adulto_id),
	motivo VARCHAR(100) NOT NULL,
	tipo_intervencion VARCHAR(100) NOT NULL,
	descripcion VARCHAR(250) NOT NULL,
	diagnostico VARCHAR(200) NOT NULL,
	recomendaciones VARCHAR(200) NULL,
	notas VARCHAR(200) NULL,
	referencia UUID REFERENCES Personal(personal_id),
	created_by UUID REFERENCES Personal(personal_id) NOT NULL,
	created_at TIMESTAMP NOT NULL
);

CREATE TABLE EncargadoAdulto(
    adulto_id    UUID REFERENCES AdultoMayor(adulto_id),
    encargado_id UUID REFERENCES EncargadoLegal(encargado_id),
    PRIMARY KEY (adulto_id, encargado_id)
);

/** Some data **/
INSERT INTO Rol (nombre)
VALUES ('ADMIN'), ('PERSONAL');

INSERT INTO Personal (primer_nombre, primer_apellido, rol_id, especialidad, tipo_identificacion, identificacion,
direccion, carnet, usuario, contrasena, activo, created_at, credenciales_expiradas, cuenta_bloqueada, email_verificado)
VALUES ('Default','User',1, 'Programador', 'cédula', '402250833', 'Avenida 123', '123456789', 'hello@gmail.com', '$2a$12$xiiXfivq.xywYjmXbFxg6.BbptpYUiUcZO6zACscQA79OqXGXGjT2',
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
