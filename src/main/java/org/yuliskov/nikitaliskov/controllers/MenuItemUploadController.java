package org.yuliskov.nikitaliskov.controllers;

import org.slf4j.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.*;
import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.*;
import org.yuliskov.nikitaliskov.models.*;
import org.yuliskov.nikitaliskov.repositories.*;

import java.io.*;
import java.nio.file.*;

@Controller
public class MenuItemUploadController {
    private Logger logger = LoggerFactory.getLogger(this.getClass());
    @Autowired
    private UploadedImageRepository repository;

    @RequestMapping(value = "/menuitems__", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(value = HttpStatus.OK)
    public void uploadToDatabase(@RequestParam("id") long id, @RequestParam("upload") MultipartFile file) throws IOException {
        // save file to resources/static/upload directory
        InputStream inputStream = file.getInputStream();
        byte[] bytes = file.getBytes();
        UploadedImage uploadedImage = new UploadedImage();
        uploadedImage.setBytes(bytes);
        uploadedImage.setName(file.getOriginalFilename());
        uploadedImage.setParentId(id);
        repository.save(uploadedImage);
    }

    @RequestMapping(value = "/menuitemupload", method = RequestMethod.POST, produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public String uploadToFilesystem(@RequestParam("upload") MultipartFile file) throws IOException {
        String basedir = "uploads";
        String filename = file.getOriginalFilename().replaceAll(" |#", "_");
        Path uploadPath = Paths.get(System.getProperty("user.home"), basedir, filename);
        logger.info("upload path is: {}", uploadPath);

        File uploadFile = uploadPath.toFile();
        uploadFile.getParentFile().mkdirs();
        file.transferTo(uploadFile);
        //OutputStream outputStream = new BufferedOutputStream(new FileOutputStream(uploadFile));
        //byte[] buf = new byte[1024];
        //InputStream inputStream = file.getInputStream();
        //while (inputStream.read(buf) != -1){
        //    outputStream.write(buf);
        //}

        // absolute path with slashes
        return String.format("/%s/%s", basedir, filename);
    }

    @RequestMapping(value = "/uploadcleanup", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public void uploadCleanup(@RequestBody String path) throws IOException {
        if (path.isEmpty())
            return;
        Path abspath = Paths.get(System.getProperty("user.home"), path);
        logger.info("deleting file {}", abspath);
        Files.deleteIfExists(abspath);
    }

}