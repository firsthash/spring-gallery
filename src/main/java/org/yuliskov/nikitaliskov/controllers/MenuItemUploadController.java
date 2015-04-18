package org.yuliskov.nikitaliskov.controllers;

import org.slf4j.*;
import org.springframework.beans.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.context.*;
import org.springframework.http.*;
import org.springframework.stereotype.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.*;
import org.yuliskov.nikitaliskov.models.*;
import org.yuliskov.nikitaliskov.repositories.*;

import java.io.*;
import java.nio.file.*;

@Controller
public class MenuItemUploadController implements ApplicationContextAware {
    private Logger logger = LoggerFactory.getLogger(this.getClass());
    @Autowired
    private UploadedImageRepository repository;
    // private String rootDir = Paths.get(System.getProperty("user.home"), "app-root", "data").toString();
    private String rootDir = "";

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        assert applicationContext instanceof ConfigurableApplicationContext : "applicationContext instanceof ConfigurableApplicationContext";
        ConfigurableApplicationContext configurableApplicationContext = (ConfigurableApplicationContext) applicationContext;
        rootDir = configurableApplicationContext.getBeanFactory().resolveEmbeddedValue("${user.data}");
        assert rootDir != null : "rootDir != null";
    }

    @RequestMapping(value = "/menuitems__", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(value = HttpStatus.OK)
    public void uploadToDatabase(@RequestParam("id") long id, @RequestParam("upload") MultipartFile file) throws IOException {
        // save file to resources/static/upload directory
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
        String filename = file.getOriginalFilename().replaceAll(" |#", "_"); // forbidden chars in url world
        Path uploadPath = Paths.get(rootDir, basedir, filename);
        logger.info("upload path is: {}", uploadPath);

        File uploadFile = uploadPath.toFile();
        uploadFile.getParentFile().mkdirs();
        file.transferTo(uploadFile);

        // absolute url with slashes
        return String.format("/%s/%s", basedir, filename);
    }

    @RequestMapping(value = "/uploadcleanup", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.OK)
    public void uploadCleanup(@RequestBody String path) throws IOException {
        if (path.isEmpty())
            return;
        Path abspath = Paths.get(rootDir, path);
        logger.info("deleting file {}", abspath);
        Files.deleteIfExists(abspath);
    }
}