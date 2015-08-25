package org.yuliskov.artportfolio.controller;

import org.slf4j.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;
import org.springframework.util.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.*;
import org.springframework.web.servlet.support.*;
import org.yuliskov.artportfolio.repository.*;

import javax.servlet.http.*;
import java.util.*;

@Controller
public class MenuItemController {
    private static final String LANGUAGE = "language";
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    @Autowired
    private MenuItemRepository repository;

    @RequestMapping(value = "/")
    public String home() {
        return "home.html";
    }

    @RequestMapping(value = "/{language}")
    public String switchLanguage(HttpServletRequest request, HttpServletResponse response, @PathVariable String language) {
        //session.setAttribute(LANGUAGE, language);
        LocaleResolver localeResolver = RequestContextUtils.getLocaleResolver(request);
        localeResolver.setLocale(request, response, StringUtils.parseLocaleString(language));
        return "redirect:/";
    }

    @RequestMapping(value = "/admin")
    public String admin() {
        return "admin.html";
    }

}
