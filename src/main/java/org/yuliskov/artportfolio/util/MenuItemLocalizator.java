package org.yuliskov.artportfolio.util;

import org.springframework.util.*;
import org.springframework.web.context.request.*;
import org.springframework.web.servlet.*;
import org.springframework.web.servlet.support.*;
import org.yuliskov.artportfolio.model.*;

import javax.servlet.http.*;
import java.util.*;

public class MenuItemLocalizator {
    private static final String LANGUAGE = "language";
    private static MenuItemLocalizator instanse;
    private static final String RUSSIAN = "ru";
    private static final String ENGLISH = "en";

    public static MenuItemLocalizator getInstanse() {
        return instanse == null ? instanse = new MenuItemLocalizator() : instanse;
    }

    public List<MenuItem> localize(List<MenuItem> items) {
        String currentLanguage = getCurrentLanguage();

        for (MenuItem item : items) {
            pullTitle(item, currentLanguage);
            pullDescription(item, currentLanguage);
            if (item.getChildren() != null) {
                localize(item.getChildren());
            }
        }
        return items;
    }

    private void pullDescription(MenuItem item, String language) {
        switch (language) {
            case RUSSIAN:
                item.setDescription(item.getDescriptionRu());
                break;
            case ENGLISH:
                item.setDescription(item.getDescriptionEn());
                break;
        }
    }

    private void pullTitle(MenuItem item, String language) {
        switch (language) {
            case RUSSIAN:
                item.setTitle(item.getTitleRu());
                break;
            case ENGLISH:
                item.setTitle(item.getTitleEn());
                break;
        }
    }

    private void pushDescription(MenuItem item, String language) {
        switch (language) {
            case RUSSIAN:
                item.setDescriptionRu(item.getDescription());
                break;
            case ENGLISH:
                item.setDescriptionEn(item.getDescription());
                break;
        }
    }

    private void pushTitle(MenuItem item, String language) {
        switch (language) {
            case RUSSIAN:
                item.setTitleRu(item.getTitle());
                break;
            case ENGLISH:
                item.setTitleEn(item.getTitle());
                break;
        }
    }

    public Iterable<MenuItem> delocalize(List<MenuItem> items) {
        String currentLocale = getCurrentLanguage();

        for (MenuItem item : items) {
            pushTitle(item, currentLocale);
            pushDescription(item, currentLocale);
            if (item.getChildren() != null) {
                delocalize(item.getChildren());
            }
        }
        return items;
    }

    private String getCurrentLanguage() {
        //Object language = retrieveSession().getAttribute(LANGUAGE);
        //return language == null ? RUSSIAN : (String) language;

        LocaleResolver localeResolver = RequestContextUtils.getLocaleResolver(retrieveRequest());
        return localeResolver.resolveLocale(retrieveRequest()).getLanguage();
    }

    private HttpSession retrieveSession() {
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        return attr.getRequest().getSession(true); // true == allow create
    }

    private HttpServletRequest retrieveRequest() {
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        return attr.getRequest();
    }
}
