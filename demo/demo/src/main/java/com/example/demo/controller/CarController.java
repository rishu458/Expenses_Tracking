package com.example.demo.controller;

import com.example.demo.model.Cars;
import com.example.demo.repository.CarRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/con")
@CrossOrigin(origins = "*")

public class CarController {

    private final CarRepository carRepository;

    public CarController(CarRepository carsRepository) {
        this.carRepository = carsRepository;
    }

    @PostMapping
    public Cars createCar(@RequestBody Cars car) {
        return carRepository.save(car);
    }

    @GetMapping
    public List<Cars> getAllCars(){
        return  carRepository.findAll();
    }

}
