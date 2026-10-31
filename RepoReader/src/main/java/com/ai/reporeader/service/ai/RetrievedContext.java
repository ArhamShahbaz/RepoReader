package com.ai.reporeader.service.ai;

import com.ai.reporeader.dto.CitationDto;

import java.util.List;



public record RetrievedContext(
        List<CitationDto> citations,
        String contextText) {
}
