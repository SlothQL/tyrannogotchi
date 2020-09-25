package com.codeclan.example.JurassicPark;

import com.codeclan.example.JurassicPark.models.Dinosaur;
import com.codeclan.example.JurassicPark.repositories.DinosaurRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class Initializer implements ApplicationRunner {

    @Autowired
    DinosaurRepository dinosaurRepository;

    public Initializer() {}

    public void run(ApplicationArguments args) {

        Dinosaur tRex = new Dinosaur("Tyrannosaurus Rex", "https://i.ibb.co/89mddTZ/dino.png", true, true, true);
        dinosaurRepository.save(tRex);

    }

}
