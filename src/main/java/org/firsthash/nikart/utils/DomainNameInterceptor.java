package org.firsthash.nikart.utils;

import org.slf4j.*;
import org.springframework.web.servlet.handler.*;

import javax.servlet.*;
import javax.servlet.http.*;

public class DomainNameInterceptor extends HandlerInterceptorAdapter {
    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String domainName = request.getHeader("Host");
        String[] domainNameParts = domainName.split("\\.");
        logger.info("Interceptor.preHandle called on {}", domainName);

        // we need third level domain
        if (domainNameParts.length == 3) {
            String domainNamePrefix = domainNameParts[0];
            // treat 'www' as absent prefix
            if (!domainNamePrefix.equals("www")) {
                String requestPath = request.getRequestURI();
                String newRequestPath = domainNamePrefix + requestPath;
                logger.info("Interceptor.preHandle new request path is {}", newRequestPath);
                // route to /{domainNamePrefix}/my/path
                RequestDispatcher dispatcher = request.getRequestDispatcher(newRequestPath);
                dispatcher.forward(request, response);
                return false;
            }
        }

        return super.preHandle(request, response, handler);
    }
}
