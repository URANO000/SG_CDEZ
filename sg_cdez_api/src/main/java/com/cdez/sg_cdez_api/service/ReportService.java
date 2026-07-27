package com.cdez.sg_cdez_api.service;

import com.cdez.sg_cdez_api.entity.reports.PdfTableReport;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.Function;

@Service
public interface ReportService {
    <T> byte[] generarTablaPDF(PdfTableReport<T> report);
}
