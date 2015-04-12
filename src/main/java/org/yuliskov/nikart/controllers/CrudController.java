package org.yuliskov.nikart.controllers;

import org.json.*;
import org.slf4j.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.*;
import org.springframework.stereotype.*;
import org.springframework.transaction.annotation.*;
import org.springframework.web.bind.annotation.*;
import org.yuliskov.nikart.models.*;
import org.yuliskov.nikart.repositories.*;

import java.util.*;

/**
 * <p>This controller contains only REST methods starting with 'crud'</p>
 * <p>example of rest query: http://localhost:8080/crud/GalleryModel</p>
 */
@Controller
@RequestMapping(value = "/crud")
public class CrudController {
    @Autowired
    private NikArtService nikArtService;

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @RequestMapping(value = "testImageModel", produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET)
    @ResponseBody
    public List<ImageModel> testImageModel() {
        List<ImageModel> image = nikArtService.findAllImages();
        return image;
    }

    @RequestMapping(value = "testGalleryModel", produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET)
    @ResponseBody
    public List<GalleryModel> testGalleryModel() {
        List<GalleryModel> image = nikArtService.findAllGalleries();
        return image;
    }

    @RequestMapping(value = "GalleryModel/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public GalleryModel getOneGalleryModel(@PathVariable Long id) throws JSONException {
        GalleryModel model = nikArtService.findOneGallery(id);
        logger.info("returning one GalleryModel with id " + id);
        logger.info(model.toString());
        return model;
    }

    @RequestMapping(value = "GalleryModel", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<GalleryModel> getAllGalleryModels() throws JSONException, InterruptedException {
        //Thread.sleep(5000);

        List<GalleryModel> ret = nikArtService.findAllGalleries();
        logger.info("returning array of GalleryModel");
        logger.info(ret.toString());
        return ret;
    }

    @Transactional
    @RequestMapping(value = "GalleryModel/{id}", method = RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.OK)
    public void deleteOneGalleryModel(@PathVariable Long id) {
        GalleryModel gallery = nikArtService.findOneGallery(id);
        for (ImageModel image : gallery.getImages()) {
            nikArtService.deleteImage(image);
        }
        nikArtService.deleteGallery(gallery);
    }

    @RequestMapping(value = "GalleryModel", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public GalleryModel createGalleryModel(@RequestBody GalleryModel gallery) {
        logger.info("createGalleryModel()");

        nikArtService.saveGallery(gallery);

        assert gallery.getId() != 0 : "gallery.getId() != 0";

        return gallery;
    }

    @RequestMapping(value = "ImageModel", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<ImageModel> getAllImageModels() throws JSONException, InterruptedException {
        //Thread.sleep(10000);

        long startTime = System.nanoTime();

        List<ImageModel> ret = nikArtService.findAllImages();
        logger.info("returning array of ImageModel");
        logger.info(ret.toString());

        long endTime = System.nanoTime();
        logger.info("all image models have been loaded in {} nanoseconds", endTime - startTime);

        return ret;
    }

    @RequestMapping(value = "ImageModel/*", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    public void updateImageModel(@RequestBody ImageModel image) {
        logger.info("updating image {}", image);
        nikArtService.updateOneImage(image);
    }

    @RequestMapping(value = "GalleryModel/*", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    public void updateGalleryModel(@RequestBody GalleryModel gallery) {
        logger.info("updating gallery {}", gallery);
        nikArtService.updateOneGallery(gallery);
    }

    @RequestMapping(value = "ImageModel/{id}", method = RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.OK)
    public void deleteImageModel(@PathVariable Long id) throws JSONException {
        logger.info("deleting ImageModel...");
        nikArtService.deleteImage(id);
    }

}