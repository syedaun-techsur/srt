package com.example.srt.controller;

import com.example.srt.dto.RequestDto;
import com.example.srt.entity.Request;
import com.example.srt.repository.RequestRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final RequestRepository requestRepository;

    public RequestController(RequestRepository requestRepository) {
        this.requestRepository = requestRepository;
    }

    @GetMapping
    public ResponseEntity<List<Request>> getAllRequests() {
        List<Request> requests = requestRepository.findAll();
        return ResponseEntity.ok(requests);
    }

    @PostMapping
    public ResponseEntity<Request> createRequest(@Valid @RequestBody RequestDto dto) {
        Request request = new Request();
        request.setName(dto.getName());
        request.setTitle(dto.getTitle());
        request.setDescription(dto.getDescription());
        Request saved = requestRepository.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
