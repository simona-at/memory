"use strict";

$(document).ready(function (){

    $("#start").click(function (e) {
        e.preventDefault();
        let schwierigkeitsgrad = $('input[name="schwierigkeit"]:checked').val();
        switch (schwierigkeitsgrad){
            case 'leicht':
                buildBoard(16, 4, 4);
                startGame(8);
                break;
            case 'mittel':
                buildBoard(24, 6,4);
                startGame(12);
                break;
            case 'schwer':
                buildBoard(36, 6, 6);
                startGame(18);
                break;
            default:
                alert("Bitte wähle eine Schwierigkeitsstufe!");
        }
    });
});


//Initialisiert das Spielfeld mit Bildern(cards) in Reihen(rows) und Spalten(cols):
function buildBoard(cards, cols, rows) {
    $("#memoryField").empty();

    let arr = new Array();
    let index = 0;
    let width;
    if (cols <= 4) width = '220';
    else width = '150';

    for(let j = 1; j <= rows; j++) {
        let div = `<div id="row${j}" class="row"></div>`
        $("#memoryField").append(div);
    }

    //erstellen der angegebene Anzahl an Reihen:
    for(let k = 1; k <= rows; k++){
        let row = "#memoryField div#row" + k;

        //erstellen der angegebene Anzahl an Bilder in jeder Reihe:
        for (let i=0; i< cols; i++) {
            arr.push(index);
            let html = `<div class="card" id="f${index}">
                            <img width='${width}' src='' id='i${index}'/>
                        </div>`
            $(row).append(html);
            index++;
        }
    }

    let r;
    for (let i=1; i<=(cards/2); i++){
        r = getRandom(0, arr.length-1);
        $("#memoryField div #i" + arr[r]).attr( "src", "imgs/img_" + i + ".jpg");
        arr.splice(r, 1); //deletes the element on index r
        r = getRandom(0, arr.length-1);
        $("#memoryField div #i" + arr[r]).attr( "src", "imgs/img_" + i + ".jpg");
        arr.splice(r, 1);
    }
}



function getRandom(min, max){
    if (min > max) return -1;
    if (min == max) return min;
    return min + parseInt(Math.random() * (max-min+1));
}


//Startet das Spiel mit der zu erreichenden Anzahl an Paaren(pairs):
function startGame(pairs) {

    let firstCard = null;
    let currentCard = null;
    let count = 0; //Anzahl der aktuell aufgedeckten Karten
    let tries = 0; //Anzahl der Versuche, bei denen immer zwei Karten aufgedeckt wurden
    let foundPairs = 0; //bereits gefundene Paare

    let card = $(".card");

    //alle Karten verdecken:
    $(".card img").animate({opacity: 0}, 0);

    //über eine aktive Karte hovern:
    card.hover(
        function () {
            $(this).addClass("cardHover");
        }, function () {
            $(this).removeClass("cardHover");
        }
    );

    //eine Karte aufdecken:
    card.click(function (e) {
        e.preventDefault();

        if (count === 3) {
            firstCard.animate({opacity: 0});
            currentCard.animate({opacity: 0});
            tries++;
            count = 0;
        }

        currentCard = $(e.currentTarget).find('img');
        currentCard.animate({opacity: 1}, 500);
        count++;

        if (count === 1) {
            firstCard = currentCard;
        }

        if (count === 2) {

            if (firstCard.attr('src') === currentCard.attr('src') &&
                firstCard.attr('id') !== currentCard.attr('id')) {

                //beide Karten sind gleich, werden vom Spielfeld genommen
                takeCardsOffBoard(firstCard, currentCard);
                tries++;
                foundPairs++;
                firstCard = null;
                count = 0;
            }
            else if (firstCard.attr('id') === currentCard.attr('id')) {
                //selbe Karte wurde zweimal geklickt
                count = 1;
            }
            else {
                //Karten sind nicht gleich und werden beim nächsten Klick wieder verdeckt
                count++;
            }
        }

        //alle Paare wurden gefunden:
        if(foundPairs === pairs){
            window.setTimeout(function (){
                gameFinished(tries);
            }, 2500);
        }
    });
}


//Nimmt ein gefundenes Bilderpaar vom Spielfeld:
function takeCardsOffBoard(firstCard, currentCard){
    window.setTimeout(function(){
        //Bilder des gefundenen Paars verdecken:
        firstCard.animate({opacity:0});
        currentCard.animate({opacity:0});

        //dem div eine neue Klasse geben:
        firstCard.parent('div').addClass('found');
        currentCard.parent('div').addClass('found');

        //den div deaktivieren, dass er nicht mehr geklickt werden kann
        firstCard.parent('div').unbind('click');
        currentCard.parent('div').unbind('click');
    }, 1500);
}


//Gibt bei fertigem Spiel eine Meldung mit Anzahl der Versuchen(tries) aus:
function gameFinished(tries){
    alert("Du hast alle Paare gefunden, gratuliere!\nDu hast " + tries + " Versuche gebraucht.");

    //Spielfeld löschen:
    $("#memoryField").empty();
}