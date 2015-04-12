package org.yuliskov.nikitaliskov.repositories;
import org.springframework.data.jpa.repository.*;
import org.yuliskov.nikitaliskov.models.*;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
}
