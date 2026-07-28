package com.cdez.sg_cdez_api.entity.reports;


import com.cdez.sg_cdez_api.entity.enums.Orientation;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class PdfTableReport<T> {
    private String titulo;
    private List<Column<T>> columnas;
    private List<T> datos;

    @Builder.Default
    private Orientation orientation = Orientation.AUTO;

    @Builder.Default
    private boolean showTimestamp = true;

    @Builder.Default
    private boolean zebraRows = true;

    @Builder.Default
    private float marginTop = 36;

    @Builder.Default
    private float marginRight = 36;

    @Builder.Default
    private float marginBottom = 36;

    @Builder.Default
    private float marginLeft = 36;
}
