package org.firsthash.nikart.models;

import javax.persistence.*;
import java.util.*;

@Entity
public class GalleryModel extends BaseModel {
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "gallery")
    @OrderBy("id DESC")
    private List<ImageModel> images;

    public List<ImageModel> getImages() {
        return images;
    }

    public void setImages(List<ImageModel> images) {
        this.images = images;
    }

}
