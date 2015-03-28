package org.firsthash.nikart.utils;

import org.slf4j.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.web.servlet.handler.*;
import org.springframework.web.servlet.mvc.method.*;
import org.springframework.web.servlet.mvc.method.annotation.*;

import javax.servlet.*;
import javax.servlet.http.*;
import java.util.*;

public class HttpHeaderInterceptor extends HandlerInterceptorAdapter {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Expires", "0");
        return super.preHandle(request, response, handler);
    }
}