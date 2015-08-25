package org.yuliskov.artportfolio.controller;

import org.slf4j.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;
import org.yuliskov.artportfolio.repository.*;

import javax.servlet.http.*;
import java.util.*;

@Controller
public class MenuItemController {
    private static final String LANGUAGE = "language";
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    @Autowired
    private MenuItemRepository repository;

    @RequestMapping(value = {"/", "/{language}"})
    public String home(HttpSession session, @PathVariable Map<String, String> pathVariables) {
        if (pathVariables.containsKey(LANGUAGE)) {
            session.setAttribute(LANGUAGE, pathVariables.get(LANGUAGE));
        }
        return "home.html";
    }

    @RequestMapping(value = "/admin")
    public String admin() {
        return "admin.html";
    }

}
