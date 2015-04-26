package org.yuliskov.artportfolio.controllers;

import org.slf4j.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;
import org.yuliskov.artportfolio.repositories.*;

@Controller
public class MenuItemController {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    @Autowired
    private MenuItemRepository repository;

    @RequestMapping(value = "/")
    public String home() {
        return "home.html";
    }

    @RequestMapping(value = "/admin")
    public String admin() {
        return "admin.html";
    }

}
