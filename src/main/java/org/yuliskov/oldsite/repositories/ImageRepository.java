package org.yuliskov.oldsite.repositories;

import org.springframework.data.jpa.repository.*;
import org.yuliskov.oldsite.models.*;

public interface ImageRepository extends JpaRepository<ImageModel, Long> {
}
