package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.entity.reports.PdfTableReport;
import com.cdez.sg_cdez_api.service.ReportService;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.colors.*;
import com.itextpdf.kernel.font.*;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.*;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Objects;
import java.util.Optional;

import com.cdez.sg_cdez_api.entity.reports.Column;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {
    private static final Color HEADER = new DeviceRgb(41, 76, 121);
    private static final Color ROW_ALT = new DeviceRgb(248, 249, 250);
    private static final Color BORDER = new DeviceRgb(220, 220, 220);

    private static final float TITLE_SIZE = 22;
    private static final float HEADER_SIZE = 11;
    private static final float BODY_SIZE = 8.5f;

    @Override
    public <T> byte[] generarTablaPDF(PdfTableReport<T> report) throws IOException {

        ByteArrayOutputStream output = new ByteArrayOutputStream();
        PdfFont regularFont = PdfFontFactory.createFont(StandardFonts.HELVETICA);
        PdfFont boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);

        PdfWriter writer = new PdfWriter(output);

        // Landscape o portrait
        PageSize pageSize;
        switch (report.getOrientation()){
            case LANDSCAPE ->
                    pageSize = PageSize.A4.rotate();
            case PORTRAIT ->
                    pageSize = PageSize.A4;
            default ->
                    pageSize = report.getColumnas().size() > 6
                            ? PageSize.A4.rotate()
                            :PageSize.A4;
        }

        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf, pageSize);

        document.setFont(regularFont);

        // Set margins
        document.setMargins(40, 36, 40, 36);
        // Titulo
        Paragraph title = new Paragraph(report.getTitulo())
                .setFont(boldFont)
                .setFontSize(TITLE_SIZE)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(4);

        document.add(title);

        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        // Timestamp
        if(report.isShowTimestamp()){
            document.add(
                    new Paragraph("Generado en " +
                            LocalDateTime.now().format(formatter))
                            .setFontSize(9)
                            .setFontColor(ColorConstants.GRAY)
                            .setTextAlignment(TextAlignment.CENTER)
                            .setMarginBottom(20)
            );
        }

        // Total de records
        document.add(
                new Paragraph("Registros totales: " + report.getDatos().size())
                        .setFontSize(BODY_SIZE)
                        .setMarginBottom(10)
                        .setTextAlignment(TextAlignment.CENTER)
        );

        // Columnas
        float[] widths = new float[report.getColumnas().size()];

        for (int i = 0; i < report.getColumnas().size(); i++) {
            widths[i] = report.getColumnas().get(i).width();
        }

        Table table = new Table(UnitValue.createPercentArray(widths)).useAllAvailableWidth();

        // Encabezados
        for(Column<T> column : report.getColumnas()){
            table.addHeaderCell(
                    new Cell()
                            .add(new Paragraph(column.header())
                                    .setFont(boldFont)
                                    .setFontSize(HEADER_SIZE)
                                    .setFontColor(ColorConstants.WHITE)
                            )
                            .setTextAlignment(TextAlignment.CENTER)
                            .setBackgroundColor(HEADER)
                            .setPadding(8)
            );
        }

        boolean alternate = false;

        for (T item : report.getDatos()){
            for (Column<T> column : report.getColumnas()){
                Cell cell = new Cell();

                if(report.isZebraRows() && alternate){
                    cell.setBackgroundColor(ROW_ALT);
                }

                // Estílos
                cell.setTextAlignment(column.aligment());
                cell.setPadding(6);
                cell.setBorder(new SolidBorder(BORDER, 0.5f));
                cell.setFont(regularFont);
                cell.setFontSize(BODY_SIZE);

                cell.add(new Paragraph(
                        Optional.ofNullable(
                                column.extractor().apply(item)
                        ).orElse("")
                ));
                table.addCell(cell);
            }
            alternate = !alternate;
        }

        table.setMarginTop(10);
        table.setMarginBottom(15);
        table.setSkipFirstHeader(false);

        for (Column<T> column : report.getColumnas()) {

            int max = report.getDatos().stream()
                    .map(column.extractor())
                    .filter(Objects::nonNull)
                    .mapToInt(String::length)
                    .max()
                    .orElse(0);

            System.out.println(column.header() + " -> " + max);
        }

        // Footer
//        pdf.addEventHandler(
//                PdfTableReport.END_PAGE,
//                new FooterHandler()
//        );

        document.add(table);
        document.close();
        return output.toByteArray();
    }
}
