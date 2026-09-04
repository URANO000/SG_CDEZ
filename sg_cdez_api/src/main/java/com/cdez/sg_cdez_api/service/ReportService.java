package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.dto.response.ConsultaDetailResponse;
import com.cdez.sg_cdez_api.entity.reports.ExcelTableReport;
import com.cdez.sg_cdez_api.entity.reports.PdfTableReport;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public interface ReportService {
    <T> byte[] generarTablaPDF(PdfTableReport<T> report) throws IOException;
    byte[] generarConsultaPDF(ConsultaDetailResponse consulta) throws IOException;
    <T> byte[] generarTablaExcel(ExcelTableReport<T> report) throws IOException;
}
