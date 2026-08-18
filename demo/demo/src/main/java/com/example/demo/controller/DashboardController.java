package com.example.demo.controller;

import com.example.demo.dto.DashboardResponse;
import com.example.demo.dto.TransactionItemDto;
import com.example.demo.model.Expense;
import com.example.demo.model.Income;
import com.example.demo.model.Users;
import com.example.demo.repository.ExpenseRepository;
import com.example.demo.repository.IncomeRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public DashboardController(IncomeRepository incomeRepository,
                               ExpenseRepository expenseRepository,
                               UserRepository userRepository) {
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> getDashboardData(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            Authentication authentication) {

        Users user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");


        LocalDate now = LocalDate.now();
        int targetYear = (year != null) ? year : now.getYear();
        int targetMonth = (month != null) ? month : now.getMonthValue();

        YearMonth yearMonth = YearMonth.of(targetYear, targetMonth);
        LocalDate startOfMonth = yearMonth.atDay(1);
        LocalDate endOfMonth = yearMonth.atEndOfMonth();

        // all incomes & expenses for overall totals
        List<Income> allIncomes = incomeRepository.findByUserOrderByReceivedDateDesc(user);
        List<Expense> allExpenses = expenseRepository.findByUserOrderByTransactionDateDesc(user);

        double totalIncome = allIncomes.stream().mapToDouble(Income::getAmount).sum();
        double totalExpenses = allExpenses.stream().mapToDouble(Expense::getAmount).sum();
        double currentBalance = totalIncome - totalExpenses;

        // monthly records
        List<Income> monthlyIncomes = incomeRepository.findByUserAndReceivedDateBetween(user, startOfMonth, endOfMonth);
        List<Expense> monthlyExpenses = expenseRepository.findByUserAndTransactionDateBetween(user, startOfMonth, endOfMonth);

        double monthlyIncomeTotal = monthlyIncomes.stream().mapToDouble(Income::getAmount).sum();
        double monthlyExpenseTotal = monthlyExpenses.stream().mapToDouble(Expense::getAmount).sum();

        // highest expense category of month
        String highestExpenseCategory = monthlyExpenses.stream()
                .collect(Collectors.groupingBy(e -> e.getCategory().name(), Collectors.summingDouble(Expense::getAmount)))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("None");

        // latest 5 transactions
        List<TransactionItemDto> transactions = new ArrayList<>();

        for (Income inc : allIncomes) {
            transactions.add(new TransactionItemDto("INCOME", inc.getSource(), inc.getAmount(), inc.getReceivedDate(), inc.getNote()));
        }
        for (Expense exp : allExpenses) {
            transactions.add(new TransactionItemDto("EXPENSE", exp.getTitle(), exp.getAmount(), exp.getTransactionDate(), exp.getCategory().name()));
        }

        List<TransactionItemDto> latest5Transactions = transactions.stream()
                .sorted(Comparator.comparing(TransactionItemDto::getDate).reversed())
                .limit(5)
                .collect(Collectors.toList());

        // response
        DashboardResponse response = new DashboardResponse(
                totalIncome,
                totalExpenses,
                currentBalance,
                monthlyIncomeTotal,
                monthlyExpenseTotal,
                highestExpenseCategory,
                latest5Transactions
        );

        return ResponseEntity.ok(response);
    }
}