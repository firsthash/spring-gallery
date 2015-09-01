package org.yuliskov.artportfolio.controller;

import org.slf4j.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;
import org.springframework.util.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.*;
import org.springframework.web.servlet.*;
import org.springframework.web.servlet.support.*;
import org.yuliskov.artportfolio.repository.*;

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

    @RequestMapping(value = "/", params = "locale")
    public String homeSwitchLocale(@RequestParam String locale) {
        switchLanguage(locale);
        return "redirect:/";
    }

    @RequestMapping(value = "/admin")
    public String admin() {
        return "admin.html";
    }

    @RequestMapping(value = "/admin", params = "locale")
    public String adminSwitchLocale(@RequestParam(required = false) String locale) {
        switchLanguage(locale);
        return "redirect:/admin";
    }

    public void switchLanguage(@RequestParam String locale) {
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        LocaleResolver localeResolver = RequestContextUtils.getLocaleResolver(attr.getRequest());
        localeResolver.setLocale(attr.getRequest(), attr.getResponse(), StringUtils.parseLocaleString(locale));
    }

    //@RequestMapping(value = "/", params = "locale")
    //public String switchLanguage(HttpServletRequest request, HttpServletResponse response, @RequestParam String locale) {
    //    LocaleResolver localeResolver = RequestContextUtils.getLocaleResolver(request);
    //    localeResolver.setLocale(request, response, StringUtils.parseLocaleString(locale));
    //    return "redirect:/";
    //}

}
