package com.cdez.sg_cdez_api.entity.enums;

import lombok.Getter;

public enum TipoTamizaje {
    MNA(Especialidad.NUTRICION, true),
    SARC_F(Especialidad.NUTRICION, true),
    MUST(Especialidad.NUTRICION, true),
    NRS(Especialidad.NUTRICION, true),

    COGNITIVA(Especialidad.PSICOLOGIA, false),
    ANSIEDAD(Especialidad.PSICOLOGIA, false),
    OTROS(Especialidad.PSICOLOGIA, false);

    @Getter
    private final Especialidad especialidad;
    private final boolean requierePuntaje;

    TipoTamizaje(
            Especialidad especialidad,
            boolean requierePuntaje
    ) {
        this.especialidad = especialidad;
        this.requierePuntaje = requierePuntaje;
    }

    public boolean requierePuntaje() {
        return requierePuntaje;
    }
}
