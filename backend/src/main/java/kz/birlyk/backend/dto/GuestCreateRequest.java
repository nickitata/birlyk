package kz.birlyk.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record GuestCreateRequest(
        UUID id,
        @NotNull UUID eventId,
        UUID ownerId,
        @NotBlank String fullName,
        String phone,
        String tableLabel,
        Integer seatNumber
) {
}
