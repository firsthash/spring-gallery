package org.yuliskov.oldsite.utils;

import org.slf4j.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.web.servlet.handler.*;
import org.springframework.web.servlet.mvc.method.*;
import org.springframework.web.servlet.mvc.method.annotation.*;

import javax.servlet.*;
import javax.servlet.http.*;
import java.util.*;

public class DomainNameInterceptor extends HandlerInterceptorAdapter {
    @Autowired
    private RequestMappingHandlerMapping requestMappingHandlerMapping; // or DefaultAnnotationHandlerMapping

    private Logger logger = LoggerFactory.getLogger(this.getClass());
    private Set<String> handlerSet;

    private void initHandlerMap() {
        // does mapping with 'domainNamePrefix' exist?
        // if there no mapping, do default processing
        Set<RequestMappingInfo> handlers = requestMappingHandlerMapping.getHandlerMethods().keySet();

        handlerSet = new HashSet<>();
        for (RequestMappingInfo info : handlers) {
            handlerSet.add(info.getPatternsCondition().toString());
        }
        logger.info("Mapping output: {}", handlerSet);
    }

    /**
     * Treat domain name part as additional path component <br/>
     * Ex.: event.name.com ==> name.com/event <br/>
     * Note: method does nothing if domain starts with 'www'
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        //        if (handlerSet == null) {
        //            initHandlerMap();
        //        }

        String domainName = request.getHeader("Host");
        String domainPrefix = findDomainPrefix(domainName);

        if (domainPrefix.equals("www") || domainPrefix.equals("")) {
            // normal behaviour
            return super.preHandle(request, response, handler);
        }

        // treat 'www' as it there absent prefix
        String requestPath = request.getRequestURI();  // uri doesn't includes domain name
        String newRequestPath = domainPrefix + requestPath; // construct new path /{domainNamePrefix}/my/path
        logger.info("Interceptor.preHandle new request path is {}", newRequestPath);
        // route
        RequestDispatcher dispatcher = request.getRequestDispatcher(newRequestPath);
        dispatcher.forward(request, response);
        return false;
    }

    private enum DomainPartType {
        Suffix, Middle, Prefix
    }

    public static String findDomainPrefix(String domainName) {
        String[] domainParts = domainName.split("\\.");
        if (domainParts.length == 2) {
            return "";
        }

        DomainPartType lastDomainPart = null;
        for (int i = (domainParts.length - 1); i >= 0; i--) {
            if (lastDomainPart == null) {
                lastDomainPart = DomainPartType.Suffix;
                continue;
            }
            String domainPart = domainParts[i];
            switch (lastDomainPart) {
                case Suffix:
                    if (domainPart.length() > 3) {
                        lastDomainPart = DomainPartType.Middle;
                    } else {
                        lastDomainPart = DomainPartType.Suffix;
                    }
                    continue;
                case Middle:
                    if (i == 0) {
                        lastDomainPart = DomainPartType.Prefix;
                    } else {
                        lastDomainPart = DomainPartType.Middle;
                    }
            }
        }

        if (lastDomainPart == DomainPartType.Prefix) {
            return domainParts[0];
        } else {
            return "";
        }
    }
}
