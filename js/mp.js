var what;
var mp_name;
var pendant;
var contact;
var shade = null;
var photoZoomOuter = null;

var furniture = new Hash();
furniture.set('bench.JPG', 'l');
furniture.set('bench2.JPG', 'l');
//furniture.set('bed2.JPG', 'l');
furniture.set('bed3.JPG', 'l');
furniture.set('blueChair.JPG', 'p');
furniture.set('record shelf.JPG', 'p');
furniture.set('entertainment center.JPG', 'p');
furniture.set('Wilson shelf.JPG', 'p');
furniture.set('myplace.JPG', 'p');
furniture.set('parsell-drum_lights-01sm.jpg', 'l');
furniture.set('parsell-offcut_bench-01sm.jpg', 'l');
furniture.set('parsell-offcut_bench_large-01sm.jpg', 'l');
furniture.set('parsell-offcut_credenza-01sm.jpg', 'l');
furniture.set('parsell-offcut_end_table-01sm.jpg', 'p');
furniture.set('tree.jpg', 'l');

var remodeling = new Hash();
remodeling.set('condo2.JPG', 'l');
remodeling.set('condo4.JPG', 'p');
remodeling.set('condo.JPG', 'l');
remodeling.set('condo3.JPG', 'l');
remodeling.set('collingswood addition2.JPG', 'p');
remodeling.set('coll2.JPG', 'p');
remodeling.set('marBar.JPG', 'p');
remodeling.set('marBar2.JPG', 'p');
//remodeling.set('floor.JPG', 'p');
remodeling.set('shed.JPG', 'l');
remodeling.set('my place.JPG', 'l');

window.addEvent('domready', function(){
    var content = $('content');
    content.setStyle('width', window.getWidth() - 650);

    var main = $('main');
    main.setStyle('height', window.getHeight());

    var pos = content.getPosition();

    nameStartX = pos.x + 260;
    nameStartY = pos.y;

    mp_name = $('name');
    mp_name.setOpacity(0);
    mp_name.setStyles({left: nameStartX, top: nameStartY, visibility: 'visible'})
        .fade('in');

    what = $('what');

    pendantStartX = pos.x + 100;
    pendantStartY = pos.y;

    pendant = $('pendant');
    pendant.setOpacity(0);
    pendant.setStyles({left: pendantStartX, top: pendantStartY, visibility: 'visible'})
        .fade('in');

    
    contact = $('contact');
    contact.appendText('phone: 267.402.0128')
        .adopt(new Element('br'))
        .adopt(new Element('a', { 'href': 'mailto:' + 'michaelparsell' + '@gmail.com' })
               .appendText('email: ' + 'michaelparsell' + '@gmail.com')
              );

    var navWidth = 550;
    var nav = $('nav');
    nav.setOpacity(0);
    
    nav.setStyles({left: (window.getSize().x - navWidth) / 2,
                   top: window.getSize().y - 100,
                   visibility: 'visible'
                  });
    nav.fade('in');

});

function setContent(contentName){
    var content = $('content');
    contentMorph = new Fx.Morph(content);

    contentMorph.start({
        opacity: 0
    })
        .chain(function(){
            content.empty();
            content.setOpacity(1);

            switch(contentName){
            case 'contact':
                var nameMorph = new Fx.Morph(mp_name, {duration: 'long'});
                var whatMorph = new Fx.Morph(what);
                var pendantMorph = new Fx.Morph(pendant, {duration: 'long'});
                
                whatMorph.start({
                    height: 40
                })
                    .chain(function(){
                        nameMorph.start({
                            left: nameStartX,
                            top: nameStartY
                        })
                            .chain(function(){
                                pendantMorph.start({
                                    left: pendantStartX,
                                    top: pendantStartY
                                })
                                    .chain(function(){
                                        finishContent(contentName);
                                    });
                            })
                    });
                
                
                
                break;
                
            default:
                var nameMorph = new Fx.Morph(mp_name, {duration: 'long'});
                var whatMorph = new Fx.Morph(what);
                var pendantMorph = new Fx.Morph(pendant, {duration: 'long'});
                
                whatMorph.start({
                    height: 0
                })
                    .chain(function(){
                        nameMorph.start({
                            left: window.getSize().x - mp_name.getSize().x - 20,
                            top: 7
                        })
                            .chain(function(){
                                pendantMorph.start({
                                    left: 10,
                                    top: 10
                                })
                                    .chain(function(){
                                        finishContent(contentName);
                                    });
                            })
                    });
            }

            // force a redraw
            $(document.body).appendText(' ');
        });
    
}

function finishContent(contentName){
    var content = $('content');

    switch(contentName){
    case 'contact':
        break;
    case 'furniture':
    case 'remodeling':
        gridPhotos(contentName);
    }
    
}

function gridPhotos(type){
    var content = $('content');

    if (type == 'furniture'){
        var photos = furniture;
    }
    else {
        var photos = remodeling;
    }
    

    photos.each(function(orient, photo, index){
        Asset.image('img/' + photo, {
            'onload': function(){
//                if (this.width / this.height > 1){
                    var height = 100;
                    var width = this.width * (100 / this.height);
 /*               }
                else {
                    var width = 70;
                    var height = this.height * (70 / this.width);
                }
   */
             
                this.set({'class': 'photoThumb'});
                this.setStyles({width: width,
                                height: height, 
                               });
                
                this.addEvent('click', zoomPhoto)
                    .setOpacity(0);
                
                content.adopt(this);
                this.fade('in');
            }
        });
    });

}

function zoomPhoto(){
    var thumb = $(this);

    if (!shade){
        shade = new Element('div', {id: 'shade'})
            .setStyles({position: 'absolute',
                        width: window.getSize().x,
                        height: window.getSize().y,
                       })
            .setOpacity(0);
        $(document.body).adopt(shade);
    }
    
    shadeMorph = new Fx.Morph(shade);
    shadeMorph.start({
        opacity: .8
    })
        .chain(function(){
            var photoImg = new Element('img', {'src': 'loading.gif' });

            if (!photoZoomOuter){
                photoZoomOuter = new Element('div', {'class': 'photoZoomOuter' })
                    .adopt(new Element('img', {src: 'img/close.png', 'class': 'photoClose'})
                           .addEvent('click', hideImage))
                    .setOpacity(0)
                    .setStyle('width', 500);
                
                photoZoomDiv = new Element('div', {'class': 'photoZoom'})
                    .adopt(photoImg)
                    .setStyle('width', 500);

                
                photoZoomOuter.adopt(photoZoomDiv);
                
                $(document.body).adopt(photoZoomOuter);
            }
            
            Asset.image(thumb.get('src'), {
                'onload': showImage
            });
            

       });
}

function showImage(){
    var widthR = this.width / (window.getSize().x - 20);
    var heightR = this.height / (window.getSize().y - 100);

    if (widthR > heightR){
        var width = this.width / widthR;
        var height = this.height / widthR;
    }
    else {
        var width = this.width / heightR;
        var height = this.height / heightR;
    }

    var left = (window.getSize().x - width - 20) / 2;
    var top = 50;

    photoZoomOuter.setStyles({
        width: width + 20,
        height: height + 20,
        left: left, 
        top: top
    });

    photoZoomDiv.setStyles({
        width: width,
        height: height
    });
                             
    photoZoomDiv.empty();
    photoZoomDiv.adopt(this.setStyles({width: width, height: height}));

    photoZoomOuter.morph({
        opacity: 1
    });
    

}

function hideImage(){

    var photoMorph = new Fx.Morph(photoZoomOuter);

    photoMorph.start({
        opacity: 0
    })
        .chain(function(){
                   shadeMorph = new Fx.Morph(shade);
                   shadeMorph.start({
                                        opacity: 0
                                    });
               });
}

