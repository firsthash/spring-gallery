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

    <!-- bootstrap -->
    <link href="/static/vendor/bootstrap/css/bootstrap.css" rel="stylesheet"/>
    <link href="/static/vendor/bootstrap/css/bootstrap-responsive.css" rel="stylesheet"/>

    <%-- head --%>

    <!-- Le styles -->

    <!-- IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
    <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!-- Le fav and touch icons -->
    <link rel="shortcut icon" href="/static/custom/img/favicon.ico">

    <!-- this belongs to me -->
    <link href="/static/custom/css/main.css" rel="stylesheet">

    <link href="/static/custom/css/thumbnails.css" rel="stylesheet">

    <link href="/static/custom/css/modal.css" rel="stylesheet">

    <%-- end head --%>
</head>

<body>

<div id="container" class="container">
    <%-- content --%>

    <div id="modal" class="modal hide fade modal-template" tabindex="-1">
        <div id="carousel" class="carousel slide">
            <div class="carousel-inner">
                <!-- NOTE: 'active' class mandatory -->
                <div class="item active">
                    <div class="embed"><img src="" alt=""/></div>
                </div>
            </div>
            <a class="left carousel-control" href="#carousel" data-slide="prev">&lsaquo;</a>
            <a class="right carousel-control" href="#carousel" data-slide="next">&rsaquo;</a>
        </div>
    </div>

    <!-- Header
    ================================================== -->
    <h3 id="header" contentEditable="true">
        <%-- do not place anything here so old content will not popup --%>
    </h3>

    <div>
        <h5>
            <ul class="nav nav-pills" id="contacts">

            </ul>
        </h5>
    </div>

    <c:if test="${admin}">
        <div class="row btn-group">
            <button id="addGallery" class="btn btn-primary">
                Add Gallery
            </button>
        </div>
    </c:if>


    <!-- Thumbnails
    ================================================== -->
    <div id="galleries">
    </div>


    <!-- Footer
    ================================================== -->
    <div id="footer">

    </div>

    <!-- Backbone Templates -->

    <script type="text/template" id="carousel-item-template">
        {% if (embed == "") { %}
        <div style="min-height: 10em">
            <img data-src="{%= prefix %}{%= file %}" alt=""/>
            <img style="position: absolute; left: 45%; top: 5em; width: 4em" class="placeholder" src="/static/custom/img/loading.gif"/>
        </div>
        {% } else { %}
        {%= embed %}
        {% } %}
    </script>

    <%-- TODO: bind template to element or use backbone initializers --%>
    <%-- and remove template creation from init method of gallery --%>
    <script type="text/template" id="gallery-header-template">
        <h4 contentEditable="true">Some of My Animation Experiments</h4>
    </script>


    <%-- TODO: bind template to element or use backbone initializers --%>
    <script type="text/template" id="header-template">
        <h3 contentEditable="true">
            {%= header %}
        </h3>
    </script>

    <%-- TODO: bind template to element or use backbone initializers --%>
    <script type="text/template" id="footer-template">
        <p contentEditable="true">All rights reserved, mostly &copy;</p>
    </script>

    <%-- TODO: bind template to element or use backbone initializers --%>
    <script type="text/template" id="contacts-template">
        <li>
            <a contentEditable="true" href="https://www.facebook.com/nikita.liskov" target="_blank">Facebook</a>
        </li>
        <li>
            <a contentEditable="true" href="http://vk.com/id138248950" target="_blank">Vkontakte</a>
        </li>
        <li>
            <a contentEditable="true" href="http://www.youtube.com/user/Nikitaliskov" target="_blank">Youtube</a>
        </li>
        <li>
            <a contentEditable="true" href="http://nikita-liskov.livejournal.com/" target="_blank">LiveJournal</a>
        </li>
        <li>
            <a contentEditable="true" href="mailto:nikitaliskov@gmail.com" target="_blank">GMail</a>
        </li>
    </script>

    <script type="text/template" id="item-template">
        <%-- NOTE: name collision: 'embed' function and json var --%>
        <a id="{%= name %}" class="thumbnail" href="{%= prefix %}{%= file %}" title="{%= name %}"
           data-header="{%= header %}" data-embed="{%- embed %}"><img
                src="{%= prefix %}{%= _thumbnail %}" alt=""></a>
    </script>

    <script type="text/template" id="container-template">
        <div id="{%= name %}{%= id %}" class="row-fluid">
            <div class="header">
                {%= header %}
            </div>

            <ul class="thumbnails" data-toggle="modal-gallery" data-target="#modal-gallery" data-size="span2">
            </ul>
        </div>

        <div id="{%= name %}{%= id %}Modal" class="modal hide fade modal-template" tabindex="-1">
            <div id="{%= name %}{%= id %}Carousel" class="carousel slide">
                <div class="carousel-inner"></div>
                <a class="left carousel-control" href="#{%= name %}{%= id %}Carousel" data-slide="prev">&lsaquo;</a>
                <a class="right carousel-control" href="#{%= name %}{%= id %}Carousel" data-slide="next">&rsaquo;</a>
            </div>
        </div>
    </script>


    <%-- admin --%>
    <c:if test="${admin}">
        <script type="text/template" id="upload-template">

            <div class="row">

                <iframe name="submit-iframe" style="display:none"></iframe>

                <form action="/upload_images" method="POST" enctype="multipart/form-data" target="submit-iframe">

                    <input type="hidden" name="id" value="{%= id %}"/>

                    <input class="upload-hidden" id="imageUpload{%= id %}" onchange="$(this).closest('form').submit()" type="file"
                           class="input-file"
                           style="display:block;height:0;width:0" name="file" multiple=""/>

                    <div class="btn-group">
                        <button class="btn btn-primary upload-btn">Add Images</button>
                        <button class="btn btn-primary delete-btn">Delete Gallery</button>
                    </div>

                </form>

            </div>

        </script>

        <script type="text/template" id="change-background-template">

            <div id="changeBackgroundForm" class="row">

                <iframe name="submit-iframe" style="display:none"></iframe>

                <form action="/form" method="POST" enctype="multipart/form-data" target="submit-iframe">

                    <input type="hidden" name="id" value="{%= id %}"/>

                    <input class="upload-hidden" onchange="$(this).closest('form').submit()" type="file"
                           class="input-file"
                           style="display:block;height:0;width:0" name="file" multiple=""/>

                </form>

            </div>

        </script>
    </c:if>
    <%-- end admin --%>

    <!-- End Backbone Templates -->

    <%-- end content --%>
</div>

<!-- jquery -->
<script src="/static/vendor/jquery.min.js"></script>
<script src="/static/vendor/jquery.cookie.js"></script>
<script src="/static/vendor/jquery.backstretch.min.js"></script>

<!-- bootstrap -->
<script src="/static/vendor/bootstrap/js/bootstrap.js"></script>

<%-- js --%>


<!-- Placed at the end of the document so the pages load faster -->
<script src="/static/vendor/backbone/underscore-min.js"></script>
<script src="/static/vendor/backbone/backbone-min.js"></script>

<script src="/static/custom/js/main.js"></script>

<%-- admin --%>
<c:if test="${admin}">
    <!-- jquery-ui core -->

    <script src="/static/vendor/jquery.ui/jquery.ui.core.min.js"></script>

    <script src="/static/vendor/jquery.ui/jquery.ui.widget.min.js"></script>

    <script src="/static/vendor/jquery.ui/jquery.ui.mouse.min.js"></script>


    <!-- jquery-ui sortable -->

    <script src="/static/vendor/jquery.ui/jquery.ui.sortable.min.js"></script>


    <script src="/static/vendor/jquery.iframe-transport.js"></script>


    <!-- admin interface -->

    <script src="/static/custom/js/admin.js"></script>
</c:if>

<%-- end admin --%>

<%-- end js --%>
</body>
</html>