package org.firsthash.nikart.controllers;

import org.slf4j.*;
import org.firsthash.nikart.models.*;
import org.firsthash.nikart.repositories.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;
import org.springframework.transaction.annotation.*;
import org.springframework.ui.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Controller
public class MainController {
    @Autowired
    private NikArtService nikArtService;
    @Autowired
    private Logger logger;

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String getHomePage(ModelMap model) {
        logger.info("main page requested");
        model.addAttribute("admin", false);
        logger.debug("class path is: {}", System.getProperty("java.class.path"));
        return "main";
    }

    @RequestMapping(value = "/admin", method = RequestMethod.GET)
    public String getAdminPage(ModelMap model) {
        model.addAttribute("admin", true);
        logger.info("admin page requested");
        return "main";
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
}