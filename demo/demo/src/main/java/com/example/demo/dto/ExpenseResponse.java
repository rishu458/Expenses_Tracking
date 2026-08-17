package com.example.demo.dto;

import com.example.demo.model.ExpenseCategory;
import java.time.LocalDate;

public class ExpenseResponse {
    private Long id;
    private String title;
    private ExpenseCategory category;
    private Double amount;
    private LocalDate transactionDate;
    private String note;

    public ExpenseResponse(Long id, String title, ExpenseCategory category, Double amount, LocalDate transactionDate, String note) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.amount = amount;
        this.transactionDate = transactionDate;
        this.note = note;
    }


    public Long getId() { return id; }
    public String getTitle() { return title; }
    public ExpenseCategory getCategory() { return category; }
    public Double getAmount() { return amount; }
    public LocalDate getTransactionDate() { return transactionDate; }
    public String getNote() { return note; }
}