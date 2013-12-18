package org.firsthash.nikart.models;

import com.fasterxml.jackson.annotation.*;
import org.firsthash.nikart.repositories.*;
import org.springframework.beans.factory.*;
import org.springframework.http.*;
import org.springframework.web.context.*;

import javax.persistence.*;
import java.util.*;

/**
 * If you got this message: "{@link org.hsqldb.HsqlException}: data exception: string data, right truncation".
 * Follow next steps to get it fixed: 1) specify lob column length 2) delete old database files, so schema will be recreated.
 */
@Entity
public class ImageModel extends BaseModel {
    @ManyToOne
    private GalleryModel gallery;

    /**
     * Don't use {@link javax.persistence.Lob} with <em>hsqldb</em>, otherwise database size will grow exponentially.
     * <p>Field names are directly mapped to database column names.</p>
     */
    @Column(length = 50 * 1024 * 1024) // preferred form for megabytes
    private byte[] bytes;

    @Column(length = 5 * 1024 * 1024)
    private byte[] bytesPreview;

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
        return bytesPreview;
    }

    public void setPreview(byte[] preview) {
        this.bytesPreview = preview;
    }

    @JsonIgnore
    public byte[] getImage() {
        return bytes;
    }

    public void setImage(byte[] image) {
        this.bytes = image;
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
