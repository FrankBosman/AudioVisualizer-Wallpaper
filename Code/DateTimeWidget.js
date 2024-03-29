let DateTimeStyle = {
    showFullDay: false,
}
let activeDateWidget = 1;
let flipperClockStyle = {
    showSeconds: true,
    showDate: true,
}



// update time and date
updateTime();
setInterval(updateTime, 1000);
function updateTime() {
    let currentDate = new Date();
    
    if (activeDateWidget === 1){
        let cDay = currentDate.getDate();
        let cMonth = currentDate.toLocaleString("en-US", { month: "short" });//.getMonth() + 1;
        let cYear = currentDate.getFullYear();

        let time = `${currentDate.getHours() < 10 ? '0' + currentDate.getHours() : currentDate.getHours()}:${currentDate.getMinutes() < 10 ? '0' + currentDate.getMinutes() : currentDate.getMinutes()}`;

        var dt = moment(currentDate, "YYYY-MM-DD HH:mm:ss");

        $('#time').text(time);
        $('#date').text(`${cDay} ${cMonth} ${cYear}`);
        if (DateTimeStyle.showFullDay) $('#day').text(`${dt.format('dddd')}`);
        else $('#day').text(`${dt.format('dddd')}`.substring(0, 3));
    } else if (activeDateWidget === 2){       
        const minutes = currentDate.getMinutes().toString();
        const hours = currentDate.getHours().toString();
        
        updateFlipperSet('flipper3', 'flipper4', minutes);
        updateFlipperSet('flipper1', 'flipper2', hours);

        if (flipperClockStyle.showSeconds){
            const seconds = currentDate.getSeconds().toString();
            updateFlipperSet('flipper5', 'flipper6', seconds);
        }

        if (flipperClockStyle.showDate){
            const cDay = currentDate.getDate();
            const cMonth = currentDate.toLocaleString("en-US", { month: "short" });//.getMonth() + 1;
            var dt = moment(currentDate, "YYYY-MM-DD HH:mm:ss");
            const day = `${dt.format('dddd')}`;

            if (day != getFlipperVal('flipper-Day'))
                changeFlipperNum('flipper-Day', day);
            
            updateFlipperSet('flipper-DayNum1', 'flipper-DayNum2', `${cDay}`);

            if (cMonth != getFlipperVal('flipper-Month'))
                changeFlipperNum('flipper-Month', cMonth);
        }
    }
}

function dateTimeProperties(prop) {
    // ------------------------------ Date and Time ------------------------------\\
    
    // display the right dateTime widget
    if (prop.date) {        
        switch (prop.date.value) {
            case '1':
                $('.flipClock').removeClass('dateActive');
                $('.dateTimeContainer').addClass('dateActive');
                activeDateWidget = 1
                break;
            case '2':
                $('.dateTimeContainer').removeClass('dateActive');
                $('.flipClock').addClass('dateActive');
                activeDateWidget = 2
                break;
        
            default:
                $('.dateTimeContainer').removeClass('dateActive');
                $('.flipClock').removeClass('dateActive');
                activeDateWidget = 0
                break;
        }

    }

    // movement and scaling:
    if (prop.dateoffsetx) {
        $('.timeCenterContainer').css('left', `${prop.dateoffsetx.value}%`);
    }
    if (prop.dateoffsety) {
        $('.timeCenterContainer').css('top', `${prop.dateoffsety.value}%`);
    }
    if (prop.datesize) {
        changeSizeDateTime(prop.datesize.value);
    }
    
    // extra features
    if (prop.dateshowtime != null){
        if (prop.dateshowtime.value){
            $('.flipperClock').addClass('dateActive');
        } else {
            $('.flipperClock').removeClass('dateActive');
        }
    }
    if (prop.dateshowseconds != null){
        $('.dateFlipperSeconds').css('display', `${prop.dateshowseconds.value ? 'flex' : 'none'}`);
        flipperClockStyle.showSeconds = prop.dateshowseconds.value;
    }
    if (prop.dateshowdate != null){
        if (prop.dateshowdate.value){
            $('.flipDate').addClass('dateActive');
        } else {
            $('.flipDate').removeClass('dateActive');
        }
        flipperClockStyle.showDate = prop.dateshowdate.value;
    }
    if (prop.datedatescale){
        $('.flipDate').css('transform', `scale(${prop.datedatescale.value / 100})`);
    }
}

/**
 * Takes an new scaling factor and scalles all clocks to a new corresponding size
 * @param {int} newScaleFactor An _int_ value from *0 to 100* representing the new size of all the dateTimes widgets
 */
function changeSizeDateTime(newScaleFactor) {
    // default date time
    $('.dateTimeContainer').css('width', `${newScaleFactor}%`);
    $('.dateTimeContainer').css('height', `${newScaleFactor / 65.0 * 20.0}vw`);
    $('#day').css('font-size', `${newScaleFactor / 65.0 * 14.0}vw`);
    $('#time').css('font-size', `${newScaleFactor / 65.0 * 7.0}vw`);
    $('#date').css('font-size', `${newScaleFactor / 65.0 * 3.0}vw`);

    // flipper
    $('.flipClock').css('transform', `scale(${(newScaleFactor + 30) / 100})`);
}


/* -------- Extra flipper clock functions -------- */
/**
 * This function can be used to update two flipper at once.
 * It takes a string of 1 or 2 characters long, if it is 1 character long the first flipper will display 0 and the second will display the value.
 * If the string is 2 characters long it will split it over the two flippers.
 * 
 * @param {String} id The *html* id of the first flipper
 * @param {String} id2 The *html* id of the second flipper
 * @param {String} value The new value represented in a _1_ or _2_ *Character(s)* *String*
 */
function updateFlipperSet(id, id2, value){
    const ones = value.charAt(value.length -1);
    const tenths = value.length > 1 ? value.charAt(0) : 0;

    if (tenths != getFlipperVal(id))
        changeFlipperNum(id, tenths);
    if (ones != getFlipperVal(id2))
        changeFlipperNum(id2, ones);
}

/**
 * Sets the given flipper to a new value.
 * And animate a flip to the new value from the old value
 * @param {String} id The *html* id of the flipper
 * @param {String|int} num a *String* or *int* of the new value
 */
function changeFlipperNum(id, num){
    const flipper = document.getElementById(id);

    const flipperTop = flipper.children[1];
    const flipperBottom = flipper.lastElementChild;
    const flipperNewTop = flipper.firstElementChild;
    const flipperNewBottom = flipper.children[2];
    
    flipperNewTop.firstElementChild.innerText = num;
    flipperTop.classList.add('flipping');
    flipperBottom.classList.remove('flipping');

    flipperNewBottom.classList.add('flipping');
    setTimeout(() => {
        flipperTop.firstElementChild.innerText = num;
        flipperTop.classList.remove('flipping');
        flipperBottom.classList.add('flipping');
        
        flipperBottom.firstElementChild.innerText = num;
    }, 250);
    setTimeout(() => {
        flipperNewBottom.firstElementChild.innerText = num
        flipperNewBottom.classList.remove('flipping');
    }, 500);
}
/**
 * Returns the current value of the flipper
 * 
 * @param {String} id The *html* id of the flipper
 * @returns a *String* of the value
 */
function getFlipperVal(id){
    const flipperNewTop = document.getElementById(id).firstElementChild;
    return flipperNewTop.firstElementChild.innerText;
}