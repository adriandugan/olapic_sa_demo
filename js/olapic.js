$(document).ready(function() {

    var base_url = 'https://photorankapi-a.akamaihd.net';
    var token = '0a40a13fd9d531110b4d6515ef0d6c529acdb59e81194132356a1b8903790c18'; // Olapic demo account
    var version = 'v2.2';

    var auth_url = base_url+'?auth_token='+token+'&version='+version;

    var gallery_settings = []; // Contains the gallery items

    /* Fetch the first page (20 items) of media. */ 
    function fetchMedia(media) {
        var media_url = media._links.self.href;
        $.ajax(media_url, {
            success: function(resp) {
                $("#olapic_gallery").html("");
                $.each(resp.data._embedded.media, renderMedia); 
                // Now create the gallery/carusel
                addLightGallery(gallery_settings);
            },
            error: function() {
                $("#olapic_gallery").html("error fetching media");
            }
        });
    };

    /* Generate a single piece of media. */
    function renderMedia(i, resp) {
        var item = new Object();
        item.src = resp.images.original;
        item.thumb = resp.images.thumbnail;
        item.subHtml = resp.caption;
        item.downloadUrl = false;
        gallery_settings.push(item);
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
                $("#olapic_gallery").html("error with authentication"); 
            }
        });
    };

    function addLightGallery(settings) {
        $('#lightgallery').lightGallery({
            dynamic: true,
            dynamicEl: settings,
            loop: true,
            fourceAutoply: false,
            autoplay: true,
            thumbnail: true,
            pager: $(window).width() >= 768 ? true : false,
            speed: 400,
            scale: 1,
            keypress: true
        });
    };

    function run() {
        // auth, then fetch media and display media
        auth(auth_url, fetchMedia);
    };

    run();

});
