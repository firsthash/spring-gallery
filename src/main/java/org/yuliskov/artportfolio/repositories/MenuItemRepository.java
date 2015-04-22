package org.yuliskov.artportfolio.repositories;
import org.springframework.data.jpa.repository.*;
import org.yuliskov.artportfolio.models.*;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
}
