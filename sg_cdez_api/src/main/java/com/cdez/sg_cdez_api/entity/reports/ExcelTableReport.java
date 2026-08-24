package com.cdez.sg_cdez_api.entity.reports;

import lombok.*;
import java.util.List;

@Getter
@Builder
public class ExcelTableReport<T> {

    private String titulo;
    private List<T> datos;
    private List<ExcelColumn<T>> columnas;

    @Builder.Default
    private boolean showTimestamp = true;

    @Builder.Default
    private boolean zebraRows = true;

    @Builder.Default
    private boolean autoFilter = true;

    @Builder.Default
    private boolean freezeHeader = true;
}