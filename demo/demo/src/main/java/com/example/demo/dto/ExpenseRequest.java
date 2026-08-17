package com.example.demo.dto;

import com.example.demo.model.ExpenseCategory;
import java.time.LocalDate;

public class ExpenseRequest {
    private String title;
    private ExpenseCategory category;
    private Double amount;
    private LocalDate transactionDate;
    private String note;


    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public ExpenseCategory getCategory() { return category; }
    public void setCategory(ExpenseCategory category) { this.category = category; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public LocalDate getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDate transactionDate) { this.transactionDate = transactionDate; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}