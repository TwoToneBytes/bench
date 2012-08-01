var drib = {
   host: 'http://api.dribbble.com',
   popular: '/shots/popular',
   player: '/players/',

   getPopular: function(){
      var url = drib.host + drib.popular;
      this.req(url, function(data){
         console.log(data);
         popularShots.buildShots(data.shots);
      });
   },
   getFollowing: function(playerId) {
      var url = drib.host + drib.player + playerId + '/shots/following';
      this.req(url, function(data) {
         console.log(data);
         getFollowingShots.buildList(data.shots);
      });
   },
   req: function(url, cb) {
      $.ajax({
            url: url,
            dataType: 'jsonp',
            timeout: 2000,
            success: function(data) {  
               console.log('did the thing');
               cb(data); 
            },
            error: function(x, t, m) {
               if(t==="timeout") {
                   console.log('timeout error');
                   popularShots.buildShots(data.shots);
               } else {
                   console.log('else timeout error');
                   popularShots.buildShots(data.shots);
               }
            }
         }
    
   }

var popularShots = {
   container:$('#picsList'),
   buildShots: function(shots) {
      var imgs = '';
      for(var i=0; i<6; i++) {
         console.log(shots[i]);
         imgs += '<li class="animate fadeInUp" style="-webkit-animation-delay: '+ i*150 +'ms;">'+
            '    <div class="user">'+
            '        <img src="'+ shots[i].player.avatar_url +'" />'+
            '        <span class="name">'+ shots[i].player.name +'</span>'+
            '    </div>'+    
            '    <div class="highlight">'+
            '        <img class="shot" src="'+ shots[i].image_url +'"/>'+
            '        <a href="'+shots[i].short_url+'"></a>'+ 
            '    </div>'+    
            '</li>';
      }
      this.container.html(imgs);
   }
}

var getFollowingShots = {
   buildList: function(shots) {
      this.container = $('#picsList');
      var imgs = '';
      for(var i=0; i<6; i++){
         console.log(shots[i]);
         imgs += '<li class="animate fadeInUp" style="-webkit-animation-delay: '+ i*150 +'ms;">'+
            '    <div class="user">'+
            '        <img src="'+ shots[i].player.avatar_url +'" />'+
            '        <span class="name">'+ shots[i].player.name +'</span>'+
            '    </div>'+    
            '    <div class="highlight">'+
            '        <img class="shot" src="'+ shots[i].image_url +'"/>'+
            '        <a href="'+shots[i].short_url+'"></a>'+ 
            '    </div>'+    
            '</li>';
      }
      this.container.html(imgs);
   }
}

var user = $('#lookup-player');
var ui = {
   init: function(){
      var userName = window.localStorage.getItem('user');
      if (userName !== null && userName !== '') {
         user.val(userName);
         console.log('getFollowing');
         drib.getFollowing(userName);
      } else {
         drib.getPopular();
      }

      user.blur(function(){
         var val = $(this).val();
         if (val == '') {
            drib.getPopular();
            return;
         }

         window.localStorage.setItem('user', $(this).val());
         drib.getFollowing($(this).val());
      });
   }
}

$(function() {
   console.log('initialize');
   //drib.getPopular();
   ui.init();
   
   $('ul#picsList').on("mouseenter", "li", function(){
            $(this).find('.highlight').children().addClass('reveal');
   });

   $('ul#picsList').on("mouseleave", "li", function(){
            $(this).find('.highlight').children().removeClass('reveal');
   });
   
});