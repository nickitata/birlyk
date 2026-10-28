package kz.birlyk.backend.dto;

import java.util.UUID;

public record GuestCreateResponse(
        UUID id,
        UUID eventId,
        UUID ownerId,
        String fullName,
        String tableLabel,
        Integer seatNumber
) {
}
