package com.ai.reporeader.dto;

import com.ai.reporeader.enums.MessageRole;

import java.time.Instant;
import java.util.List;
import java.util.UUID;



public record ChatMessageResponse(
        UUID id,
        MessageRole role,
        String content,
        List<CitationDto> citations,
        Instant createdAt) {
}
