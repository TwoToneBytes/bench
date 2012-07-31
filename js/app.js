var drib = {
   host: 'http://api.dribbble.com',
   popular: '/shots/popular',
   player: '/player',

   getPopular: function(){
      var url = drib.host + drib.popular + '?callback=foo';
      this.req(url, function(data){
         console.log(data);
         popularShots.buildShots(data.shots);
      });
   },
   getFollowing: function() {
      var url = drib.host + drib.popular + '?callback=foo';
   },
   req: function(url, cb) {
      $.ajax({
         url: url,
         dataType: 'jsonp'
      }).done(function(data){
         cb(data);
      });
   }
}

var popularShots = {
   container:$('#picsList'),
   buildShots: function(shots) {
      console.log(shots.length);
      for(var i=0; i<6; i++) {
         popularShots.container.append(
            '<li class="animate fadeInUp" style="-webkit-animation-delay: '+ i*150 +'ms;">'+
            '    <div class="user">'+
            '        <img src="'+ shots[i].player.avatar_url +'" />'+
            '        <span class="name">'+ shots[i].player.name +'</span>'+
            '    </div>'+    
            '    <div class="highlight">'+
            '        <img class="shot" src="'+ shots[i].image_url +'"/>'+
            '        <a href="'+shots[i].short_url+'"></a>'+ 
            '    </div>'+    
            '</li>'
         );
      }
   }
}

var getFollowing = {
   container:$('#picsList'),
   buildList: function(shots) {
      
   }
}

$(function() {
   console.log('initialize');
   drib.getPopular();

   $('ul#picsList').on("mouseenter", "li", function(){
            $(this).find('.highlight').children().addClass('reveal');
   });

   $('ul#picsList').on("mouseleave", "li", function(){
            $(this).find('.highlight').children().removeClass('reveal');
   });

/*   
   $('ul#picsList li').hover(function(){
   		$(this).find('.highlight').children().addClass('reveal');
   } ,function(){
  		$(this).find('.highlight').children().removeClass('reveal');
	}); 
*/
   
});