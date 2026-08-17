package com.example.demo.controller;

import com.example.demo.model.Name;
import com.example.demo.repository.NameRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/names")
@CrossOrigin(origins = "*") // fine for dev, restrict this later
public class NameController {

    private final NameRepository nameRepository;

    public NameController(NameRepository nameRepository) {
        this.nameRepository = nameRepository;
    }

    @PostMapping
    public Name saveName(@RequestBody Name name) {
        return nameRepository.save(name);
    }

    @GetMapping
    public List<Name> getAllNames() {
        return nameRepository.findAll();
    }
}