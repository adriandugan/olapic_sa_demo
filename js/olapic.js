$(document).ready(function() {

    var base_url = 'https://photorankapi-a.akamaihd.net';
    var token = '0a40a13fd9d531110b4d6515ef0d6c529acdb59e81194132356a1b8903790c18'; // Olapic demo account
    var version = 'v2.2';

    var auth_url = base_url+'?auth_token='+token+'&version='+version;

    /* Fetch the first page (20 items) of media. */ 
    function fetchMedia(media) {
        var media_url = media._links.self.href;
        $.ajax(media_url, {
            success: function(resp) {
                $("#olapic_gallery").html('');
                $.each(resp.data._embedded.media, renderMedia); 
            },
            error: function() {
                $('.page-loading').remove();
                $("#olapic_gallery").html("error fetching media");
            },
            complete: function(resp) {
                if (resp.status===200) { // success
                    $('.page-loading').remove();
                    // Now create the gallery/carusel
                    addLightGallery();
                }
            }
        });
    };

    /* Generate a single piece of media. */
    function renderMedia(i, resp) {
        $("#olapic_gallery").append('<a class="' + (i>5 ? 'hide' : '') + '" data-sub-html="'+resp.caption+'" data-download-url=false href="'+resp.images.original+'"><img src="'+resp.images.thumbnail+'" /></a>');
    };

    /*
     * Auth. Call to ensure the account is still active,
     * and to get the media endpoint. Means Olapic can
     * change it without breaking all customers. :)
     */
    function auth(auth_url, callBack) {
        $.ajax(auth_url, {
            success: function(resp) {
                callBack(resp.data._embedded.customer._embedded.media);
            },
            error: function() {
                $('.page-loading').remove();
                $("#olapic_gallery").html("error with authentication"); 
            }
        });
    };

    /* fire up the lightGallery carousel. */
    function addLightGallery(settings) {
        $("#olapic_gallery").lightGallery({
            thumbnail: true,
            animateThumb: true,
            thumbMargin: 10,
            thumbWidth: 100,
            thumbContHeight: 100,
            autoplay: true,
            loop: true,
            speed: 400
        });

        /* Change the lightbox background colour. */
        var colours = ['#21171A', '#81575E', '#9C5043', '#8F655D'];
        $('#olapic_gallery').on('onBeforeSlide.lg', function(event, prevIndex, index){
            $('.lg-outer').css('background-color', colours[Math.floor(Math.random() * 4)])
        });
    };

    function fire() {
        // auth, then fetch media and display media
        auth(auth_url, fetchMedia);
    };

    /* Let's kick it off. */
    fire();

});
