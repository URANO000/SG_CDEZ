package com.cdez.sg_cdez_api.entity.enums;

public enum TipoIdentificacion {
    CIC("Cédula de identidad Costarricense"),
    CRP("Cédula de residencia permanente"),
    CRR("Carné de residente rentista"),
    RE("Cédula de residencia permanente libre de condición"),
    APO("Documento de residencia de asilado político"),
    CRT("Carné de residencia temporal"),
    CRE("Carné de refugiado"),
    PEX("Pasaporte extranjero");

    private final String label;
    TipoIdentificacion(String label) { this.label = label; }
    public String getLabel() { return label; }
}
