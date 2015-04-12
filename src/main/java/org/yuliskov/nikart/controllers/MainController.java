package org.yuliskov.nikart.controllers;

import org.apache.commons.io.*;
import org.slf4j.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.*;
import org.springframework.stereotype.*;
import org.springframework.transaction.annotation.*;
import org.springframework.ui.*;
import org.springframework.web.bind.annotation.*;
import org.yuliskov.nikart.models.*;
import org.yuliskov.nikart.repositories.*;

import java.io.*;
import java.util.*;

@Controller
@RequestMapping(method = RequestMethod.GET)
public class MainController {
    @Autowired
    private NikArtService nikArtService;
    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @RequestMapping(value = "/old")
    public String getHomePage(ModelMap model) {
        logger.info("main page requested");
        model.addAttribute("admin", false);   // tmp
        return "main";
    }

    @RequestMapping(value = "/admin")
    public String getAdminPage(ModelMap model) {
        model.addAttribute("admin", true);
        logger.info("admin page requested");  // tmp
        return "admin";
    }

    @Transactional
    @RequestMapping(value = "/images")
    public String getAllImagesPage(Model model) {
        Iterable<GalleryModel> galleries = nikArtService.findAllGalleries();
        Collection<ImageModel> images = new ArrayList<>();
        // create plain list of images
        for (GalleryModel gallery : galleries) {
            images.addAll(gallery.getImages());
        }
        model.addAttribute("images", images);
        return "images";
    }

    // route subdomain requests e.g. http://sub.domain.com, see DomainNameInterceptor.java
    @RequestMapping(value = "/event", produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public byte[] getEventPage() throws IOException {
        // internally using RedirectView
        //return "redirect:/static/event.html";
        InputStream in = this.getClass().getResourceAsStream("/static/event.html");
        assert in != null : "in != null";
        return IOUtils.toByteArray(in);
    }
}