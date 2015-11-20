(function($){
    $.fn.jumboShare = function( options ) {
        var rand = Math.floor((Math.random() * 1000) + 1);
        var settings = $.extend({
            // These are the defaults.
            url:window.location.href,
            text:document.title,
            twitterUsername:"mycodingtricks",
            id: rand,
            total: 0
        }, options );
        // Greenify the collection based on the settings variable.
        this.each(function(){
          var elem = $(this);
          elem.html(init());
          getCount();
        });
        function init(){
         var code = "<div class='mct_jumboShare' id='jumboShare_"+settings.id+"'>"+
            "<div class='mct_jumboShare_container'>"+
               "<div class='mct_jumboShare_counter' id='jumboShare_counter_"+settings.id+"'>"+
                  "0"+
               "</div>"+
               "<div class='mct_jumboShare_buttons' id='jumboShare_buttons_"+settings.id+"'>"+
                "<a target=_blank rel=nofollow href='https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(settings.url)+"&t="+encodeURI(settings.text)+"' class='jumboShare_btn facebook'><sapn class='jumboShare_btn_text'>facebook</span></a>"+
                "<a target=_blank rel=nofollow href='https://twitter.com/intent/tweet?via="+settings.twitterUsername+"&url="+encodeURIComponent(settings.url)+"&text="+encodeURI(settings.text)+"' class='jumboShare_btn twitter'><sapn class='jumboShare_btn_text'>Twitter</span></a>"+
                "<a target=_blank rel=nofollow href='https://plus.google.com/share?url="+encodeURIComponent(settings.url)+"' class='jumboShare_btn google'><sapn class='jumboShare_btn_text'>Google+</span></a>"+
                "<a target=_blank rel=nofollow href='https://www.linkedin.com/cws/share?token&isFramed=false&url="+encodeURIComponent(settings.url)+"' class='jumboShare_btn linkedin'><sapn class='jumboShare_btn_text'>LinkedIn</span></a>"+
            "</div>"+
          "</div>";
          return code;
        }
        function convertNumber(n){
            if(n>=1000000000) return (n/1000000000).toFixed(1)+'G';
            if(n>=1000000) return (n/1000000).toFixed(1)+'M';
            if(n>=1000) return (n/1000).toFixed(1)+'K';
            return n;
        }
        function add(n){
            settings.total = settings.total+n;
        }
        function updateCounter(){
          $("#jumboShare_counter_"+settings.id).html(convertNumber(settings.total)+"<div>SHARES</div>").fadeIn();
        }
        function getCount(){
            var $this = this;
            $.getJSON('http://cdn.api.twitter.com/1/urls/count.json?url='+settings.url+'&callback=?',function(d){
                add(d.count);
                updateCounter();
            });
            $.getJSON('https://api.facebook.com/method/fql.query?format=json&query=SELECT+total_count+FROM+link_stat+WHERE+url+%3D+%27'+encodeURIComponent(settings.url)+'%27&callback=?',function(d){
                add(d[0].total_count);
                updateCounter();
            });
            $.getJSON("https://www.linkedin.com/countserv/count/share?url="+settings.url+"&format=jsonp&callback=?", function(data) {
                add(data.count);
                updateCounter();
            });
            var GooglePlusdata = {
                "method":"pos.plusones.get",
                "id":settings.url,
                "params":{
                    "nolog":true,
                    "id":settings.url,
                    "source":"widget",
                    "userId":"@viewer",
                    "groupId":"@self"
                },
                "jsonrpc":"2.0",
                "key":"p",
                "apiVersion":"v1"
            };
            $.ajax({
                type: "POST",
                url: "https://clients6.google.com/rpc",
                processData: true,
                contentType: 'application/json',
                cache:true,
                data: JSON.stringify(GooglePlusdata),
                success: function(r){
                    add(r.result.metadata.globalCounts.count);
                    updateCounter();
                }
            });
        }
        return this;
    };
 
}(jQuery));
