package org.firsthash.nikart.utils;

public class ImageUtil {
    public static byte[] createPreview(byte[] bytes, String type) {
        ImageConverter converter = new ImageConverter(bytes, type);
        return converter.convert();
    }
}