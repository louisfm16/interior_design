// #region All Variables
// #region GeneraL Variables 
let flkty,
    flkty2,
    currIndex = 0,
    currModal = undefined,
    galleryIndex,
    menuOpen = false,
    docStyle,
    transformProp,
    watchData,
    quantity = 1,
    cart;
// #endregion GeneraL Variables 

// #region Elements
let menu,
    menuToggle,
    details,
    detailsCarousel,
    detailsCloseBtn,
    detailsReadMore,
    detailsReadMoreLink,
    mainTitle,
    mainLearnMore,
    carousel,
    carouselImgs,
    modalBackground;
// #endregion Elements

// #region Details id's
let collection,
    pieceName,
    material,
    glass,
    back,
    diameter,
    watchType,
    pieceRef,
    price,
    description,
    minusQty,
    plusQty,
    qtyValue,
    add2Cart,
    detailsFeedback;
// #endregion Details id's
// #endregion All Variables

document.addEventListener('DOMContentLoaded', function(){
    Init();

    // Carousel
    flkty.on('staticClick', function( event, pointer, cellElement, cellIndex ) {
        if (typeof cellIndex == 'number') {
            flkty.selectCell( cellIndex );
        }
    });

    flkty.on('change', function() {
        SetIndex();
        ChangeCollectionName();
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
    // ! Looks bad I know, sorry :(
    // ************************************* Elements *************************************
    // #region Variable Initialization
    menu = document.getElementById('menu');
    menuToggle = document.getElementById('menu-toggle');
    mainTitle = document.getElementById('info__title');
    mainLearnMore = document.getElementById('info__link');
    carousel = document.getElementById('carousel');
    carouselImgs = carousel.querySelectorAll('.carousel__card--container');
    galleryIndex = document.getElementById('info__index');
    details = document.getElementById('details');
    detailsCarousel = document.getElementById('details__carousel');
    detailsCloseBtn = document.getElementById('details__close-btn');
    detailsReadMore = document.getElementById('details-readMore');
    detailsReadMoreLink = document.getElementById('details-readMore--link');
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
    minusQty = document.getElementById('details-qty-container--minus');
    plusQty = document.getElementById('details-qty-container--plus');
    qtyValue = document.getElementById('details-qty-container--value');
    add2Cart = document.getElementById('details-add2cart');
    detailsFeedback = document.getElementById('details__feedback');

    cart = JSON.parse(window.sessionStorage.getItem('cart')) || [];
    // #endregion Variable Initialization

    LoadJSON('https://raw.githubusercontent.com/louisfm16/fake-watch-database/master/watch-data.json', function(data) {
        watchData = JSON.parse(data);

        PopulateMainCarousel();
        ChangeCollectionName();
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

    // ************************************* Event Listeners *************************************
    // #region Event Listeners
    // Click events for cards / images
    for (var i = 0; i < carouselImgs.length; i++) {
        carouselImgs[i].parentNode.addEventListener('click', function() {
            // Small delay to allow the default animation of Flickity even when not needed
            setTimeout(function() {
                if(!flkty.isAnimating) {
                    OpenDetails();
                }
            }, 100);
        });

        carouselImgs[i].style.backgroundImage = `url(${carouselImgs[i].getAttribute('data-img')})`;
    }

    mainLearnMore.addEventListener('click', function(e) {
        e.preventDefault();
        OpenDetails();
    });

    modalBackground.addEventListener('click', function() {
        CloseCurrentModal();
        CloseModalBackground();
    });

    detailsCloseBtn.addEventListener('click', function() {
        CloseCurrentModal();
        CloseModalBackground();
    });

    detailsReadMoreLink.addEventListener('click', function() {
        ToggleDetailsReadMore();
    });

    minusQty.addEventListener('click', function() {
        SetQuantity(quantity - 1);
        
        minusQty.classList.add('details__info__actions__style--clicked');
        setTimeout(function() {
            minusQty.classList.remove('details__info__actions__style--clicked');
        }, 100);
    });

    plusQty.addEventListener('click', function() {
        SetQuantity(quantity + 1);

        plusQty.classList.add('details__info__actions__style--clicked');
        setTimeout(function() {
            plusQty.classList.remove('details__info__actions__style--clicked');
        }, 100);
    });

    add2Cart.addEventListener('click', function(e) {
        e.preventDefault();

        add2Cart.classList.add('details__info__actions__style--clicked');
        setTimeout(function() {
            add2Cart.classList.remove('details__info__actions__style--clicked');
        }, 100);

        add2Cart.style.pointerEvents = 'none';

        // The index it was found at
        let foundAt = undefined;
        let newMax = parseInt(qtyValue.getAttribute('max'));
        let msg = 'Cart updated successfully!';

        // Check if watch is already in cart
        cart.forEach(function(item, index) {
            if(item.watchIndex == currIndex) {
                foundAt = index;
                return false;
            }
        });

        // Cart is empty
        if(cart.length <= 0) {
            cart.push({
                watchIndex: currIndex,
                qty: parseFloat(qtyValue.getAttribute('value'))
            });
            newMax -= cart[0].qty;
        } // Already in cart 
        else if(foundAt != undefined) {
            let newQty = cart[foundAt].qty + parseInt(qtyValue.getAttribute('value'));

            if(newQty > 10) {
                newQty = 10;
                msg = 'Max quantity reached!';
            }
            cart[foundAt].qty = newQty;
            newMax -= cart[foundAt].qty;
        } // New Item to add
        else {
            cart.push({
                watchIndex: currIndex,
                qty: parseFloat(qtyValue.getAttribute('value'))
            });
            newMax -= cart[cart.length - 1].qty;
        }

        if(newMax <= 0) newMax = 1;
        qtyValue.setAttribute('max', newMax);

        // TODO: Un-comment on release or when fully implemented
        // let JSONCart = JSON.stringify(cart);
        // window.sessionStorage.setItem('cart', JSONCart);

        detailsFeedback.innerHTML = msg;
        detailsFeedback.classList.remove('details__feedback--hidden');

        SetQuantity(1);
        setTimeout(function() {
            add2Cart.style.pointerEvents = 'auto';
            detailsFeedback.classList.add('details__feedback--hidden');
        }, 1000);
    });

    // Show / Hide menu button for mobile
    menuToggle.addEventListener('click', function() {
        if(!menuOpen) { // Menu is off so lets turn it on
            currModal = 'menu';
            modalBackground.classList.add('modal-background--menu');
            OpenModalBackground();

            menu.classList.remove('menu--hidden');
            menuToggle.classList.add('menu-toggle--close');
        } 
        else if(menuOpen) { // Menu is on so lets turn it off
            menu.classList.add('menu--hidden');
            menuToggle.classList.remove('menu-toggle--close');
            
            modalBackground.classList.remove('modal-background--menu');
            CloseModalBackground();
        }

        menuOpen = !menuOpen;
    });
    // #endregion Event Listeners
    
    SetIndex();
}

function SetIndex() {
    currIndex = flkty.selectedIndex;
    galleryIndex.innerHTML = `0${(currIndex + 1)}`;
}

function ChangeCollectionName() {
    mainTitle.style.opacity = 0;
    mainTitle.style.maxHeight = '100px';

    setTimeout(function() {
        mainTitle.innerHTML = watchData[currIndex].collection;
        mainTitle.style.opacity = 1;
        mainTitle.style.maxHeight = '1000px';
    }, 250);
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
    
    qtyValue.setAttribute('max', 10);
    ClearDetails();
    flkty2.select(0);
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

    //  Check if watch already in cart
    cart.forEach(function(item, index) {
        if(item.watchIndex == currIndex) {
            let max = (10 - cart[index].qty);
            if(max <= 0) max = 1;

            qtyValue.setAttribute('max', max);
            return false;
        }
    });
}

function PopulateMainCarousel() {
    for(let i = 0; i < carouselImgs.length; i++) {
        // Grab the img element itself
        let img = carouselImgs.item(i).getElementsByTagName('img')[0];

        // Change its src attribute
        img.setAttribute('src', watchData[i].images[0]);
    }
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

    SetQuantity(1);
}

function ToggleDetailsReadMore() {
    detailsReadMore.classList.toggle('readMore--hidden');

    if(detailsReadMoreLink.innerHTML == "Read more") {
        detailsReadMoreLink.innerHTML = "Read less";
    } else {
        detailsReadMoreLink.innerHTML = "Read more";
    }
}

function SetQuantity(val) {
    let max = parseInt(qtyValue.getAttribute('max'));

    if(val <= 1) {
        quantity = 1;
    }
    else if(val >= max) {
        quantity = max;
    }
    else {
        quantity = val;
    }

    qtyValue.setAttribute('value', quantity);
}

function CloseCurrentModal() {
    switch(currModal) {
        case undefined:
            return;
        case 'menu':
            SimulateClick(menuToggle);
            break;
        case 'details':
            CloseDetails();
            break;
    }

    currModal = undefined;
}

// #region Helper Functions
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

function SimulateClick(element) {
	// Create our event (with options)
	let evt = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
		view: window
    });
    
	// If cancelled, don't dispatch our event
	let canceled = !element.dispatchEvent(evt);
}
// #endregion Helper Functions