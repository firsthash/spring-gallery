package org.firsthash.nikart.models;

import com.fasterxml.jackson.annotation.*;
import org.springframework.http.*;

import javax.persistence.*;

/**
 * Problem: {@link org.hsqldb.HsqlException}: 'data exception: string data, right truncation.' <p/>
 * Solution: specify lob column length; delete old database files (or anything to update database schema).
 */
@Entity
public class ImageModel extends BaseModel {
    @ManyToOne
    private GalleryModel gallery;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private BigBytesField image = new BigBytesField();

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private SmallBytesField preview = new SmallBytesField();

    private String embedCode = "";

    @JsonIgnore
    public GalleryModel getGallery() {
        return gallery;
    }

    /**
     * Relationship one to many eq. one gallery has many images.
     * Use {@link #getPreview} method to get thumbnail of image.
     *
     * @param gallery name of gallery
     */
    public void setGallery(GalleryModel gallery) {
        this.gallery = gallery;
    }

    @JsonIgnore
    public byte[] getPreview() {
        return preview.getBytes();
    }

    public void setPreview(byte[] preview) {
        this.preview.setBytes(preview);
    }

    @JsonIgnore
    public byte[] getImage() {
        return image.getBytes();
    }

    public void setImage(byte[] image) {
        this.image.setBytes(image);
    }

    @JsonProperty("embed")
    public String getEmbedCode() {
        return embedCode == null ? "" : embedCode;
    }

    public void setEmbedCode(String embedCode) {
        this.embedCode = embedCode;
    }

    @JsonIgnore
    public MediaType getImageType() {
        // TODO: hardcoded image type
        return MediaType.IMAGE_GIF;
    }

    @JsonIgnore
    public MediaType getPreviewType() {
        // TODO: hardcoded image type
        return MediaType.IMAGE_GIF;
    }

    // properties related to json generation

    @Transient
    @JsonProperty("file")
    public String getImageUrl() {
        return "image/" + getId();
    }

    public void setImageUrl(String file) {
        /* NOP */
    }

    @Transient
    @JsonProperty("_thumbnail")
    public String getPreviewUrl() {
        return "image_preview/" + getId();
    }

    public void setPreviewUrl(String url) {
        /* NOP */
    }

    @Transient
    @JsonProperty("gallery_id")
    public Long getGalleryId() {
        // temporal fix when gallery is not set
        if (getGallery() == null) {
            return null;
        }
        return getGallery().getId();
    }

    public void setGalleryId(Long id) {
        /* NOP */
    }
}
