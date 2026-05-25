package com.cdez.sg_cdez_api.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CambiaContrasenaRequest {
    private String nuevaContransena;
    private String confirmarContrasena;
}
