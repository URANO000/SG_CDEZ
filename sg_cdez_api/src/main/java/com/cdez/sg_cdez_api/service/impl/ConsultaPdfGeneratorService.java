package com.cdez.sg_cdez_api.service.impl;

import com.cdez.sg_cdez_api.dto.response.*;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Div;
import com.itextpdf.layout.element.IBlockElement;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class ConsultaPdfGeneratorService {

    private static final Color HEADER = new DeviceRgb(41, 76, 121);
    private static final Color SECTION_BG = new DeviceRgb(41, 76, 121);
    private static final Color CARD_BG = new DeviceRgb(248, 249, 250);
    private static final Color BORDER = new DeviceRgb(220, 220, 220);
    private static final Color LABEL_GRAY = new DeviceRgb(110, 110, 110);

    private static final float TITLE_SIZE = 20;
    private static final float SECTION_TITLE_SIZE = 12;
    private static final float LABEL_SIZE = 8f;
    private static final float VALUE_SIZE = 10f;
    private static final float BODY_SIZE = 9.5f;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private PdfFont regularFont;
    private PdfFont boldFont;

    public byte[] generarConsultaPDF(ConsultaDetailResponse consulta) throws IOException {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        regularFont = PdfFontFactory.createFont(StandardFonts.HELVETICA);
        boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);

        PdfWriter writer = new PdfWriter(output);
        PdfDocument pdf = new PdfDocument(writer);
        // Fixed width, unlimited height -> content only ever extends downward.
        Document document = new Document(pdf, PageSize.A4);
        document.setFont(regularFont);
        document.setMargins(40, 36, 40, 36);

        addHeader(document, consulta);
        addPatientAndProfessionalCards(document, consulta);
        addNarrativeFields(document, consulta);

        if (consulta.consultaNutricional() != null) {
            addNutricionalSection(document, consulta.consultaNutricional());
        }
        if (consulta.consultaPsych() != null) {
            addPsychSection(document, consulta.consultaPsych());
        }

        document.close();
        return output.toByteArray();
    }

    // ---------------------------------------------------------------
    // Header
    // ---------------------------------------------------------------

    private void addHeader(Document document, ConsultaDetailResponse consulta) {
        document.add(new Paragraph("Consulta Médica")
                .setFont(boldFont)
                .setFontSize(TITLE_SIZE)
                .setFontColor(HEADER)
                .setMarginBottom(0));

        String subtitle = safe(consulta.tipoConsulta());
        if (consulta.createdAt() != null) {
            subtitle += "  ·  " + consulta.createdAt().format(DATE_FMT);
        }
        document.add(new Paragraph(subtitle)
                .setFont(regularFont)
                .setFontSize(9)
                .setFontColor(LABEL_GRAY)
                .setMarginBottom(14));
    }


    private void addPatientAndProfessionalCards(Document document, ConsultaDetailResponse consulta) {
        Table outer = new Table(UnitValue.createPercentArray(new float[]{1, 1})).useAllAvailableWidth();
        outer.setMarginBottom(14);

        outer.addCell(cardCell(patientCard(consulta.adultoMayor())));
        outer.addCell(cardCell(professionalCard(consulta.createdBy())));

        document.add(outer);
    }

    private Cell cardCell(IBlockElement content) {
        return new Cell()
                .add(content)
                .setBorder(null)
                .setPadding(0);
    }

    private Div patientCard(AdultoMayorConsultaResponse paciente) {
        Div card = baseCard();
        card.add(sectionLabel("PACIENTE"));

        String nombre = paciente != null ? safe(paciente.nombreCompleto()) : "-";
        card.add(new Paragraph(nombre).setFont(boldFont).setFontSize(VALUE_SIZE + 1).setMarginBottom(4));

        String idLine = paciente != null
                ? safe(paciente.tipoIdentificacion()) + " " + safe(paciente.identificacion())
                : "-";
        card.add(fieldLine("Identificación", idLine));

        String edad = paciente != null && paciente.fechaNacimiento() != null
                ? Period.between(paciente.fechaNacimiento().toLocalDate(), LocalDateTime.now().toLocalDate()).getYears() + " años"
                : "-";
        card.add(fieldLine("Edad", edad));

        return card;
    }

    private Div professionalCard(PersonalConsultaResponse profesional) {
        Div card = baseCard();
        card.add(sectionLabel("REALIZADO POR"));

        String nombre = profesional != null ? safe(profesional.nombreCompleto()) : "-";
        card.add(new Paragraph(nombre).setFont(boldFont).setFontSize(VALUE_SIZE + 1).setMarginBottom(4));

        card.add(fieldLine("Especialidad", profesional != null ? safe(profesional.especialidad()) : "-"));
        card.add(fieldLine("Usuario", profesional != null ? safe(profesional.usuario()) : "-"));

        return card;
    }

    private Div baseCard() {
        return new Div()
                .setBackgroundColor(CARD_BG)
                .setBorder(new SolidBorder(BORDER, 0.5f))
                .setPadding(10)
                .setMarginRight(4);
    }

    // ---------------------------------------------------------------
    // Narrative fields: motivo, descripcion, diagnostico, etc.
    // Rendered as label + paragraph, NOT table cells, so long text wraps freely.
    // ---------------------------------------------------------------

    private void addNarrativeFields(Document document, ConsultaDetailResponse consulta) {
        addTextBlock(document, "Motivo de consulta", consulta.motivo());
        addTextBlock(document, "Descripción", consulta.descripcion());
        addTextBlock(document, "Diagnóstico", consulta.diagnostico());
        addTextBlock(document, "Resultados de evaluaciones", consulta.resultadosEvaluaciones());
        addTextBlock(document, "Recomendaciones", consulta.recomendaciones());
        addTextBlock(document, "Notas", consulta.notas());
    }

    private void addTextBlock(Document document, String label, String value) {
        if (value == null || value.isBlank()) {
            return;
        }
        document.add(sectionLabel(label.toUpperCase()));
        document.add(new Paragraph(value)
                .setFont(regularFont)
                .setFontSize(BODY_SIZE)
                .setMarginBottom(10));
    }


    private void addNutricionalSection(Document document, ConsultaNutricionalDetailResponse n) {
        addSectionHeader(document, "Evaluación Nutricional");

        addTextBlock(document, "Historia alimentaria", n.historiaAlimentaria());

        Table clinico = new Table(UnitValue.createPercentArray(new float[]{1, 1, 1})).useAllAvailableWidth();
        clinico.setMarginBottom(10);
        addGridField(clinico, "Apetito", n.apetito() != null ? n.apetito().toString() : "-");
        addGridField(clinico, "Masticación", safe(n.masticacion()));
        addGridField(clinico, "Deglución", safe(n.deglucion()));
        addGridField(clinico, "Frec. evacuaciones", safe(n.frecuenciaEvacuaciones()));
        addGridField(clinico, "Consistencia (Bristol)", safe(n.consistenciaBristol()));
        addGridField(clinico, "Estado cognitivo", safe(n.estadoCognitivo()));
        document.add(clinico);

        document.add(sectionLabel("SÍNTOMAS"));
        document.add(symptomChecklist(n));

        if (n.antropometria() != null) {
            addSectionHeader(document, "Antropometría");
            document.add(antropometriaGrid(n.antropometria()));
        }

        if (n.tamizajes() != null && !n.tamizajes().isEmpty()) {
            addSectionHeader(document, "Tamizajes");
            document.add(tamizajesTable(n.tamizajes()));
        }

        if (n.examenesLaboratorio() != null && !n.examenesLaboratorio().isEmpty()) {
            addSectionHeader(document, "Exámenes de laboratorio");
            document.add(examenesTable(n.examenesLaboratorio()));
        }
    }

    private Table symptomChecklist(ConsultaNutricionalDetailResponse n) {
        Table t = new Table(UnitValue.createPercentArray(new float[]{1, 1, 1, 1})).useAllAvailableWidth();
        t.setMarginBottom(14);
        addSymptomCell(t, "Náuseas", n.nauseas());
        addSymptomCell(t, "Vómitos", n.vomitos());
        addSymptomCell(t, "Distensión", n.distension());
        addSymptomCell(t, "Gases", n.gases());
        addSymptomCell(t, "Reflujo", n.reflujo());
        addSymptomCell(t, "Diarrea", n.diarrea());
        addSymptomCell(t, "Estreñimiento", n.estrenimiento());
        // pad remaining cell so the grid stays aligned (7 symptoms -> 8 cells)
        t.addCell(new Cell().setBorder(null));
        return t;
    }

    private void addSymptomCell(Table t, String label, boolean present) {
        String mark = present ? "[X] " : "[ ] ";
        t.addCell(new Cell()
                .add(new Paragraph(mark + label).setFontSize(BODY_SIZE))
                .setBorder(null)
                .setPaddingBottom(4));
    }

    private Table antropometriaGrid(AntropometriaResponse a) {
        Table t = new Table(UnitValue.createPercentArray(new float[]{1, 1, 1})).useAllAvailableWidth();
        t.setMarginBottom(14);
        addGridField(t, "Peso actual", fmt(a.pesoActual()) + " kg");
        addGridField(t, "Peso habitual", fmt(a.pesoHabitual()) + " kg");
        addGridField(t, "Peso hace 6 meses", fmt(a.pesoHace6Meses()) + " kg");
        addGridField(t, "Talla", fmt(a.talla()) + " cm");
        addGridField(t, "Altura estimada", fmt(a.alturaEstimada()) + " cm");
        addGridField(t, "IMC", fmt(a.imc()));
        addGridField(t, "Circ. pantorrilla", fmt(a.circunferenciaPantorrilla()) + " cm");
        addGridField(t, "Circ. braquial", fmt(a.circunferenciaBraquial()) + " cm");
        addGridField(t, "Circ. cintura", fmt(a.circunferenciaCintura()) + " cm");
        addGridField(t, "% pérdida de peso", fmt(a.perdidaPesoPorcentaje()) + " %");
        return t;
    }

    private Table tamizajesTable(List<TamizajeResponse> tamizajes) {
        Table t = new Table(UnitValue.createPercentArray(new float[]{2, 1, 3, 3})).useAllAvailableWidth();
        t.setMarginBottom(14);
        addTableHeader(t, "Tipo", "Puntaje", "Resultado", "Observaciones");
        for (TamizajeResponse tz : tamizajes) {
            addBodyCell(t, tz.tipo() != null ? tz.tipo().toString() : "-");
            addBodyCell(t, fmt(tz.puntaje()));
            addBodyCell(t, safe(tz.resultado()));
            addBodyCell(t, safe(tz.observaciones()));
        }
        return t;
    }

    private Table examenesTable(List<ExamenLaboratorioResponse> examenes) {
        Table t = new Table(UnitValue.createPercentArray(new float[]{2, 1, 1, 1, 2})).useAllAvailableWidth();
        t.setMarginBottom(14);
        addTableHeader(t, "Examen", "Valor", "Unidad", "Fecha", "Observaciones");
        for (ExamenLaboratorioResponse ex : examenes) {
            addBodyCell(t, safe(ex.nombre()));
            addBodyCell(t, safe(ex.valor()));
            addBodyCell(t, safe(ex.unidad()));
            addBodyCell(t, ex.fecha() != null ? ex.fecha().format(DATE_FMT) : "-");
            addBodyCell(t, safe(ex.observaciones()));
        }
        return t;
    }


    private void addPsychSection(Document document, ConsultaPsychResponse psych) {
        addSectionHeader(document, "Evaluación Psicológica");
        if (psych.tamizajes() != null && !psych.tamizajes().isEmpty()) {
            document.add(tamizajesTable(psych.tamizajes()));
        }
    }


    private void addSectionHeader(Document document, String title) {
        document.add(new Paragraph(title)
                .setFont(boldFont)
                .setFontSize(SECTION_TITLE_SIZE)
                .setFontColor(ColorConstants.WHITE)
                .setBackgroundColor(SECTION_BG)
                .setPadding(6)
                .setMarginTop(10)
                .setMarginBottom(10));
    }

    private Paragraph sectionLabel(String text) {
        return new Paragraph(text)
                .setFont(boldFont)
                .setFontSize(LABEL_SIZE)
                .setFontColor(LABEL_GRAY)
                .setMarginBottom(2);
    }

    private Paragraph fieldLine(String label, String value) {
        return new Paragraph()
                .add(new com.itextpdf.layout.element.Text(label + ": ").setFont(boldFont).setFontSize(LABEL_SIZE).setFontColor(LABEL_GRAY))
                .add(new com.itextpdf.layout.element.Text(value).setFont(regularFont).setFontSize(VALUE_SIZE))
                .setMarginBottom(2);
    }

    private void addGridField(Table table, String label, String value) {
        Div cellContent = new Div();
        cellContent.add(new Paragraph(label.toUpperCase()).setFont(boldFont).setFontSize(LABEL_SIZE).setFontColor(LABEL_GRAY).setMarginBottom(1));
        cellContent.add(new Paragraph(value).setFont(regularFont).setFontSize(VALUE_SIZE));
        table.addCell(new Cell()
                .add(cellContent)
                .setBorder(new SolidBorder(BORDER, 0.5f))
                .setPadding(6));
    }

    private void addTableHeader(Table table, String... headers) {
        for (String h : headers) {
            table.addHeaderCell(new Cell()
                    .add(new Paragraph(h).setFont(boldFont).setFontSize(9).setFontColor(ColorConstants.WHITE))
                    .setBackgroundColor(HEADER)
                    .setPadding(6)
                    .setTextAlignment(TextAlignment.CENTER));
        }
    }

    private void addBodyCell(Table table, String value) {
        table.addCell(new Cell()
                .add(new Paragraph(value).setFont(regularFont).setFontSize(BODY_SIZE))
                .setBorder(new SolidBorder(BORDER, 0.5f))
                .setPadding(6));
    }

    private String safe(Object value) {
        return value == null ? "-" : value.toString();
    }

    private String fmt(java.math.BigDecimal value) {
        return value == null ? "-" : value.toPlainString();
    }
}