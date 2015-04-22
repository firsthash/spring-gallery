package org.yuliskov.artportfolio.controllers;

import org.slf4j.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.yuliskov.artportfolio.models.*;
import org.yuliskov.artportfolio.repositories.*;

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
        if (repository.count() == 0) {
            response.setStatus(HttpServletResponse.SC_NO_CONTENT);
            //response.setStatus(HttpServletResponse.SC_NOT_FOUND); // tells to client to load default json objects
            return null;
        }

        List<MenuItem> all = repository.findAll();
        List<MenuItem> res = new ArrayList<>();

        for (MenuItem item : all) {
            if (item.getIsRoot()) res.add(item);
        }

        return res;
    }

    @RequestMapping(value = "/menuitems", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE)
    void saveAll(@RequestBody MenuItem[] items, HttpServletResponse response) {
        if (repository.count() == 0) {
            response.setStatus(HttpServletResponse.SC_CREATED);
        }
        repository.deleteAllInBatch();
        for (MenuItem item : items) {
            item.setIsRoot(true);
        }
        logger.info("items length {}", items.length);
        logger.info("items before {}", Arrays.toString(items));
        List<MenuItem> itemsAfter = repository.save(Arrays.asList(items));
        logger.info("items after {}", itemsAfter);
    }

}
