package com.cdez.sg_cdez_api.entity.reports;


import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class PdfTableReport<T> {
    private String titulo;
    private List<Column<T>> columnas;
    private List<T> datos;
}
