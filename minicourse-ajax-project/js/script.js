
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;
    var googleKey = '';
    var nytKey = '';

    $greeting.text('So, you want to live at ' + address + '?');

    var streetviewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '&key=' + googleKey + '';
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');

    // new york times code

    var nytUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q='+ cityStr +'&sort=newest&api-key=' + nytKey + '';
    $.getJSON( nytUrl, function( data ) {
        $nytHeaderElem.text('New York Times Articles About ' + cityStr );

        articles = data.response.docs;
        for( var i = 0; i < articles.length; i++ ) {
            var article = articles[i];
            $nytElem.append(
                '<li class="article">' + 
                '<a href="' + article.web_url + '">' +
                article.headline.main + 
                '</a>' +
                '<p>' + article.snippet + '</p>' + '</li>'
            );
        };
        // console.log( data );
    } ).error( function( e ) {
        $nytHeaderElem.text('New York Times Articles Could not Be Loaded');
    });

    // Wikipedia code
    var wikiUrl = 'http://en.wikipsedia.org/w/api.php?action=opensearch&search=' +   cityStr +
                    '&format=json&callback=wikiCallback';

    var wikiRequestTimeout = setTimeout( function(){
        $wikiElem.text('failed to get wikipedia resources');
    }, 8000 );

    $.ajax({
        url : wikiUrl,
        dataType : "jsonp",
        success : function( response ) {
            var articleList = response[1];

            for( var i = 0; i < articleList.length; i++ ) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append(
                    '<li><a href="' + url + '">' +
                    articleStr + '</a></li>'
                );
            };

            clearTimeout( wikiRequestTimeout );
        }
    });

    return false;
};

$('#form-container').submit(loadData);

// loadData();