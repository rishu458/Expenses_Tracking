package com.example.demo.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class IncomeRequest {

    @NotBlank(message = "Source is required")
    private String source;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    private Double amount;

    @NotNull(message = "Received date is required")
    private LocalDate receivedDate;

    private String note;


    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public LocalDate getReceivedDate() { return receivedDate; }
    public void setReceivedDate(LocalDate receivedDate) { this.receivedDate = receivedDate; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}