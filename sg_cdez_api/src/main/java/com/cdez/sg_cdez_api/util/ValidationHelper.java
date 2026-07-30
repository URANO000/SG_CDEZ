package com.cdez.sg_cdez_api.util;

import com.cdez.sg_cdez_api.util.Exceptions.PageOutOfBoundsException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ValidationHelper {

    public void checkPaginationBounds(Page<?> objectPage, Pageable pageable){
        if(objectPage.getTotalElements() > 0 && pageable.getPageNumber() >= objectPage.getTotalPages()){
            throw new PageOutOfBoundsException(
                    String.format("Número de página %d está fuera de rango. Páginas totales: %d", pageable.getPageNumber(),objectPage.getTotalPages())
            );
        }
    }
}
