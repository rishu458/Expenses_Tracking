package com.example.demo.controller;

import com.example.demo.dto.ExpenseRequest;
import com.example.demo.dto.ExpenseResponse;
import com.example.demo.model.Expense;
import com.example.demo.model.Users;
import com.example.demo.repository.ExpenseRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public ExpenseController(ExpenseRepository expenseRepository, UserRepository userRepository) {
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    // 1. Add Expense
    @PostMapping
    public ResponseEntity<?> addExpense(@RequestBody ExpenseRequest request, Authentication authentication) {
        Users user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");

        Expense expense = new Expense(
                request.getTitle(),
                request.getCategory(),
                request.getAmount(),
                request.getTransactionDate(),
                request.getNote(),
                user
        );

        Expense saved = expenseRepository.save(expense);
        return ResponseEntity.ok(mapToResponse(saved));
    }

    // 2. View Latest Expenses
    @GetMapping
    public ResponseEntity<?> getLatestExpenses(Authentication authentication) {
        Users user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");

        List<ExpenseResponse> expenses = expenseRepository.findByUserOrderByTransactionDateDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(expenses);
    }

    // 3. Edit Expense
    @PutMapping("/{id}")
    public ResponseEntity<?> updateExpense(@PathVariable Long id, @RequestBody ExpenseRequest request, Authentication authentication) {
        Users user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");

        Expense expense = expenseRepository.findByIdAndUser(id, user).orElse(null);
        if (expense == null) return ResponseEntity.status(404).body("Expense not found");

        expense.setTitle(request.getTitle());
        expense.setCategory(request.getCategory());
        expense.setAmount(request.getAmount());
        expense.setTransactionDate(request.getTransactionDate());
        expense.setNote(request.getNote());

        Expense updated = expenseRepository.save(expense);
        return ResponseEntity.ok(mapToResponse(updated));
    }

    // 4. Delete Expense
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable Long id, Authentication authentication) {
        Users user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");

        Expense expense = expenseRepository.findByIdAndUser(id, user).orElse(null);
        if (expense == null) return ResponseEntity.status(404).body("Expense not found");

        expenseRepository.delete(expense);
        return ResponseEntity.ok("Expense deleted successfully");
    }

    private ExpenseResponse mapToResponse(Expense expense) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getTitle(),
                expense.getCategory(),
                expense.getAmount(),
                expense.getTransactionDate(),
                expense.getNote()
        );
    }
}