package com.example.demo.controller;

import com.example.demo.dto.IncomeRequest;
import com.example.demo.dto.IncomeResponse;
import com.example.demo.model.Income;
import com.example.demo.model.Users;
import com.example.demo.repository.IncomeRepository;
import com.example.demo.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/incomes")
public class IncomeController {

    private final IncomeRepository incomeRepository;
    private final UserRepository usersRepository;

    public IncomeController(IncomeRepository incomeRepository, UserRepository usersRepository) {
        this.incomeRepository = incomeRepository;
        this.usersRepository = usersRepository;
    }

    // creating
    @PostMapping
    public ResponseEntity<IncomeResponse> createIncome(
            @Valid @RequestBody IncomeRequest dto,
            Authentication authentication) {

        Users user = usersRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Income income = new Income(dto.getSource(), dto.getAmount(), dto.getReceivedDate(), dto.getNote(), user);
        Income saved = incomeRepository.save(income);

        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(saved));
    }

    // read
    @GetMapping
    public ResponseEntity<List<IncomeResponse>> getAllIncomes(Authentication authentication) {
        Users user = usersRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<IncomeResponse> incomes = incomeRepository.findByUserOrderByReceivedDateDesc(user)
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(incomes);
    }

    // updating
    @PutMapping("/{id}")
    public ResponseEntity<IncomeResponse> updateIncome(
            @PathVariable Long id,
            @Valid @RequestBody IncomeRequest dto,
            Authentication authentication) {

        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Income not found"));

        if (!income.getUser().getEmail().equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        income.setSource(dto.getSource());
        income.setAmount(dto.getAmount());
        income.setReceivedDate(dto.getReceivedDate());
        income.setNote(dto.getNote());

        Income updated = incomeRepository.save(income);
        return ResponseEntity.ok(toResponseDTO(updated));
    }

    // delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncome(@PathVariable Long id, Authentication authentication) {
        Income income = incomeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Income not found"));

        if (!income.getUser().getEmail().equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        incomeRepository.delete(income);
        return ResponseEntity.noContent().build();
    }

    private IncomeResponse toResponseDTO(Income income) {
        return new IncomeResponse(
                income.getId(),
                income.getSource(),
                income.getAmount(),
                income.getReceivedDate(),
                income.getNote()
        );
    }
}