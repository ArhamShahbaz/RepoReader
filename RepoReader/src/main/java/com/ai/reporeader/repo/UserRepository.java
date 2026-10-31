package com.ai.reporeader.repo;

import java.util.Optional;
import java.util.UUID;

import com.ai.reporeader.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByGithubId(Long githubId);
}
