package com.example.demo.repository;

import com.example.demo.model.Expense;
import com.example.demo.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserOrderByTransactionDateDesc(Users user);


    Optional<Expense> findByIdAndUser(Long id, Users user);
}