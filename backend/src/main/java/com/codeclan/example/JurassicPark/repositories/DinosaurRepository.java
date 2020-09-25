package com.codeclan.example.JurassicPark.repositories;

import com.codeclan.example.JurassicPark.models.Dinosaur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DinosaurRepository extends JpaRepository<Dinosaur, Long> {

    List<Dinosaur> findAllByUserId(String id);
    Dinosaur findByName(String name);
}
