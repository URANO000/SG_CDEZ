package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.response.ConsultaDetailResponse;
import com.cdez.sg_cdez_api.entity.reports.ExcelColumn;
import com.cdez.sg_cdez_api.entity.reports.ExcelTableReport;
import com.cdez.sg_cdez_api.entity.reports.PdfTableReport;
import com.cdez.sg_cdez_api.service.ReportService;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.colors.*;
import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.font.*;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.*;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.*;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.VerticalAlignment;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Objects;
import java.util.Optional;

import com.cdez.sg_cdez_api.entity.reports.Column;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {
    private final ConsultaPdfGeneratorService consultaPdfGenerator;
    private static final Color HEADER = new DeviceRgb(41, 76, 121);
    private static final Color ROW_ALT = new DeviceRgb(248, 249, 250);
    private static final Color BORDER = new DeviceRgb(220, 220, 220);

    private static final float TITLE_SIZE = 22;
    private static final float HEADER_SIZE = 11;
    private static final float BODY_SIZE = 8.5f;


    @Override
    public byte[] generarConsultaPDF(ConsultaDetailResponse consulta) throws IOException {
        return consultaPdfGenerator.generarConsultaPDF(consulta);
    }

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


        document.add(table);
        document.close();
        return output.toByteArray();
    }

    @Override
    public <T> byte[] generarTablaExcel(ExcelTableReport<T> report) throws IOException {

        try (
                Workbook workbook = new XSSFWorkbook();
                ByteArrayOutputStream output = new ByteArrayOutputStream()
        ) {

            Sheet sheet = workbook.createSheet("Reporte");

            Font titleFont = workbook.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 16);

            CellStyle titleStyle = workbook.createCellStyle();
            titleStyle.setFont(titleFont);
            titleStyle.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);

            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFont(headerFont);
            headerStyle.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
            headerStyle.setFillForegroundColor(
                    IndexedColors.DARK_BLUE.getIndex()
            );
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            aplicarBordes(headerStyle);

            CellStyle normalStyle = workbook.createCellStyle();
            normalStyle.setVerticalAlignment(org.apache.poi.ss.usermodel.VerticalAlignment.CENTER);
            aplicarBordes(normalStyle);

            CellStyle alternateStyle = workbook.createCellStyle();
            alternateStyle.cloneStyleFrom(normalStyle);
            alternateStyle.setFillForegroundColor(
                    IndexedColors.GREY_25_PERCENT.getIndex()
            );
            alternateStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            CellStyle metadataStyle = workbook.createCellStyle();
            metadataStyle.setAlignment(org.apache.poi.ss.usermodel.HorizontalAlignment.CENTER);

            Font metadataFont = workbook.createFont();
            metadataFont.setItalic(true);
            metadataFont.setColor(IndexedColors.GREY_50_PERCENT.getIndex());

            metadataStyle.setFont(metadataFont);


            int rowIndex = 0;
            int columnas = report.getColumnas().size();

            // TÍTULO
            Row titleRow = sheet.createRow(rowIndex++);

            org.apache.poi.ss.usermodel.Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue(report.getTitulo());
            titleCell.setCellStyle(titleStyle);

            sheet.addMergedRegion(
                    new CellRangeAddress(
                            titleRow.getRowNum(),
                            titleRow.getRowNum(),
                            0,
                            columnas - 1
                    )
            );

            // TIMESTAMP
            if (report.isShowTimestamp()) {

                Row timestampRow = sheet.createRow(rowIndex++);

                org.apache.poi.ss.usermodel.Cell timestampCell = timestampRow.createCell(0);

                timestampCell.setCellValue(
                        "Generado en " +
                                LocalDateTime.now().format(
                                        DateTimeFormatter.ofPattern(
                                                "dd/MM/yyyy HH:mm"
                                        )
                                )
                );

                timestampCell.setCellStyle(metadataStyle);

                sheet.addMergedRegion(
                        new CellRangeAddress(
                                timestampRow.getRowNum(),
                                timestampRow.getRowNum(),
                                0,
                                columnas - 1
                        )
                );
            }

            // TOTAL DE REGISTROS
            Row totalRow = sheet.createRow(rowIndex++);

            org.apache.poi.ss.usermodel.Cell totalCell = totalRow.createCell(0);
            totalCell.setCellValue(
                    "Registros totales: " + report.getDatos().size()
            );

            totalCell.setCellStyle(metadataStyle);

            sheet.addMergedRegion(
                    new CellRangeAddress(
                            totalRow.getRowNum(),
                            totalRow.getRowNum(),
                            0,
                            columnas - 1
                    )
            );

            // Espacio
            rowIndex++;

            int headerRowIndex = rowIndex;

            Row headerRow = sheet.createRow(rowIndex++);

            for (int i = 0; i < report.getColumnas().size(); i++) {

                ExcelColumn<T> column = report.getColumnas().get(i);

                org.apache.poi.ss.usermodel.Cell cell = headerRow.createCell(i);
                cell.setCellValue(column.header());
                cell.setCellStyle(headerStyle);
            }


            boolean alternate = false;

            for (T item : report.getDatos()) {

                Row row = sheet.createRow(rowIndex++);

                for (int i = 0; i < report.getColumnas().size(); i++) {

                    ExcelColumn<T> column = report.getColumnas().get(i);

                    org.apache.poi.ss.usermodel.Cell cell = row.createCell(i);

                    Object value = column.extractor().apply(item);

                    setCellValue(cell, value);

                    CellStyle baseStyle =
                            report.isZebraRows() && alternate
                                    ? alternateStyle
                                    : normalStyle;

                    CellStyle cellStyle = workbook.createCellStyle();
                    cellStyle.cloneStyleFrom(baseStyle);
                    cellStyle.setAlignment(column.alignment());

                    cell.setCellStyle(cellStyle);
                }

                alternate = !alternate;
            }


            for (int i = 0; i < report.getColumnas().size(); i++) {

                ExcelColumn<T> column = report.getColumnas().get(i);

                int width = Math.min(column.width(), 255);

                sheet.setColumnWidth(i, width * 256);
            }

            if (report.isAutoFilter() && !report.getDatos().isEmpty()) {

                sheet.setAutoFilter(
                        new CellRangeAddress(
                                headerRowIndex,
                                rowIndex - 1,
                                0,
                                columnas - 1
                        )
                );
            }

            // Mantener encabezados visibles al hacer scroll
            if (report.isFreezeHeader()) {
                sheet.createFreezePane(
                        0,
                        headerRowIndex + 1
                );
            }

            workbook.write(output);

            return output.toByteArray();
        }
    }

    private void aplicarBordes(CellStyle style) {
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
    }

    private void setCellValue(org.apache.poi.ss.usermodel.Cell cell, Object value) {

        if (value == null) {
            cell.setBlank();
            return;
        }

        if (value instanceof Number number) {
            cell.setCellValue(number.doubleValue());
            return;
        }

        if (value instanceof Boolean bool) {
            cell.setCellValue(bool);
            return;
        }

        if (value instanceof LocalDate date) {
            cell.setCellValue(date);
            return;
        }

        if (value instanceof LocalDateTime dateTime) {
            cell.setCellValue(dateTime);
            return;
        }

        cell.setCellValue(value.toString());
    }
}
