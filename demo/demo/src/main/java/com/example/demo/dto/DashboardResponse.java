package com.example.demo.dto;

import java.util.List;

public class DashboardResponse {
    // Overall totals
    private Double totalIncome;
    private Double totalExpenses;
    private Double currentBalance;

    // Monthly totals (for the requested/current month)
    private Double monthlyIncome;
    private Double monthlyExpenses;
    private String highestExpenseCategory;

    // Latest 5 transactions
    private List<TransactionItemDto> recentTransactions;

    public DashboardResponse(Double totalIncome, Double totalExpenses, Double currentBalance,
                             Double monthlyIncome, Double monthlyExpenses, String highestExpenseCategory,
                             List<TransactionItemDto> recentTransactions) {
        this.totalIncome = totalIncome;
        this.totalExpenses = totalExpenses;
        this.currentBalance = currentBalance;
        this.monthlyIncome = monthlyIncome;
        this.monthlyExpenses = monthlyExpenses;
        this.highestExpenseCategory = highestExpenseCategory;
        this.recentTransactions = recentTransactions;
    }

    public Double getTotalIncome() { return totalIncome; }
    public Double getTotalExpenses() { return totalExpenses; }
    public Double getCurrentBalance() { return currentBalance; }
    public Double getMonthlyIncome() { return monthlyIncome; }
    public Double getMonthlyExpenses() { return monthlyExpenses; }
    public String getHighestExpenseCategory() { return highestExpenseCategory; }
    public List<TransactionItemDto> getRecentTransactions() { return recentTransactions; }
}