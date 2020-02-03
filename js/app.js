let flkty,
    cardsCount,
    galleryIndex = '00',
    menuOpen = false,
    docStyle,
    transformProp;

// Elements
let menu,
    menuToggle,
    carousel,
    carouselImgs;

document.addEventListener('DOMContentLoaded', function(){
    Init();

    menuToggle.addEventListener('click', function() {
        if(!menuOpen) { // Menu is off so lets turn it on
            menu.classList.remove('menu--hidden');
        } 
        else if(menuOpen) { // Menu is on so lets turn it off
            menu.classList.add('menu--hidden');
        }

        menuOpen = !menuOpen;
    });

    flkty.on('staticClick', function( event, pointer, cellElement, cellIndex ) {
        if (typeof cellIndex == 'number') {
            flkty.selectCell( cellIndex );
        }
    });

    flkty.on('change', function() {
        SetIndex();
    });

    flkty.on('scroll', function() {
        flkty.slides.forEach(function(slide, i) {
            let img = carouselImgs[i];
            let x = ((slide.target + flkty.x) * -1/3) - slide.outerWidth;
            img.style[transformProp] = 'translate(' + x + 'px, -50%)';
        });
    });
});

function Init() {
    menu = document.getElementById('menu');
    menuToggle = document.getElementById('menu-toggle');
    carousel = document.getElementById('carousel');
    carouselImgs = carousel.querySelectorAll('.carousel__card img');
    galleryIndex = document.getElementById('info__index');

    docStyle = document.documentElement.style;
    transformProp = typeof docStyle.transform == 'string' ? 'transform' : 'WebkitTransform';

    flkty = new Flickity(carousel, {
        cellSelector: '.carousel__card',
        freeScroll: true,
        prevNextButtons: false,
        pageDots: false,
        imagesLoaded: true,
        percentPosition: false
    });
    
    SetIndex();
}

function SetIndex() {
    let index = `0${(flkty.selectedIndex + 1)}`;
    galleryIndex.innerHTML = index;
}