package com.cdez.sg_cdez_api.entity.reports;

import java.util.function.Function;
import org.apache.poi.ss.usermodel.HorizontalAlignment;

public record ExcelColumn<T>(
        String header,
        Function<T, Object> extractor,
        int width,
        HorizontalAlignment alignment
) {
}