package kz.birlyk.backend.controller;

import jakarta.validation.Valid;
import kz.birlyk.backend.dto.GuestCreateRequest;
import kz.birlyk.backend.dto.GuestCreateResponse;
import kz.birlyk.backend.entity.Event;
import kz.birlyk.backend.entity.Guest;
import kz.birlyk.backend.repository.EventRepository;
import kz.birlyk.backend.repository.GuestRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@RestController
@RequestMapping("/api/guests")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class GuestController {

    private final GuestRepository guestRepository;
    private final EventRepository eventRepository;

    public GuestController(GuestRepository guestRepository, EventRepository eventRepository) {
        this.guestRepository = guestRepository;
        this.eventRepository = eventRepository;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GuestCreateResponse createGuest(@Valid @RequestBody GuestCreateRequest request) {
        Event event = eventRepository.findById(request.eventId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Event not found"
                ));

        Guest guest = new Guest();
        guest.setId(request.id() == null ? UUID.randomUUID() : request.id());
        guest.setEvent(event);
        guest.setOwnerId(request.ownerId());
        guest.setFullName(request.fullName());
        guest.setPhone(request.phone());
        guest.setTableLabel(request.tableLabel());
        guest.setSeatNumber(request.seatNumber());

        Guest savedGuest = guestRepository.save(guest);
        return new GuestCreateResponse(
                savedGuest.getId(),
                event.getId(),
                savedGuest.getOwnerId(),
                savedGuest.getFullName(),
                savedGuest.getTableLabel(),
                savedGuest.getSeatNumber()
        );
    }
}
