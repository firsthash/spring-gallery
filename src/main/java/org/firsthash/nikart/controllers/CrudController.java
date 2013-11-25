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

    @RequestMapping(value = "GalleryModel/{id}", method = RequestMethod.GET)
    @ResponseBody
    public String getGalleryModelAsJson(@PathVariable Long id) throws JSONException {
        JSONArray jsonArray = new JSONArray();

        GalleryModel model = nikArtService.findOneGallery(id);
        JSONObject jsonObject = toJson(model);
        jsonArray.put(jsonObject);

        String ret = jsonArray.toString();
        logger.info("returning one of GalleryModel with id " + id);
        logger.info(ret);
        return ret;
    }

    //@RequestMapping(value = "GalleryModel", method = RequestMethod.GET)
    //@ResponseBody
    //public String getAllGalleryModels() throws JSONException {
    //    JSONArray jsonArray = new JSONArray();
    //
    //    List<GalleryModel> all = nikArtService.findAllGalleries();
    //    for (GalleryModel model : all) {
    //        JSONObject jsonObject = toJson(model);
    //        jsonArray.put(jsonObject);
    //    }
    //
    //    String ret = jsonArray.toString();
    //    logger.info("returning array of GalleryModel");
    //    logger.info(ret);
    //    return ret;
    //}

    @RequestMapping(value = "GalleryModel", method = RequestMethod.GET, produces = "application/json")
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
    public void deleteGalleryModel(@PathVariable Long id) throws JSONException {
        GalleryModel gallery = nikArtService.findOneGallery(id);
        for (ImageModel image : gallery.getImages()) {
            nikArtService.deleteImage(image);
        }
        nikArtService.deleteGallery(gallery);
    }

    @RequestMapping(value = "GalleryModel", method = RequestMethod.POST)
    @ResponseBody
    public String createGalleryModel(@RequestBody String request) throws JSONException {
        logger.info("createGalleryModel()");

        JSONObject json = new JSONObject(request);

        GalleryModel gallery = new GalleryModel();

        // TODO: auto initialize all fields
        String name = json.has("name") ? json.getString("name") : gallery.getName();
        String header = json.has("header") ? json.getString("header") : gallery.getHeader();
        gallery.setName(name);
        gallery.setHeader(header);

        nikArtService.saveGallery(gallery);

        return toJson(gallery).toString();
    }

    //@RequestMapping(value = "ImageModel", method = RequestMethod.GET)
    //@ResponseBody
    //public String getAllImageModels() throws JSONException {
    //    JSONArray jsonArray = new JSONArray();
    //
    //    List<ImageModel> allImages = nikArtService.findAllImages();
    //    for (ImageModel model : allImages) {
    //        JSONObject jsonObject = toJson(model);
    //        jsonArray.put(jsonObject);
    //    }
    //
    //    String ret = jsonArray.toString();
    //    logger.info("returning array of ImageModel");
    //    logger.info(ret);
    //    return ret;
    //}

    @RequestMapping(value = "ImageModel", method = RequestMethod.GET, produces = "application/json")
    @ResponseBody
    public List<ImageModel> getAllImageModels() throws JSONException {
        List<ImageModel> ret = nikArtService.findAllImages();
        logger.info("returning array of ImageModel");
        logger.info(ret.toString());
        return ret;
    }

    @RequestMapping(value = "ImageModel/{id}", method = RequestMethod.PUT, consumes = "application/json")
    @ResponseStatus(HttpStatus.OK)
    public void updateImageModel(@PathVariable Long id, @RequestBody String request) throws JSONException {
        logger.info("Updating model {}", request);
        JSONObject json = new JSONObject(request);

        int index = json.getInt("index");
        String embed = json.getString("embed");

        ImageModel image = nikArtService.findOneImage(id);


        // TODO: copy all props automatically
        image.setIndex(index);
        image.setEmbedCode(embed);

        logger.info("updated ImageModel: id {}, index {}, embed code {}", id, index, embed);

        nikArtService.saveImage(image);
    }

    @RequestMapping(value = "GalleryModel/{id}", method = RequestMethod.PUT, consumes = "application/json")
    @ResponseStatus(HttpStatus.OK)
    public void updateGalleryModel(@PathVariable Long id, @RequestBody String request) throws JSONException {
        logger.info("Updating model {}", request);

        JSONObject json = new JSONObject(request);
        GalleryModel gallery = nikArtService.findOneGallery(id);

        if (gallery == null) {
            logger.info("Gallery not exist: " + request);
            gallery = new GalleryModel();
        }

        String header = json.getString("header");
        String name = json.getString("name");
        gallery.setHeader(header);
        gallery.setName(name);

        // transaction implicitly saves changes
        // without it you must do it yourself
        nikArtService.saveGallery(gallery);
    }

    @RequestMapping(value = "ImageModel/{id}", method = RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.OK)
    public void deleteImageModel(@PathVariable Long id) throws JSONException {
        logger.info("deleting ImageModel...");
        nikArtService.deleteImage(id);
    }

    // TODO: improve object to json conversion
    private JSONObject toJson(ImageModel model) throws JSONException {
        JSONObject jsonObject = toJsonGeneric(model);

        Long galleryId = 0L;
        GalleryModel gallery = model.getGallery();
        // cause of this behaviour in unknown
        if (gallery != null) {
            galleryId = gallery.getId();
        }
        jsonObject.put("gallery_id", galleryId);
        jsonObject.put("file", "image/" + model.getId());

        //jsonObject.put("_thumbnail", toDataURI(model));

        jsonObject.put("_thumbnail", "image_preview/" + model.getId());

        jsonObject.put("embed", model.getEmbedCode());

        logger.info("imageToJson" + jsonObject);
        return jsonObject;
    }

    private JSONObject toJson(GalleryModel model) throws JSONException {
        JSONObject jsonObject = toJsonGeneric(model);
        return jsonObject;
    }

    private JSONObject toJsonGeneric(BaseModel model) throws JSONException {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("id", model.getId());
        jsonObject.put("name", model.getName());
        jsonObject.put("header", model.getHeader());
        jsonObject.put("index", model.getIndex());
        return jsonObject;
    }

    /**
     * Converts model's image to data uri (inline) format.
     */
    private String toDataUri(ImageModel model) {
        MediaType type = model.getPreviewType();
        byte[] content = model.getPreview();
        String res = String.format("data:%s;base64,%s", type.toString(), DatatypeConverter.printBase64Binary(content));
        return res;
    }
}