package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "incomes")
public class Income {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String source;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private LocalDate receivedDate;

    private String note;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    public Income() {}

    public Income(String source, Double amount, LocalDate receivedDate, String note, Users user) {
        this.source = source;
        this.amount = amount;
        this.receivedDate = receivedDate;
        this.note = note;
        this.user = user;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public LocalDate getReceivedDate() { return receivedDate; }
    public void setReceivedDate(LocalDate receivedDate) { this.receivedDate = receivedDate; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public Users getUser() { return user; }
    public void setUser(Users user) { this.user = user; }
}