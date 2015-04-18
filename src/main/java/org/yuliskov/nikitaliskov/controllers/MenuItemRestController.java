package org.yuliskov.nikitaliskov.controllers;

import org.slf4j.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.*;
import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;
import org.yuliskov.nikitaliskov.models.*;
import org.yuliskov.nikitaliskov.repositories.*;

import javax.servlet.http.*;
import java.util.*;

@RestController
public class MenuItemRestController {
    private Logger logger = LoggerFactory.getLogger(this.getClass());
    @Autowired
    private MenuItemRepository repository;

    @RequestMapping(value = "/menuitems", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    List<MenuItem> findAll(HttpServletResponse response){
        List<MenuItem> all = repository.findAll();
        List<MenuItem> res = new ArrayList<>();
        if (all.size() == 0)
            response.setStatus(HttpServletResponse.SC_NOT_FOUND); // tells clent to load default set

        for (MenuItem item : all) {
            if (item.getIsRoot()) res.add(item);
        }

        return res;
    }

    @RequestMapping(value = "/menuitems", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    void saveAll(@RequestBody MenuItem[] items) {
        repository.deleteAllInBatch();
        for (MenuItem item: items){
            item.setIsRoot(true);
        }
        logger.info("items length {}", items.length);
        logger.info("items before {}", Arrays.toString(items));
        List<MenuItem> itemsAfter = repository.save(Arrays.asList(items));
        logger.info("items after {}", itemsAfter);
    }

}
