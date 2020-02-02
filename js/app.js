let flkty;
let galleryIndex = '00';
let menuOpen = false;

// Elements
let menu;
let menuToggle;

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

    flkty.on( 'change', function() {
        SetIndex();
    });
});

function Init() {
    flkty = new Flickity( '.carousel', {
        cellSelector: '.carousel__card',
        freeScroll: true,
        prevNextButtons: false,
        pageDots: false,
        // autoPlay: 3000
    });

    menu = document.getElementById('menu');
    menuToggle = document.getElementById('menu-toggle');
    galleryIndex = document.getElementById('info__index');

    SetIndex();
}

function SetIndex() {
    let index = `0${(flkty.selectedIndex + 1)}`;
    galleryIndex.innerHTML = index;
}