package org.yuliskov.nikart.repositories;

import org.springframework.data.jpa.repository.*;
import org.yuliskov.nikart.models.*;

public interface GalleryRepository extends JpaRepository<GalleryModel, Long> {
}
