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
            timeout:   1000,
            success: function(data) {
               console.log('did the thing');
               cb(data);
            },
            error: function(x, t, m) {
               if(t==="timeout") {
                   console.log('timeout error');
                   drib.getPopular();
               } else {
                   console.log('else timeout error');
                   drib.getPopular();
               }
            }
         });
      }
   }    

var popularShots = {
   container:$('#picsList'),
   buildShots: function(shots) {
      var imgs = '';
      for(var i=0; i<6; i++) {
         console.log(shots[i]);
         imgs += '<li class="animate fadeInUp item" style="-webkit-animation-delay: '+ i*150 +'ms;">'+   
            '    <div class="picture">'+
            '        <img class="shot" src="'+ shots[i].image_url +'" style="display:none;"/>'+
            '        <div class="underlay">'+
            '            <a class="i" href="'+ shots[i].player.url +'"><img src="'+ shots[i].player.avatar_url +'" /></a>'+
            '            <span class="name">'+ shots[i].player.name +'</span>'+
            '            <span class="likes">'+ shots[i].likes_count +' Likes</span>'+
            '        </div>'+
            '        <div class="slits">'+
            '           <div>'+
            '               <b></b>'+
            '               <em></em>'+
            '               <img src="'+ shots[i].image_url +'">'+
            '           </div>'+ 
            '           <div>'+
            '               <b></b>'+
            '               <em></em>'+
            '               <img src="'+ shots[i].image_url +'">'+
            '           </div>'+ 
            '        </div>'+
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
         imgs += '<li class="animate fadeInUp item" style="-webkit-animation-delay: '+ i*150 +'ms;">'+   
            '    <div class="picture">'+
            '        <img class="shot" src="'+ shots[i].image_url +'" style="display:none;"/>'+
            '        <div class="underlay">'+
            '            <a class="i" href="'+ shots[i].player.url +'"><img src="'+ shots[i].player.avatar_url +'" /></a>'+
            '            <span class="name">'+ shots[i].player.name +'</span>'+
            '            <span class="likes">'+ shots[i].likes_count +' Likes</span>'+
            '        </div>'+
            '        <div class="slits">'+
            '           <div>'+
            '               <b></b>'+
            '               <em></em>'+
            '               <img src="'+ shots[i].image_url +'">'+
            '           </div>'+ 
            '           <div>'+
            '               <b></b>'+
            '               <em></em>'+
            '               <img src="'+ shots[i].image_url +'">'+
            '           </div>'+ 
            '        </div>'+
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
   
   /* GO */
   Flipper.do('.picture');

   /*$('ul#picsList').on("mouseenter", "li", function(){
            $(this).find('.highlight').children().addClass('reveal');
   });

   $('ul#picsList').on("mouseleave", "li", function(){
            $(this).find('.highlight').children().removeClass('reveal');
   });*/
   
});