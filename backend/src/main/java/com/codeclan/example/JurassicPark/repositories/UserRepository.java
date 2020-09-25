package com.codeclan.example.JurassicPark.repositories;

import com.codeclan.example.JurassicPark.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
}
