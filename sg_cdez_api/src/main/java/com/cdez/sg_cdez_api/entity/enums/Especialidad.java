package com.cdez.sg_cdez_api.entity.enums;

public enum Especialidad {
    MEDICINA("Medicina"),
    ENFERMERIA("Enfermería"),
    PSICOLOGIA("Psicología"),
    NUTRICION("Nutrición"),
    TRABAJO_SOCIAL("Trabajo Social"),
    TERAPIA_FISICA("Terapia Física"),
    TERAPIA_RESPIRATORIA("Terapia Respiratoria"),
    TERAPIA_LENGUAJE("Terapia de Lenguaje"),
    COORDINACION("Coordinación"),
    TERAPIA_OCUPACIONAL("Terapia Ocupacional");

    private final String label;
    Especialidad(String label) { this.label = label; }
    public String getLabel() { return label; }
}