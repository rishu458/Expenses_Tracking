package com.example.demo.dto;

import java.time.LocalDate;

public class IncomeResponse {

    private Long id;
    private String source;
    private Double amount;
    private LocalDate receivedDate;
    private String note;

    public IncomeResponse(Long id, String source, Double amount, LocalDate receivedDate, String note) {
        this.id = id;
        this.source = source;
        this.amount = amount;
        this.receivedDate = receivedDate;
        this.note = note;
    }

    public Long getId() { return id; }
    public String getSource() { return source; }
    public Double getAmount() { return amount; }
    public LocalDate getReceivedDate() { return receivedDate; }
    public String getNote() { return note; }
}