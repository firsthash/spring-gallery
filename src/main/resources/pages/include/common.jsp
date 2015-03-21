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

    <div id="galleries">
    </div>


    <div id="footer">
    </div>

    <!-- Backbone Templates -->

    <script type="text/template" id="carousel-item-template">
        << if (embed == "") { >>
        <div style="min-height: 10em">
            <img src="" data-src="<<= file >>" alt=""/>
            <img style="position: absolute; left: 45%; top: 5em; width: 5em" class="placeholder" src="/static/img/loading.gif"/>
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
        <img class="placeholder" src="/static/img/blank.gif"/>
        <a id="<<= name >>" href="<<= file >>" class="thumbnail" title="<<= name >>"
           data-header="<<= header >>" data-embed="<<- embed >>"><img
                src="<<= _thumbnail >>" alt=""></a>
    </script>

    <script type="text/template" id="container-template">
        <img style="position: absolute; left: 45%; top: 15em; width: 10%; z-index: 1000" class="placeholder" src="/static/img/loading.gif"/>
        <div id="<<= name >><<= id >>" class="row">
            <div class="header">
                <<= header >>
            </div>



            <div class="carousel slide embed-carousel" data-ride="carousel">
                <div class="carousel-inner">
                    <ul class="thumbnails item active">
                    </ul>
                </div>
            </div>
        </div>

        <div id="<<= name >><<= id >>Modal" class="modal fade modal-template" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div id="<<= name >><<= id >>Carousel" class="carousel slide popup-carousel" data-ride="carousel">
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


    <!-- End Backbone Templates -->

    <%-- end content --%>
</div>

<script src="/static/js/lib/require.js"></script>