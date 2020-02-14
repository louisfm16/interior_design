let flkty,
    currIndex = 0,
    galleryIndex,
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

    // CRelatively center images + include parallax
    flkty.on('scroll', function() {
        flkty.slides.forEach(function(slide, i) {
            let img = carouselImgs[i];
            let halfWidth = (img.width / 2);
            let x = ((slide.target + flkty.x) * -1/3) - slide.outerWidth;
            console.log(`================== ${img.style.transform} ========================`);
            img.style[transformProp] = `translate(${x}px, -50%)`;
            console.log(`++++++++++++++++++++++ ${img.style[transformProp]} ++++++++++++++++++++++`);
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
        percentPosition: false,
        
        // freeScroll: false,
        // draggable: false,
        // accessibility: false,
    });

    // Click events for cards / images
    for (var i = 0; i < carouselImgs.length; i++) {
        carouselImgs[i].parentNode.addEventListener("click", function (e) {
            e.preventDefault();
            let self = this;
            
            // Small delay to allow the default animation of Flickity even when not needed
            setTimeout(function() {
                if(!flkty.isAnimating) {
                    OpenDetails(self);
                }
            }, 100);
        });
    }
    
    SetIndex();

    // flkty.destroy();
}

function SetIndex() {
    currIndex = flkty.selectedIndex;
    galleryIndex.innerHTML = `0${(currIndex + 1)}`;
}

function OpenDetails(self) {
    let slider = document.getElementsByClassName('flickity-slider')[0];
    slider.classList.add('flickity-slider--details');

    self.classList.add('details');
    self.classList.remove('carousel__card');

    let infoDiv = document.createElement('div');
    infoDiv.classList.add('details__info');

    self.appendChild(infoDiv);
}

function CloseDetails(self) {
    self.classList.remove('details');
    self.classList.add('carousel__card');
    let slider = document.getElementsByClassName('flickity-slider')[0];
    slider.classList.remove('flickity-slider--details');
}