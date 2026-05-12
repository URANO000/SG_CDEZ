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
	especialidad VARCHAR(200) NOT NULL,
	tipo_identificacion VARCHAR(100) NOT NULL,
	identificacion VARCHAR(100) NOT NULL,
	direccion VARCHAR(200) NULL,
	carnet VARCHAR(100) NULL,
	created_by UUID REFERENCES Personal(personal_id) NOT NULL,
	created_at TIMESTAMP NOT NULL,
	updated_by UUID REFERENCES Personal(personal_id) NULL,
	updated_at TIMESTAMP NULL
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

CREATE TABLE Documento(
	documento_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	personal_id UUID NULL REFERENCES Personal(personal_id),
	encargado_id UUID NULL REFERENCES EncargadoLegal(encargado_id),
	adulto_id UUID NULL REFERENCES AdultoMayor(adulto_id),
	archivo BYTEA NOT NULL
);

CREATE TABLE Consulta(
	consulta_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	adulto_id UUID REFERENCES AdultoMayor(adulto_id),
	personal_id UUID REFERENCES Personal(personal_id),
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