package com.example.srt.controller;

import com.example.srt.dto.RequestDto;
import com.example.srt.entity.Request;
import com.example.srt.repository.RequestRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    public ResponseEntity<?> createRequest(@RequestBody RequestDto dto) {
        // Required-field validation
        if (isBlank(dto.getName()) || isBlank(dto.getTitle()) || isBlank(dto.getDescription())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Validation failed");
            error.put("message", "name, title, and description are required");
            return ResponseEntity.badRequest().body(error);
        }

        Request request = new Request();
        request.setName(dto.getName().trim());
        request.setTitle(dto.getTitle().trim());
        request.setDescription(dto.getDescription().trim());

        Request saved = requestRepository.save(request);
        return ResponseEntity.status(201).body(saved);
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}
