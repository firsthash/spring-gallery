package org.yuliskov.nikart.utils;

import org.springframework.web.multipart.*;

import java.util.*;

public class UploadedFileUtil {
    private static String suffix = "preview";

    public static List<MultipartFile> filterByName(MultipartFile[] files, String include, String exclude) {
        ArrayList<MultipartFile> output = new ArrayList<>();
        for (MultipartFile file : files) {
            String name = file.getOriginalFilename();
            name = removeExtension(name);
            if (name.endsWith(include) && !name.endsWith(exclude)) {
                output.add(file);
            }
        }
        return output;
    }

    public static List<MultipartFile> filterByName(MultipartFile[] files) {
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

    public static List<MultipartFile> filterByNameInverted(MultipartFile[] files) {
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

    public static MultipartFile findFile(List<MultipartFile> list, MultipartFile original) {
        MultipartFile ret = null;
        for (MultipartFile preview : list) {
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
