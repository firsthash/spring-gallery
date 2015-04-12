package org.yuliskov.nikitaliskov.repositories;

import org.springframework.data.jpa.repository.*;
import org.yuliskov.nikitaliskov.models.*;

public interface UploadedImageRepository extends JpaRepository<UploadedImage, Long> {
}
