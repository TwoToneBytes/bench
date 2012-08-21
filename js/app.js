var showing = 0;
var drib = {
    host:'http://api.dribbble.com',
    popular:'/shots/popular',
    everyone:'/shots/everyone',
    debuts:'/shots/debuts',
    player:'/players/',


    getPopular:function () {
        var url = drib.host + drib.popular;
        var yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from json where url="' + url + '"') + '&format=json&callback=cbfunc';
        showing = 0;
        console.log(yql);
        this.req(yql, function (data) {
            console.log(data.results);
            popularShots.buildShots(data.query.results.json.shots);

        });
    },
    getEveryone:function () {
        showing = 1;
        var url = drib.host + drib.everyone;
        var yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from json where url="' + url + '"') + '&format=json&callback=cbfunc';
        this.req(yql, function (data) {
            console.log(data);
            popularShots.buildShots(data.query.results.json.shots);

        });
    },
    getDebuts:function () {
        showing = 2;
        var url = drib.host + drib.debuts;
        var yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from json where url="' + url + '"') + '&format=json&callback=cbfunc';
        this.req(yql, function (data) {
            console.log(data);
            popularShots.buildShots(data.query.results.json.shots);

        });
    },
    getPopularNoError:function () {
        var url = drib.host + drib.popular;
        var yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from json where url="' + url + '"') + '&format=json&callback=cbfunc';
        showing = 4;
        this.req(yql, function (data) {
            console.log(data);
            popularShots.buildShots(data.query.results.json.shots);

        });
    },

    getFollowing:function (playerId) {
        showing = 3;
        $('.subInfo').html("<span style='color:#68a4f5'>searching...<span>");
        var url = drib.host + drib.player + playerId + '/shots/following';
        var yql = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from json where url="' + url + '"') + '&format=json&callback=cbfunc';
        this.req(yql, function (data) {
            console.log(data);
            $('#lookup-player').removeClass('error');
            getFollowingShots.buildList(data.query.results.json.shots);

        });
    },
    req:function (url, cbfunc) {
        var lastTimeChecked = window.localStorage.getItem("lastChecked") ? new Date(window.localStorage.getItem("lastChecked")) : null,
            cachedData = window.localStorage.getItem("cachedDribbbleData") ? JSON.parse(window.localStorage.getItem("cachedDribbbleData")) : null,
            toCheckTime = new Date();

        // cache once every 30 minutes:
        toCheckTime.setMinutes(toCheckTime.getMinutes() - 30);

        // Only call api if the data hasn't been cached:
        if (!lastTimeChecked || (lastTimeChecked < toCheckTime && cachedData == null)) {
            $.ajax({
                url:url,
                dataType:'jsonp',
                jsonp:false,
                jsonpCallback:'cbfunc',
                timeout:1000,
                success:function (data) {
                    window.localStorage.setItem("lastChecked", new Date());
                    window.localStorage.setItem("cachedDribbbleData", JSON.stringify(data));

                    OnSuccess(data);
                },
                error:function (x, t, m) {
                    if (t === "timeout") {
                        $('#lookup-player').removeClass('playerList').addClass('error');
                        $('.subInfo').html("<span style='color:#ce4d73'>We're sorry, we couldn't find that username.  We'll show you the popular shots in the meantime<span>");
                        console.log('timeout error');
                        drib.getPopular();
                    } else {
                        $('#lookup-player').addClass('error');
                        console.log('else timeout error');
                        drib.getPopular();
                    }
                }
            });
        }
        else {
            // call on succes with cached data:
            OnSuccess(cachedData);
        }

        function OnSuccess(data) {
            var userName = window.localStorage.getItem('user');
            console.log('showing ' + showing);
            if (showing == 3) {
                console.log('hello showing');
                $('.subInfo').html("<span style='color:#81ce4d'>Got it!</span> You can also type 'everyone', 'popular' or 'debuts'");
                $('#lookup-player').removeClass().addClass('playerList');
            } else if (showing == 1) {
                console.log('hello everyone');
                $('.subInfo').html("<span style='color:#81ce4d'>Everyone it is!</span> You can also input your username, 'popular' or 'debuts'");
                $('#lookup-player').removeClass().addClass('everyone');
            } else if (showing == 2) {
                console.log('hello debuts');
                $('.subInfo').html("<span style='color:#81ce4d'>We're showing Debuts!</span> You can also input your username, 'everyone' or 'popular'");
                $('#lookup-player').removeClass().addClass('debuts');
            } else if (showing == 4) {
                console.log('hello popular');
                $('.subInfo').html("<span style='color:#81ce4d'>We're showing Popular!</span> You can also input your username, 'everyone' or 'debuts'");
                $('#lookup-player').removeClass().addClass('popular');
            }

            if (!$("#lookup-player").val()) {
                $('#lookup-player').addClass('error');
                $('.subInfo').html("Input your username and we'll show the players you're following or input 'everyone', 'popular' or 'debuts' to see those feeds.  We'll show popular by default");
            }
            cbfunc(data);
        }
    }
}


var popularShots = {
    container:$('#picsList'),
    buildShots:function (shots) {
        var imgs = '';
        for (var i = 0; i < 6; i++) {
            console.log(shots[i]);
            imgs += '<li class="animate fadeInUp item" style="-webkit-animation-delay: ' + i * 150 + 'ms;">' +
                '    <div class="picture">' +
                '        <img class="shot" src="' + shots[i].image_url + '" style="display:none;"/>' +
                '        <div class="underlay">' +
                '            <a class="r" href="' + shots[i].url + '"><img src="css/img/arrow.png" /></a>' +
                '            <a class="i" href="' + shots[i].player.url + '"><img src="' + shots[i].player.avatar_url + '" /></a>' +

                '           <div class="shotStats">' +
                '              <span class="name">' + shots[i].player.name + '</span>' +
                '              <span class="likes">' + shots[i].likes_count + ' Likes</span>' +
                '           </div>' +
                '        </div>' +
                '        <div class="slits">' +
                '           <div>' +
                '               <b></b>' +
                '               <em></em>' +
                '               <img src="' + shots[i].image_url + '">' +
                '           </div>' +
                '           <div>' +
                '               <b></b>' +
                '               <em></em>' +
                '               <img src="' + shots[i].image_url + '">' +
                '           </div>' +
                '        </div>' +
                '    </div>' +
                '</li>';
        }
        this.container.html(imgs);
    }
}

var getFollowingShots = {
    buildList:function (shots) {
        this.container = $('#picsList');
        var imgs = '';
        for (var i = 0; i < 6; i++) {
            console.log(shots[i]);
            imgs += '<li class="animate fadeInUp item" style="-webkit-animation-delay: ' + i * 150 + 'ms;">' +
                '    <div class="picture">' +
                '        <img class="shot" src="' + shots[i].image_url + '" style="display:none;"/>' +
                '        <div class="underlay">' +
                '            <a class="r" href="' + shots[i].url + '"><img src="css/img/arrow.png" /></a>' +
                '            <a class="i" href="' + shots[i].player.url + '"><img src="' + shots[i].player.avatar_url + '" /></a>' +

                '           <div class="shotStats">' +
                '              <span class="name">' + shots[i].player.name + '</span>' +
                '              <span class="likes">' + shots[i].likes_count + ' Likes</span>' +
                '           </div>' +
                '        </div>' +
                '        <div class="slits">' +
                '           <div>' +
                '               <b></b>' +
                '               <em></em>' +
                '               <img src="' + shots[i].image_url + '">' +
                '           </div>' +
                '           <div>' +
                '               <b></b>' +
                '               <em></em>' +
                '               <img src="' + shots[i].image_url + '">' +
                '           </div>' +
                '        </div>' +
                '    </div>' +
                '</li>';
        }
        this.container.html(imgs);
    }
}

var user = $('#lookup-player');
var ui = {
    init:function () {
        var userName = window.localStorage.getItem('user');

        user.blur(function () {
            var val = $(this).val();
            if (val == 'debuts') {
                window.localStorage.setItem('user', $(this).val());
                drib.getDebuts();
                return;
            } else if (val == 'everyone') {
                window.localStorage.setItem('user', $(this).val());
                drib.getEveryone();
                return;
            } else if (val == 'popular') {
                window.localStorage.setItem('user', $(this).val());
                drib.getPopularNoError();
                return;
            } else if (val == '') {
                console.log('setting user to blank');
                window.localStorage.setItem('user', '');
                drib.getPopular();
                return;
            }

            window.localStorage.setItem('user', $(this).val());
            drib.getFollowing($(this).val());
        });

        user.keyup(function (event) {
            if (event.keyCode == 13) {
                var val = $(this).val();
                if (val == 'debuts') {
                    window.localStorage.setItem('user', $(this).val());
                    drib.getDebuts();
                    return;
                } else if (val == 'everyone') {
                    window.localStorage.setItem('user', $(this).val());
                    drib.getEveryone();
                    return;
                } else if (val == 'popular') {
                    window.localStorage.setItem('user', $(this).val());
                    drib.getPopularNoError();
                    return;
                } else if (val == '') {
                    console.log('setting user to blank');
                    window.localStorage.setItem('user', '');
                    drib.getPopular();
                    return;
                }


                window.localStorage.setItem('user', $(this).val());
                drib.getFollowing($(this).val());
            }
        });

        if (userName !== null && userName !== '') {
            user.val(userName);
            if (userName == 'debuts') {
                drib.getDebuts();
                return;
            } else if (userName == 'everyone') {
                drib.getEveryone();
                return;
            } else if (userName == 'popular') {
                drib.getPopularNoError();
                return;
            } else {
                console.log('getFollowing');
                drib.getFollowing(userName);
                return;
            }
        } else {
            drib.getPopular();
        }

    }
}

$(function () {
    console.log('initialize');
    ui.init();


    $("a.settings").click(function () {
        $(".overlay").fadeIn(250);
        $(".content").removeClass('out').addClass('in').show();
    });

    $(".close").click(function () {
        $(".overlay").delay(250).fadeOut(250);
        $(".content").removeClass('in').addClass('out').css({
            // "display" : "none"
        });
    });

});