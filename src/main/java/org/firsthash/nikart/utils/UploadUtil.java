package org.firsthash.nikart.utils;

import org.springframework.web.multipart.*;

import java.util.*;

public class UploadUtil {
    private static String suffix = "preview";

    public static List<MultipartFile> filterPreviews(MultipartFile[] files) {
        ArrayList<MultipartFile> output = new ArrayList<>();
        for (MultipartFile file : files) {
            String name = file.getOriginalFilename();
            name = removeExtension(name);
            if (name.endsWith(suffix)) {
                output.add(file);
            }
        }
        return output;
    }

    public static List<MultipartFile> filterOriginals(MultipartFile[] files) {
        ArrayList<MultipartFile> output = new ArrayList<>();
        for (MultipartFile file : files) {
            // don't forget: file name contains extension
            String name = file.getOriginalFilename();
            name = removeExtension(name);
            if (!name.endsWith(suffix)) {
                output.add(file);
            }
        }
        return output;
    }

    public static String removeExtension(String name) {
        String[] split = name.split("\\.");
        return split[0];
    }

    public static MultipartFile findPreview(List<MultipartFile> previews, MultipartFile original) {
        MultipartFile ret = null;
        for (MultipartFile preview : previews) {
            // don't forget: file name contains extension
            String previewName = preview.getOriginalFilename();
            previewName = removeSuffix(previewName);
            String originalName = original.getOriginalFilename();
            originalName = removeExtension(originalName);
            if (previewName.equals(originalName)) {
                ret = preview;
                break;
            }
        }
        return ret;
    }

    private static String removeSuffix(String name) {
        String[] split = name.split("_");
        return split[0];
    }
}