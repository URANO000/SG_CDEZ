package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.entity.reports.PdfTableReport;
import com.cdez.sg_cdez_api.service.ReportService;
import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.UnitValue;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import com.cdez.sg_cdez_api.entity.reports.Column;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    @Override
    public <T> byte[] generarTablaPDF(PdfTableReport<T> report) {

        ByteArrayOutputStream output = new ByteArrayOutputStream();

        PdfWriter writer = new PdfWriter(output);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        document.add(
                new Paragraph(report.getTitulo())
                        .setFontSize(18)
        );

        float[] widths = new float[report.getColumnas().size()];

        for (int i = 0; i < report.getColumnas().size(); i++) {
            widths[i] = report.getColumnas().get(i).width();
        }

        Table table = new Table(UnitValue.createPercentArray(widths)).useAllAvailableWidth();

        for(Column<T> column : report.getColumnas()){
            table.addHeaderCell(
                    new Cell()
                            .add(new Paragraph(column.header()))
            );
        }

        for (T item : report.getDatos()){
            for (Column<T> column : report.getColumnas()){
                String value = column.extractor().apply(item);

                table.addCell(
                        new Cell()
                                .add(new Paragraph(
                                        value == null ? "" : value
                                ))
                                .setTextAlignment(column.aligment())
                );
            }
        }

        document.add(table);
        document.close();
        return output.toByteArray();
    }
}
