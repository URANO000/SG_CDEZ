package com.cdez.sg_cdez_api.entity.reports;

import java.util.function.Function;
import com.itextpdf.layout.properties.TextAlignment;

public record Column<T>(
        String header,
        Function<T, String> extractor,
        TextAlignment aligment,
        float width
) {

    public Column(String header, Function<T, String> extractor) {
        this(header, extractor, TextAlignment.LEFT, 1f);
    }
}
