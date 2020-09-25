package com.codeclan.example.JurassicPark.controllers;

import com.codeclan.example.JurassicPark.models.Dinosaur;
import com.codeclan.example.JurassicPark.models.User;
import com.codeclan.example.JurassicPark.repositories.DinosaurRepository;
import com.codeclan.example.JurassicPark.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.Principal;
import java.util.Collection;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
class DinosaurController {

    private final Logger log = LoggerFactory.getLogger(DinosaurController.class);
    private DinosaurRepository dinosaurRepository;
    private UserRepository userRepository;

    public DinosaurController(DinosaurRepository dinosaurRepository, UserRepository userRepository) {
        this.dinosaurRepository = dinosaurRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/dinosaur")
    Collection<Dinosaur> dinosaur(Principal principal) {
        return dinosaurRepository.findAllByUserId(principal.getName());
    }

    @GetMapping("/dinosaur/{id}")
    ResponseEntity<?> getDinosaur(@PathVariable Long id) {
        Optional<Dinosaur> dinosaur = dinosaurRepository.findById(id);
        return dinosaur.map(response -> ResponseEntity.ok().body(response))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

//    @GetMapping("/dinosaur")
//    Collection<Dinosaur> dinosaur() {
//        return dinosaurRepository.findAll();
//    }

    @PostMapping("/dinosaur")
    ResponseEntity<Dinosaur> createGroup(@Valid @RequestBody Dinosaur dinosaur,
                                      @AuthenticationPrincipal OAuth2User principal) throws URISyntaxException {
        log.info("Request to create dinosaur: {}", dinosaur);
        Map<String, Object> details = principal.getAttributes();
        String userId = details.get("sub").toString();
//         check to see if user already exists
        Optional<User> user = userRepository.findById(userId);
        dinosaur.setUser(user.orElse(new User(userId,
                details.get("name").toString(), details.get("email").toString())));
        Dinosaur result = dinosaurRepository.save(dinosaur);
        return ResponseEntity.created(new URI("/api/dinosaur/" + result.getId()))
                .body(result);
    }

    @PutMapping("/dinosaur/{id}")
    ResponseEntity<Dinosaur> updateDinosaur(@Valid @RequestBody Dinosaur dinosaur) {
        log.info("Request to update dinosaur: {}", dinosaur);
        Dinosaur result = dinosaurRepository.save(dinosaur);
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping("/dinosaur")
    public ResponseEntity<?> deleteDinosaur() {
        log.info("Request to delete dinosaur");
        dinosaurRepository.deleteAll();
        return ResponseEntity.ok().build();
    }

}
