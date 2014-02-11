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
        String[] split = domainName.split("\\.");

        // our needs is third level domain
        if (split.length == 3) {
            String requestPath = request.getRequestURI();
            String subDomainName = split[0];
            String newRequestPath = "/" + subDomainName + requestPath;
            logger.info("Interceptor.preHandle new request path is {}", newRequestPath);
            // route to /{subDomainName}/my/path
            RequestDispatcher dispatcher = request.getRequestDispatcher(newRequestPath);
            dispatcher.forward(request, response);
            return false;
        }

        logger.info("Interceptor.preHandle called on {}", domainName);

        return super.preHandle(request, response, handler);
    }
}
