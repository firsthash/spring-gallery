<!doctype html>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html lang="en">
<head>
    <title>Admin Panel: Mykyta Lys'kov Personal Site</title>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
    <meta name="description" content=""/>
    <meta name="author" content=""/>

    <%@include file="include/styles.jsp" %>
</head>

<body>
    <%@include file="include/common.jsp" %>

    <script type="text/template" id="upload-template">

        <div class="row">

            <iframe name="submit-iframe" style="display:none"></iframe>

            <form action="/upload_images" method="POST" enctype="multipart/form-data" target="submit-iframe">

                <input type="hidden" name="id" value="<<= id >>"/>
                <input type="hidden" name="index" value="0"/>

                <input class="upload-hidden" id="imageUpload<<= id >>" onchange="$(this).closest('form').submit()" type="file"
                       class="input-file"
                       style="display:block;height:0;width:0" name="file" multiple=""/>

                <div class="btn-group">
                    <button class="btn btn-primary upload-btn">Add Images</button>
                    <button class="btn btn-primary delete-btn">Delete Gallery</button>
                    <button class="btn btn-primary add-btn">Add Gallery</button>
                    <div class="btn btn-primary up-btn">Move Up</div>
                </div>

            </form>

        </div>

    </script>

    <script type="text/template" id="change-background-template">

        <div id="changeBackgroundForm" class="row">

            <iframe name="submit-iframe" style="display:none"></iframe>

            <form action="/form" method="POST" enctype="multipart/form-data" target="submit-iframe">

                <input type="hidden" name="id" value="<<= id >>"/>

                <input class="upload-hidden input-file" onchange="$(this).closest('form').submit()" type="file"
                       style="display:block;height:0;width:0" name="file" multiple=""/>

            </form>

        </div>

    </script>

    <script>
        require(['/static/js/common.js'], function(common) {
            var module = 'app/admin';

            require([module], function(module) {
                new module.AppView({
                    collection: module.galleryModelCollection,
                    SectionView: module.SectionView,
                    ContactsView: module.ContactsView,
                    GalleryModelView: module.GalleryModelView,
                    imageModelCollection: module.imageModelCollection,
                    GalleryModel: module.GalleryModel, // used inside other methods
                    CarouselItemView: module.CarouselItemView,
                    ImageModelView: module.ImageModelView
                });
            });
        });
    </script>


</body>
</html>