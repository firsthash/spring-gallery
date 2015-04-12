package org.yuliskov.nikitaliskov.controllers;

import org.apache.commons.io.*;
import org.slf4j.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.*;
import org.springframework.ui.*;
import org.springframework.web.bind.annotation.*;
import org.yuliskov.nikitaliskov.models.*;
import org.yuliskov.nikitaliskov.repositories.*;

import javax.servlet.http.*;
import java.io.*;
import java.util.*;

@RestController
public class MenuItemController {
    private Logger logger = LoggerFactory.getLogger(this.getClass());
    @Autowired
    private MenuItemRepository repository;

    @RequestMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public byte[] newHome() throws IOException {
        InputStream in = this.getClass().getResourceAsStream("/static2/new_home.html");
        assert in != null : "resource not found";
        return IOUtils.toByteArray(in);
    }

    @RequestMapping(value = "/admin", produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public byte[] newAdmin() throws IOException {
        InputStream in = this.getClass().getResourceAsStream("/static2/new_home_admin.html");
        assert in != null : "resource not found";
        return IOUtils.toByteArray(in);
    }

    @RequestMapping(value = "/new")
    public String home(ModelMap model) {
        return "redirect:/static2/new_home.html";
    }

    @RequestMapping(value = "/menuitems", method = RequestMethod.GET)
    List<MenuItem> findAll(HttpServletResponse response){
        List<MenuItem> all = repository.findAll();
        List<MenuItem> res = new ArrayList<>();
        if (all.size() == 0)
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);

        for (MenuItem item : all) {
            if (item.getIsRoot()) res.add(item);
        }

        return res;
    }

    @RequestMapping(value = "/menuitems", method = RequestMethod.POST)
    void saveAll(@RequestBody MenuItem[] items) {
        repository.deleteAllInBatch();
        for (MenuItem item: items){
            item.setIsRoot(true);
        }
        logger.info("items length {}", items.length);
        logger.info("items before {}", Arrays.toString(items));
        List<MenuItem> itemsAfter = repository.save(Arrays.asList(items));
        logger.info("items after {}", itemsAfter);

        // repository.save(items);
        // logger.info(items.toString() + items.size());
        // assert items.size() != 0: "repository.count() != 0";
        // assert repository.count() != 0: "repository.count() != 0";
    }

}
