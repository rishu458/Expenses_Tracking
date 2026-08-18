package com.example.demo.repository;

import com.example.demo.model.Income;
import com.example.demo.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, Long> {

    List<Income> findByUserOrderByReceivedDateDesc(Users user);
    List<Income> findByUserAndReceivedDateBetween(Users user, LocalDate startDate, LocalDate endDate);
}