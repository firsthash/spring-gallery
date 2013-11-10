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

// example of rest query: http://localhost:8080/crud/GalleryModel

@Controller
@RequestMapping(value = "/crud")
public class CrudController {
    @Autowired
    private NikArtService nikArtService;
    @Autowired
    private Logger logger;

    @RequestMapping(value = "AutoImageModel/{id}", produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET)
    @ResponseBody
    public ImageModel testGetImageModel(@PathVariable Long id) {
        ImageModel image = nikArtService.findOneImage(id);
        return image;
    }

    @RequestMapping(value = "GalleryModel/{id}", method = RequestMethod.GET)
    @ResponseBody
    public String getGalleryModel(@PathVariable Long id) throws JSONException {
        JSONArray jsonArray = new JSONArray();

        GalleryModel model = nikArtService.findOneGallery(id);
        JSONObject jsonObject = galleryToJson(model);
        jsonArray.put(jsonObject);

        String ret = jsonArray.toString();
        logger.info("returning one of GalleryModel with id " + id);
        logger.info(ret);
        return ret;
    }

    @RequestMapping(value = "GalleryModel", method = RequestMethod.GET)
    @ResponseBody
    public String getGalleryModel() throws JSONException {
        JSONArray jsonArray = new JSONArray();

        List<GalleryModel> all = nikArtService.findAllGalleries();
        for (GalleryModel model : all) {
            JSONObject jsonObject = galleryToJson(model);
            jsonArray.put(jsonObject);
        }

        String ret = jsonArray.toString();
        logger.info("returning array of GalleryModel");
        logger.info(ret);
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

        return galleryToJson(gallery).toString();
    }

    @RequestMapping(value = "ImageModel", method = RequestMethod.GET)
    @ResponseBody
    public String getImageModel() throws JSONException {
        JSONArray jsonArray = new JSONArray();


        List<ImageModel> allImages = nikArtService.findAllImages();
        for (ImageModel model : allImages) {
            JSONObject jsonObject = imageToJson(model);
            jsonArray.put(jsonObject);
        }

        String ret = jsonArray.toString();
        logger.info("returning array of ImageModel");
        logger.info(ret);
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

        // FIXME: handle situation gallery not exist...
        if (gallery == null) {
            logger.info("Gallery not exist: " + request);
            gallery = new GalleryModel();
        }
        String header = json.getString("header");
        String name = json.getString("name");
        gallery.setHeader(header);
        gallery.setName(name);

        // transaction implicitly saves changes
        // without it you must do save explicitly
        nikArtService.saveGallery(gallery);
    }

    @RequestMapping(value = "ImageModel/{id}", method = RequestMethod.DELETE)
    @ResponseStatus(HttpStatus.OK)
    public void deleteImageModel(@PathVariable Long id) throws JSONException {
        logger.info("deleting ImageModel...");
        nikArtService.deleteImage(id);
    }

    // TODO: improve object to json conversion
    private JSONObject imageToJson(ImageModel model) throws JSONException {
        JSONObject jsonObject = baseToJson(model);

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

    /**
     * Converts model's image to data uri format.
     */
    private String toDataURI(ImageModel model) {
        MediaType type = model.getPreviewType();
        byte[] content = model.getPreview();
        String res = String.format("data:%s;base64,%s", type.toString(), DatatypeConverter.printBase64Binary(content));
        return res;
    }

    private JSONObject galleryToJson(GalleryModel model) throws JSONException {
        JSONObject jsonObject = baseToJson(model);
        return jsonObject;
    }

    private JSONObject baseToJson(BaseModel model) throws JSONException {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("id", model.getId());
        jsonObject.put("name", model.getName());
        jsonObject.put("header", model.getHeader());
        jsonObject.put("index", model.getIndex());
        return jsonObject;
    }
}