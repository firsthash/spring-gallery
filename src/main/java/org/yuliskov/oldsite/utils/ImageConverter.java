package org.yuliskov.oldsite.utils;

import org.slf4j.*;

import javax.imageio.*;
import javax.imageio.metadata.*;
import javax.imageio.stream.*;
import java.awt.*;
import java.awt.image.*;
import java.io.*;
import java.util.*;

import org.imgscalr.*;
import org.yuliskov.oldsite.utils.gif.*;

public class ImageConverter {
    private Logger logger = LoggerFactory.getLogger(getClass());
    private String inType;
    private String outType;
    private byte[] content;
    private int framesToRemain = 10;

    public ImageConverter(byte[] content) {
        this(content, "image/jpeg", "image/jpeg");
    }

    public ImageConverter(byte[] content, String inType) {
        this(content, inType, inType);
    }

    public ImageConverter(byte[] content, String inType, String outType) {
        this.content = content;
        this.inType = extractTypeName(inType);
        this.outType = extractTypeName(outType);
    }

    public byte[] convert() {
        if (!canHandle()) {
            logger.warn("can't handle image type of {}", inType);
            return null;
        }
        return convertInternal();
    }

    private String extractTypeName(String inType) {
        String[] split = inType.split("/");
        String res;
        if (split.length == 2) {
            res = split[1];
        } else {
            res = inType;
        }
        return res;
    }

    private boolean canHandle() {
        String[] types = ImageIO.getReaderMIMETypes();
        Collection<String> typesList = Arrays.asList(types);
        String mime = String.format("image/%s", inType);
        return typesList.contains(mime);
    }

    private byte[] convertInternal() {
        byte[] ret;
        if (inType.equals("gif")) {
            logger.info("processing gif image");
            ret = resizeAnimated();
        } else {
            logger.info("processing jpeg image");
            ret = resizeRegular();
        }
        return ret;
    }

    private byte[] resizeAnimated() {
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        GifDecoder decoder = new GifDecoder();
        decoder.read(new ByteArrayInputStream(content));
        float frameCount = decoder.getFrameCount();
        // without round frame counting isn't precise
        int framesToSkip = Math.round(frameCount/framesToRemain); // remain 2 frame
        if (framesToSkip == 0) {
            framesToSkip = 1;
        }
        AnimatedGifEncoder encoder = new AnimatedGifEncoder();
        encoder.start(os);
        int delay = decoder.getDelay(0);  // display duration of frame in milliseconds
        encoder.setDelay(delay * framesToSkip);   // preserve original duration
        encoder.setRepeat(0); // repeat forever
        for (int i = 0; i < frameCount; i++) {
            if (i % framesToSkip != 0) continue; // every ten frame
            BufferedImage frame = decoder.getFrame(i);  // frame i
            // decrease size of frame
            frame = createThumbnail(frame);
            // compose new gif
            encoder.addFrame(frame);
        }
        encoder.finish();
        return os.toByteArray();
    }

    private byte[] resizeAnimatedAlternate() throws IOException {
        ImageReader ir = ImageIO.getImageReadersByFormatName("gif").next();
        ImageInputStream iis;
        iis = ImageIO.createImageInputStream(new ByteArrayInputStream(content));
        ir.setInput(iis, false);

        ImageWriter iw = ImageIO.getImageWritersByFormatName("gif").next();
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        ImageOutputStream ios;
        ios = ImageIO.createImageOutputStream(os);
        iw.setOutput(ios);

        iw.prepareWriteSequence(null);

        // process images

        int noi = ir.getNumImages(true);
        for (int i = 0; i < noi; i++) {
            BufferedImage image = ir.read(i);
            image = createThumbnail(image);
            assert image.getHeight() > 10: "image.getHeight() > 10";
            ImageWriteParam iwp = iw.getDefaultWriteParam();
            IIOMetadata metadata = iw.getDefaultImageMetadata(
                    new ImageTypeSpecifier(image), iwp);
            IIOImage ii = new IIOImage(image, null, metadata);
            iw.writeToSequence(ii, null);
        }

        iw.endWriteSequence();
        ios.flush(); // stream flush mandatory

        byte[] ret = os.toByteArray();
        assert ret.length > 10: "ret.length > 10";
        return ret;
    }

    private byte[] resizeRegular() {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        InputStream in = new ByteArrayInputStream(content);

        logger.info("Supported input image types are {}", Arrays.toString(ImageIO.getReaderMIMETypes()));
        logger.info("Supported output image types are {}", Arrays.toString(ImageIO.getWriterMIMETypes()));

        try {
            BufferedImage image = ImageIO.read(in);
            BufferedImage newImage = createThumbnail(image);
            ImageIO.write(newImage, outType, out);
        } catch (IOException e) {
            logger.error("exception occurred {}", e);
        }
        return out.toByteArray();
    }

    private BufferedImage createThumbnailAlternate(BufferedImage img) {
        // create quickly, then smooth and brighten it
        img = Scalr.resize(img, Scalr.Method.SPEED, Scalr.Mode.FIT_TO_WIDTH,
                100, 100, Scalr.OP_ANTIALIAS);

        // add a little border before we return result
        return Scalr.pad(img, 4);
    }

    private BufferedImage createThumbnail(BufferedImage image) {
        BufferedImage croppedImage = smartCrop(image);
        BufferedImage resizedImage = resize(croppedImage, 100, 100);
        return resizedImage;
    }

    private BufferedImage smartCrop(BufferedImage image) {
        int size, x, y;
        int width = image.getWidth();
        int height = image.getHeight();
        if (width > height) {
            size = height;
            y = 0;
            x = (width - size) / 2;
        } else {
            size = width;
            x = 0;
            y = (height - size) / 2;
        }
        return crop(image, x, y, size, size);
    }

    private BufferedImage crop(BufferedImage src, int x, int y, int width, int height) {
        BufferedImage dest = src.getSubimage(x, y, width, height);
        return dest;
    }

    private BufferedImage resize(BufferedImage img, int newW, int newH) {
        int w = img.getWidth();
        int h = img.getHeight();
        BufferedImage dimg = new BufferedImage(newW, newH, img.getType());
        Graphics2D g = dimg.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g.drawImage(img, 0, 0, newW, newH, 0, 0, w, h, null);
        g.dispose();
        return dimg;
    }
}
