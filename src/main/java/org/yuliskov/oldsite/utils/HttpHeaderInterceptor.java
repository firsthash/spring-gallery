package org.yuliskov.oldsite.utils;

import org.springframework.web.servlet.handler.*;

import javax.servlet.http.*;

import org.springframework.web.servlet.ModelAndView;

public class HttpHeaderInterceptor extends HandlerInterceptorAdapter {
    @Override
    public void postHandle(HttpServletRequest request,
                HttpServletResponse response,
                Object handler,
                ModelAndView modelAndView)
         throws Exception {
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Expires", "0");
    }
}
