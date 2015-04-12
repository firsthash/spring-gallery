package org.yuliskov.nikart.repositories;

import org.springframework.beans.factory.annotation.*;
import org.springframework.stereotype.*;
import org.yuliskov.nikart.models.*;

import java.util.*;

@Service
public class NikArtServiceImpl implements NikArtService {
    @Autowired
    private GalleryRepository galleryRepository;
    @Autowired
    private ImageRepository imageRepository;

    @Override
    public ImageModel findOneImage(Long id) {
        return imageRepository.findOne(id);
    }

    @Override
    public GalleryModel findOneGallery(Long id) {
        return galleryRepository.findOne(id);
    }

    @Override
    public List<ImageModel> findAllImages() {
        return imageRepository.findAll();
    }

    @Override
    public List<GalleryModel> findAllGalleries() {
        return galleryRepository.findAll();
    }

    @Override
    public void deleteImage(ImageModel image) {
        imageRepository.delete(image);
    }

    @Override
    public void deleteGallery(GalleryModel gallery) {
        galleryRepository.delete(gallery);
    }

    @Override
    public void saveGallery(GalleryModel gallery) {
        galleryRepository.save(gallery);
    }

    @Override
    public void saveImage(ImageModel image) {
        imageRepository.save(image);
    }

    @Override
    public void deleteImage(Long id) {
        imageRepository.delete(id);
    }

    @Override
    public void updateOneImage(ImageModel newImage) {
        ImageModel image = findOneImage(newImage.getId());
        if (image == null) {
            image = new ImageModel();
        }
        image.setIndex(newImage.getIndex());
        image.setEmbedCode(newImage.getEmbedCode());
        saveImage(image);
    }

    @Override
    public void updateOneGallery(GalleryModel newGallery) {
        GalleryModel gallery = findOneGallery(newGallery.getId());
        if (gallery == null) {
            gallery = new GalleryModel();
        }
        gallery.setHeader(newGallery.getHeader());
        gallery.setIndex(newGallery.getIndex());
        saveGallery(gallery);
    }
}
