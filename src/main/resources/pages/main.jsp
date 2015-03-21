<!doctype html>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
<%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html lang="en">
<head>
    <title>Mykyta Lys'kov Personal Site</title>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/>
    <meta name="description" content=""/>
    <meta name="author" content=""/>

    <%@include file="include/styles.jsp" %>
</head>

<body>


    <%@include file="include/common.jsp" %>


    <script>
        require(['/static/js/common.js'], function(common) {
            var module = 'app/main';

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