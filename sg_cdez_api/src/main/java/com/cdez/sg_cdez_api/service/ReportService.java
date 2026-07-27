package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.entity.reports.PdfTableReport;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public interface ReportService {
    <T> byte[] generarTablaPDF(PdfTableReport<T> report) throws IOException;
}
