let flkty,
    flkty2,
    currIndex = 0,
    currModal = undefined,
    galleryIndex,
    menuOpen = false,
    docStyle,
    transformProp,
    watchData;

// Elements
let menu,
    menuToggle,
    details,
    detailsCarousel,
    detailsReadMore,
    detailsReadMoreLink,
    carousel,
    carouselImgs,
    modalBackground;

// Details id's
let collection,
    pieceName,
    material,
    glass,
    back,
    diameter,
    watchType,
    pieceRef,
    price,
    description;

document.addEventListener('DOMContentLoaded', function(){
    Init();

    // Show / Hide menu button for mobile
    menuToggle.addEventListener('click', function() {
        if(!menuOpen) { // Menu is off so lets turn it on
            menu.classList.remove('menu--hidden');
        } 
        else if(menuOpen) { // Menu is on so lets turn it off
            menu.classList.add('menu--hidden');
        }

        menuOpen = !menuOpen;
    });

    // Carousel
    flkty.on('staticClick', function( event, pointer, cellElement, cellIndex ) {
        if (typeof cellIndex == 'number') {
            flkty.selectCell( cellIndex );
        }
    });

    flkty.on('change', function() {
        SetIndex();
    });

    // Relatively center images + include parallax
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
    detailsReadMore = document.getElementById('details-readMore');
    detailsReadMoreLink = document.getElementById('details-readMore--link');
    carouselImgs = carousel.querySelectorAll('.carousel__card--container');
    galleryIndex = document.getElementById('info__index');
    modalBackground = document.getElementById('modal-background');

    // Details id's
    collection = document.getElementById('details-collection');
    pieceName = document.getElementById('details-name');
    material = document.getElementById('details-material');
    glass = document.getElementById('details-glass');
    back = document.getElementById('details-back');
    diameter = document.getElementById('details-diameter');
    watchType = document.getElementById('details-type');
    pieceRef = document.getElementById('details-reference');
    price = document.getElementById('details-price');
    description = document.getElementById('details-description');

    LoadJSON('./../public/json/watch-data.json', function(data) {
        watchData = JSON.parse(data);

        for(let i = 0; i < carouselImgs.length; i++) {
            carouselImgs.item(i).getElementsByTagName('img')[0].setAttribute('src', watchData[i].images[0]);
        }
    });

    docStyle = document.documentElement.style;
    transformProp = typeof docStyle.transform == 'string' ? 'transform' : 'WebkitTransform';

    // Main carousel
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
    
    // Details image carousel
    flkty2 = new Flickity(detailsCarousel, {
        cellSelector: '.details__card',
        freeScroll: false,
        prevNextButtons: false,
        pageDots: true,
        imagesLoaded: true,
        percentPosition: false,
        
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

    modalBackground.addEventListener('click', function(e) {
        e.preventDefault();

        CloseCurrentModal();
        CloseModalBackground();
    });

    detailsReadMoreLink.addEventListener('click', function(e) {
        e.preventDefault();
        ToggleDetailsReadMore();
    });
    
    SetIndex();
}

function SetIndex() {
    currIndex = flkty.selectedIndex;
    galleryIndex.innerHTML = `0${(currIndex + 1)}`;
}

function OpenModalBackground() {
    modalBackground.classList.remove('modal-background--hidden');
}

function CloseModalBackground() {
    modalBackground.classList.add('modal-background--hidden');
}

function OpenDetails() {
    OpenModalBackground();

    currModal = 'details';
    details.classList.remove('details--hidden');

    PopulateDetails();
}

function CloseDetails() {
    details.classList.add('details--hidden');
    
    // details.classList.add('carousel__card'); // -- Why did I have this here?
    detailsReadMore.classList.add('readMore--hidden');
    
    let slider = document.getElementsByClassName('flickity-slider')[0];
    slider.classList.remove('flickity-slider--details');

    // Clear details / Remove old text
    ClearDetails();
}

function PopulateDetails() {
    let currWatch = watchData[currIndex];
    let cards = detailsCarousel.getElementsByClassName('details__card');
    
    for(let i = 0; i < cards.length; i++) {
        // Grab the img of this card & set its src attribute
        cards.item(i).firstChild.setAttribute('src', currWatch.images[i]);
    }

    collection.innerHTML = currWatch.collection;
    pieceName.innerHTML = currWatch.name;
    material.innerHTML = `<span class="white-text--bold">Material: </span>${currWatch.material}`;
    pieceRef.innerHTML = `<span class="white-text--bold">Reference: </span>${currWatch.ref}`;

    glass.innerHTML = `<span class="white-text--bold">Glass: </span>${currWatch.glass}`;
    back.innerHTML = `<span class="white-text--bold">Back: </span>${currWatch.back}`;
    diameter.innerHTML = `<span class="white-text--bold">Diameter: </span>${currWatch.diameter}`;
    watchType.innerHTML = `<span class="white-text--bold">Type: </span>${currWatch.type}`;
    description.innerHTML = currWatch.description;

    price.innerHTML = `$${NumWithCommas(currWatch.price)}.00`;
}

function ClearDetails() {
    collection.innerHTML = '';
    pieceName.innerHTML = '';
    material.innerHTML = '';
    glass.innerHTML = '';
    back.innerHTML = '';
    diameter.innerHTML = '';
    watchType.innerHTML = '';
    pieceRef.innerHTML = '';
    price.innerHTML = '';
    description.innerHTML = '';
}

function ToggleDetailsReadMore() {
    detailsReadMore.classList.toggle('readMore--hidden');

    if(detailsReadMoreLink.innerHTML == "Read more") {
        detailsReadMoreLink.innerHTML = "Read less";
    } else {
        detailsReadMoreLink.innerHTML = "Read more";
    }
}

function CloseCurrentModal() {
    switch(currModal) {
        case undefined:
            return;
        case 'details':
            CloseDetails();
            break;
    }

    currModal = undefined;
}

function LoadJSON(url, callback) {   
    let xobj = new XMLHttpRequest();

    xobj.overrideMimeType("application/json");
    xobj.open('GET', url, true); // Replace 'appDataServices' with the path to your file
    
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };

    xobj.send(null);  
}

function NumWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}