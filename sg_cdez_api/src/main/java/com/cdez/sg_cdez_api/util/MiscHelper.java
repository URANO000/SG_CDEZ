package com.cdez.sg_cdez_api.util;

import org.springframework.stereotype.Service;

@Service
public class MiscHelper {
    public String activoConversion(boolean isActivo){
        if(isActivo){
            return "Activo";
        }

        return "Inactivo";
    }
}
