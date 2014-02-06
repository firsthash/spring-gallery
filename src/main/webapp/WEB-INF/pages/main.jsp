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

    <link rel="shortcut icon" href="/static/custom/img/favicon.ico">

    <%@include file="include/styles.jsp" %>
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


        <h3 id="header" contentEditable="true" style="display: none;">
            <%-- Do not place anything here --%>
            <%-- This content will be visible until models are fetched from server --%>
            Home Page of Nikita Liskov
        </h3>


        <h5 id="contacts" style="display: none;">
            <ul class="nav nav-pills">
                <li>
                    <a href="mailto:nikitaliskov@gmail.com" target="_blank" contentEditable="true">GMail</a>
                </li>
                <li>
                    <a href="https://www.facebook.com/nikita.liskov" target="_blank" contentEditable="true">Facebook</a>
                </li>
                <li>
                    <a href="http://www.youtube.com/user/Nikitaliskov/videos" target="_blank" contentEditable="true">YouTube</a>
                </li>
                <li>
                    <a href="http://nikita-liskov.livejournal.com/" target="_blank" contentEditable="true">LiveJournal</a>
                </li>
                <li>
                    <a href="http://vk.com/id138248950" target="_blank" contentEditable="true">Vkontakte</a>
                </li>

                <li>
                    <a target="_blank" href="http://www.behance.net/gallery/Gif-Animation-Uncommercial/11290749" contentEditable="true">Behance</a>
                </li>
            </ul>
        </h5>


        <c:if test="${admin}">
            <div class="row btn-group">
                <button id="addGallery" class="btn btn-primary">
                    Add Gallery
                </button>
            </div>
        </c:if>


        <div id="galleries">
        </div>


        <div id="footer">
        </div>

        <!-- Backbone Templates -->

        <script type="text/template" id="carousel-item-template">
            << if (embed == "") { >>
            <div style="min-height: 10em">
                <img src="" data-src="<<= file >>" alt=""/>
                <img style="position: absolute; left: 45%; top: 5em; width: 5em" class="placeholder" src="/static/custom/img/loading.gif"/>
            </div>
            << } else { >>
            <<= embed >>
            << } >>
        </script>

        <%-- TODO: bind template to element or use backbone initializers --%>
        <%-- So remove template creation from init method of view --%>
        <script type="text/template" id="gallery-header-template">
            <h4 contentEditable="true">Some of My Animation Experiments</h4>
        </script>


        <script type="text/template" id="header-template">
            <h3 contentEditable="true">
                <<= header >>
            </h3>
        </script>

        <%-- TODO: bind template to element or use backbone initializers --%>
        <script type="text/template" id="footer-template">
            <p contentEditable="true">All rights reserved, mostly &copy;</p>
        </script>

        <script type="text/template" id="item-template">
        <%-- NOTE: name collision on 'embed' function and json var --%>
        <img class="placeholder" src="/static/custom/img/blank.gif"/>
        <a id="<<= name >>" href="<<= file >>" class="thumbnail" title="<<= name >>"
           data-header="<<= header >>" data-embed="<<- embed >>"><img
                src="<<= _thumbnail >>" alt=""></a>
        </script>

        <script type="text/template" id="container-template">
            <img style="position: absolute; left: 45%; top: 15em; width: 10%; z-index: 1000" class="placeholder" src="/static/custom/img/loading.gif"/>
            <div id="<<= name >><<= id >>" class="row">
                <div class="header">
                    <<= header >>
                </div>

                <ul class="thumbnails">
                </ul>
            </div>

            <div id="<<= name >><<= id >>Modal" class="modal fade modal-template" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div id="<<= name >><<= id >>Carousel" class="carousel slide" data-ride="carousel">
                            <div class="carousel-inner"></div>
                            <a class="left carousel-control" href="#<<= name >><<= id >>Carousel" data-slide="prev">
                                <span class="glyphicon glyphicon-chevron-left"></span>
                            </a>
                            <a class="right carousel-control" href="#<<= name >><<= id >>Carousel" data-slide="next">
                                <span class="glyphicon glyphicon-chevron-right"></span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </script>


        <%-- admin --%>
        <c:if test="${admin}">
            <script type="text/template" id="upload-template">

                <div class="row">

                    <iframe name="submit-iframe" style="display:none"></iframe>

                    <form action="/upload_images" method="POST" enctype="multipart/form-data" target="submit-iframe">

                        <input type="hidden" name="id" value="<<= id >>"/>

                        <input class="upload-hidden" id="imageUpload<<= id >>" onchange="$(this).closest('form').submit()" type="file"
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

                        <input type="hidden" name="id" value="<<= id >>"/>

                        <input class="upload-hidden input-file" onchange="$(this).closest('form').submit()" type="file"
                               style="display:block;height:0;width:0" name="file" multiple=""/>

                    </form>

                </div>

            </script>
        </c:if>
        <%-- end admin --%>

        <!-- End Backbone Templates -->

        <%-- end content --%>
    </div>


    <%@include file="include/scripts.jsp" %>


    <c:if test="${admin}">
        <%@include file="include/admin_scripts.jsp" %>
    </c:if>


</body>
</html>