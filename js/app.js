let flkty,
    flkty2,
    currIndex = 0,
    galleryIndex,
    menuOpen = false,
    docStyle,
    transformProp;

// Elements
let menu,
    menuToggle,
    details,
    detailsCarousel,
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
            let x = ((slide.target + flkty.x) * -1/3);

            img.style[transformProp] = `translateX(${x}px)`;
        });
    });
});

function Init() {
    menu = document.getElementById('menu');
    menuToggle = document.getElementById('menu-toggle');
    details = document.getElementById('details');
    detailsCarousel = document.getElementById('details__carousel');
    carousel = document.getElementById('carousel');
    carouselImgs = carousel.querySelectorAll('.carousel__card--container');
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
    
    flkty2 = new Flickity(detailsCarousel, {
        cellSelector: '.details__card',
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

        carouselImgs[i].style.backgroundImage = `url(${carouselImgs[i].getAttribute('data-img')})`;
    }
    
    SetIndex();
}

function SetIndex() {
    currIndex = flkty.selectedIndex;
    galleryIndex.innerHTML = `0${(currIndex + 1)}`;
}

function OpenDetails(self) {
    details.classList.add('details');
    details.classList.remove('details--hidden');
}

function CloseDetails(self) {
    self.classList.remove('details');
    self.classList.add('carousel__card');
    
    let slider = document.getElementsByClassName('flickity-slider')[0];
    slider.classList.remove('flickity-slider--details');
}