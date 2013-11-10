package org.firsthash.nikart.repositories;

import org.firsthash.nikart.models.*;
import org.springframework.cache.annotation.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.*;

@Repository
public interface ImageRepository extends JpaRepository<ImageModel, Long> {
}
