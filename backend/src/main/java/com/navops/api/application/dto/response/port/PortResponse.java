package com.navops.api.application.dto.response.port;

import com.navops.api.domain.enums.PortStatusEnum;

import java.util.UUID;

public record PortResponse(
    UUID id,
    String name,
    String portType,
    String dockType,
    String code,
    String contactPhone,
    String contactEmail,
    String contactWeb,
    String timezone,
    Double latitude,
    Double longitude,
    Short dockCount,
    Double maxLength,
    Double maxDraft,
    String countryName,
    String provinceName,
    String cityName,
    String mainImageUrl,
    PortStatusEnum status,
    Boolean isActive
) {}
