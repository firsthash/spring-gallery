package org.firsthash.nikart.repositories;

import org.firsthash.nikart.models.*;

import java.util.*;

/**
 * Control all entities through this interface.
 */
public interface NikArtService {
    ImageModel findOneImage(Long id);

    GalleryModel findOneGallery(Long id);

    List<ImageModel> findAllImages();

    List<GalleryModel> findAllGalleries();

    void deleteImage(ImageModel image);

    void deleteGallery(GalleryModel gallery);

    void saveGallery(GalleryModel gallery);

    void saveImage(ImageModel image);

    void deleteImage(Long id);
    void updateOneImage(ImageModel image);
    void updateOneGallery(GalleryModel gallery);
}
