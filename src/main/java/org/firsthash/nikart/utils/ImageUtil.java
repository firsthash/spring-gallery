package org.firsthash.nikart.utils;

public class ImageUtil {
    public static byte[] createPreview(byte[] bytes, String type) {
        ImageConverter conv = new ImageConverter(bytes, type);
        return conv.convert();
    }
}