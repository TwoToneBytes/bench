var Flipper = {
    tag: null,
    do: function(o) {
        Flipper.tag = o;
        Flipper.load();
    },
    load: function() {
        setTimeout(function() {
            if(document.readyState === 'complete') {
                Flipper.build();
                return;
            }
            Flipper.load();
        }, 10);
    },
    build: function() {
        var obj, img, o;
        obj = document.querySelectorAll(Flipper.tag);
        for(i=0,l=obj.length;i<l;i++) {
            o = obj[i];
            img = o.getElementsByTagName('img')[0];
            img.style.display = 'none';
            img = img.src;
            if(img) {
                img = '<img src='+img+' />';
                o.innerHTML = o.innerHTML + '\
                <div class=slits> \
                  <div><b></b><em></em>'+img+'</div> \
                  <div><b></b><em></em>'+img+'</div> \
                </div> \
                <b></b>';
            }
        }       
    }
};