package org.firsthash.nikart.controllers;

import org.firsthash.nikart.models.*;
import org.firsthash.nikart.repositories.*;
import org.json.*;
import org.slf4j.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.*;
import org.springframework.stereotype.*;
import org.springframework.transaction.annotation.*;
import org.springframework.web.bind.annotation.*;

import javax.xml.bind.*;
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
    @Autowired
    private Logger logger;

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
    public List<GalleryModel> getAllGalleryModels() throws JSONException {
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

        assert gallery.getId() != 0: "gallery.getId() != 0";

        return gallery;
    }

    @RequestMapping(value = "ImageModel", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<ImageModel> getAllImageModels() throws JSONException {
        List<ImageModel> ret = nikArtService.findAllImages();
        logger.info("returning array of ImageModel");
        logger.info(ret.toString());
        return ret;
    }

    //@RequestMapping(value = "ImageModel/{id}", method = RequestMethod.PUT)
    //@ResponseStatus(HttpStatus.OK)
    //public void updateImageModel(@PathVariable Long id, @RequestBody String request) throws JSONException {
    //    logger.info("Updating model {}", request);
    //    JSONObject json = new JSONObject(request);
    //
    //    int index = json.getInt("index");
    //    String embed = json.getString("embed");
    //
    //    ImageModel image = nikArtService.findOneImage(id);
    //
    //
    //    // TODO: copy all props automatically
    //    image.setIndex(index);
    //    image.setEmbedCode(embed);
    //
    //    logger.info("updating image {}", image);
    //
    //    nikArtService.saveImage(image);
    //}

    @RequestMapping(value = "ImageModel/*", method = RequestMethod.PUT, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.OK)
    public void updateImageModel(@RequestBody ImageModel image) {
        logger.info("updating image {}", image);
        nikArtService.updateOneImage(image);
    }

    //@RequestMapping(value = "GalleryModel/{id}", method = RequestMethod.PUT, consumes = "application/json")
    //@ResponseStatus(HttpStatus.OK)
    //public void updateGalleryModel(@PathVariable Long id, @RequestBody String request) throws JSONException {
    //    logger.info("Updating model {}", request);
    //
    //    JSONObject json = new JSONObject(request);
    //    GalleryModel gallery = nikArtService.findOneGallery(id);
    //
    //    if (gallery == null) {
    //        logger.info("Gallery not exist: " + request);
    //        gallery = new GalleryModel();
    //    }
    //
    //    String header = json.getString("header");
    //    String name = json.getString("name");
    //    gallery.setHeader(header);
    //    gallery.setName(name);
    //
    //    // transaction implicitly saves changes
    //    // without it you must do it yourself
    //    nikArtService.saveGallery(gallery);
    //}

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

    /**
     * Converts model's image to data uri (inline src) format.
     */
    private String toDataUri(ImageModel model) {
        MediaType type = model.getPreviewType();
        byte[] content = model.getPreview();
        String res = String.format("data:%s;base64,%s", type.toString(), DatatypeConverter.printBase64Binary(content));
        return res;
    }
}