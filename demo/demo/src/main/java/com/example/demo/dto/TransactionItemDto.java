package com.example.demo.dto;

import java.time.LocalDate;

public class TransactionItemDto {
    private String type; // "INCOME" or "EXPENSE"
    private String titleOrSource;
    private Double amount;
    private LocalDate date;
    private String categoryOrNote;

    public TransactionItemDto(String type, String titleOrSource, Double amount, LocalDate date, String categoryOrNote) {
        this.type = type;
        this.titleOrSource = titleOrSource;
        this.amount = amount;
        this.date = date;
        this.categoryOrNote = categoryOrNote;
    }

    public String getType() { return type; }
    public String getTitleOrSource() { return titleOrSource; }
    public Double getAmount() { return amount; }
    public LocalDate getDate() { return date; }
    public String getCategoryOrNote() { return categoryOrNote; }
}