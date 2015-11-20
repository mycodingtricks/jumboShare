(function ( $ ) {
    $.fn.jumboShare = function( options ) {
        var rand = Math.floor((Math.random() * 1000) + 1);
        var settings = $.extend({
            // These are the defaults.
            url:window.location.href,
            id: rand,
            total: 0
        }, options );
        // Greenify the collection based on the settings variable.
        this.each(function(){
          init();
        });
        function init(){
         var code = "<div class='mct_jumboShare' id='jumboShare_"+settings.rand+"'>"+
            "<div class='mct_jumboShare_container'>"+
               "<div class='mct_jumboShare_counter' id='jumboShare_counter_"+settings.rand+"'>"+
                  "0"+
               "</div>"+
            "</div>"+
          "</div>";
          $(this).html(code);
          getCount();
        }
        function convertNumber(n){
            if(n>=1000000000) return (n/1000000000).toFixed(1)+'G';
            if(n>=1000000) return (n/1000000).toFixed(1)+'M';
            if(n>=1000) return (n/1000).toFixed(1)+'K';
            return n;
        }
        this.updateCounter = function(){
          $("jumboShare_counter_"+settings.rand).text(convertNumber(settings.total)).fadeIn();
        }
        function getCount(){
            var $this = this;
            $.getJSON('http://cdn.api.twitter.com/1/urls/count.json?url='+settings.url+'&callback=?',function(d){
                settings.total += d.count;
                $this.updateCounter();
            });
            $.getJSON('https://api.facebook.com/method/fql.query?format=json&query=SELECT+total_count+FROM+link_stat+WHERE+url+%3D+%27'+encodeURIComponent(settings.url)+'%27&callback=?',function(d){
                settings.total = d[0].total_count;
                $this.updateCounter();
            });
            $.getJSON("https://www.linkedin.com/countserv/count/share?url="+settings.url+"&format=jsonp&callback=?", function(data) {
                settings.total = data.count;
                $this.updateCounter();
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
                    settings.total = r.result.metadata.globalCounts.count;
                    $this.updateCounter();
                }
            });
        }
        return this;
    };
 
}( jQuery ));
