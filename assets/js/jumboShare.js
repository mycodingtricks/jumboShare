(function($){
    $.fn.jumboShare = function( options ) {
        var rand = Math.floor((Math.random() * 1000) + 1);
        var settings = $.extend({
            // These are the defaults.
            url:window.location.href,
            text:document.title,
            twitterUsername:"mycodingtricks",
            id: rand,
            total: 0,
            position: 'prepend' //append|prepend
        }, options );
        // Greenify the collection based on the settings variable.
        this.each(function(){
          var elem = $(this);
          switch(settings.position){
              case 'append':
                  elem.append(init());
                  break;
              default: 
                  elem.prepend(init());
                  break;
          }
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
            unescape("%3C%61%20%68%72%65%66%3D%27%68%74%74%70%3A%2F%2F%6D%79%63%6F%64%69%6E%67%74%72%69%63%6B%73%2E%63%6F%6D%27%20%63%6C%61%73%73%3D%27%6A%75%6D%62%6F%53%68%61%72%65%5F%6D%63%74%27%20%74%61%72%67%65%74%3D%27%5F%62%6C%61%6E%6B%27%20%74%69%74%6C%65%3D%27%47%65%74%20%54%68%69%73%20%4A%75%6D%62%6F%53%68%61%72%65%20%66%6F%72%20%79%6F%75%72%20%57%65%62%73%69%74%65%27%3E%4D%3C%2F%61%3E")+
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
