package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class Name {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String value;

    public Name() {}

    public Name(String value) {
        this.value = value;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
}