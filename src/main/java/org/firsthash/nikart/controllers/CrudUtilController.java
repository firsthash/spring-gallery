package org.firsthash.nikart.controllers;

import org.slf4j.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.*;
import org.springframework.stereotype.*;
import org.springframework.transaction.annotation.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.*;
import org.firsthash.nikart.models.*;
import org.firsthash.nikart.repositories.*;
import org.firsthash.nikart.utils.*;

import java.io.*;
import java.util.*;

@Controller
public class CrudUtilController {
    private Logger logger = LoggerFactory.getLogger(this.getClass());
    @Autowired
    private NikArtService nikArtService;

    @Transactional
    @RequestMapping(value = "/upload_images", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public void uploadImages(@RequestParam("id") Long galleryId, @RequestParam("index") int index, @RequestParam("file") MultipartFile[] files) throws IOException {
        logger.info("upload image(s) to gallery with id {}", galleryId);
        logger.info("galleryId = {}", galleryId);
        GalleryModel gallery = nikArtService.findOneGallery(galleryId);
        List<ImageModel> images = gallery.getImages();

        // split incoming files to image and preview
        List<MultipartFile> previews = UploadUtil.filterPreviews(files);
        List<MultipartFile> originals = UploadUtil.filterOriginals(files);

        logger.info("new upload begins from index {}", index);

        //int index = getStartIndex(images);
        for (MultipartFile file : originals) {
            ImageModel image = new ImageModel();

            byte[] bytes = file.getBytes();
            String contentType = file.getContentType();

            image.setImage(bytes);

            logger.info("Type of image is  {}", contentType);

            MultipartFile preview = UploadUtil.findPreview(previews, file);

            if (preview == null) {
                // preview, resize image size
                image.setPreview(ImageUtil.createPreview(bytes, contentType));
            } else {
                image.setPreview(preview.getBytes());
            }

            // running on Google App Engine invocation of 'getOriginalFilename' returns garbage
            String name = file.getOriginalFilename();
            image.setName(UploadUtil.removeExtension(name));
            image.setGallery(gallery);
            image.setIndex(index++);
            images.add(image);

            logger.info("New image added: {}", image.getId());
        }
    }

    private int getStartIndex(List<ImageModel> images) {
        int index = 0;
        for (BaseModel model : images) {
            int tmpIndex = model.getIndex();
            // handle case when there only one model
            if (tmpIndex >= index) {
                index = tmpIndex;
                index++;
            }
        }
        return index;
    }

    /**
     * Images (binary fields) are reason of big slowdowns.
     */
    @Transactional
    @RequestMapping(value = "/image/{id}", method = RequestMethod.GET)
    public ResponseEntity<byte[]> serveImage(@PathVariable("id") long id) {
        ImageModel image = nikArtService.findOneImage(id);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(image.getImageType());
        byte[] bytes = image.getImage();
        ResponseEntity<byte[]> responseEntity = new ResponseEntity<>(bytes, httpHeaders, HttpStatus.CREATED);
        return responseEntity;
    }

    @Transactional
    @RequestMapping(value = "/image_preview/{id}", method = RequestMethod.GET)
    public ResponseEntity<byte[]> servePreview(@PathVariable("id") long id) {
        ImageModel image = nikArtService.findOneImage(id);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(image.getPreviewType());
        byte[] bytes = image.getPreview();
        ResponseEntity<byte[]> responseEntity = new ResponseEntity<>(bytes, httpHeaders, HttpStatus.CREATED);
        return responseEntity;
    }
}