const attending = document.getElementById("attending");
const buttonBox = document.getElementById("action-button-container");
const formSlideContainer = document.getElementById("form-slide-container");


const input1 = document.createElement("input");
const input2 = document.createElement("input");
const input3 = document.createElement("input");
const specificDays = document.createElement("textarea");
const alertBox = document.createElement("div");
const integerInput = document.createElement('input');
const songRequests = document.createElement("textarea");
const alertBoxSlideOne = document.createElement("div");

const form = document.getElementById("rsvp-form");

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * The different HTML Elements we will use for our RSVP form *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/* Elements Related to multiple slides */
const nextButton = document.createElement("button");
nextButton.type = "button";
nextButton.className = "btn btn-info button";
nextButton.innerText = "Siguiente";
nextButton.addEventListener("click", nextButtonEvent);

const submitButton = document.createElement("input");
submitButton.type = "button";
submitButton.className = "btn button"
submitButton.addEventListener("click", function (event) {
    console.log("clicking");
    event.preventDefault(); // Prevent the default form submission behavior
    updateValue();
    let isAttending = 0;
    if (groupData.attending.length > 0) {
        isAttending = 1;
    }
    console.log("Attending: " + groupData.attending + "\nDays: " + groupData.days);
    if (isAttending == 1 && groupData.days == 0) {
        alertBox.innerHTML = "";
        alertBox.appendChild(customAlert("danger", "Tienes que elegir los días que van a asistír."));
    } else {
        submitWrapper(JSON.stringify(groupData), isAttending, groupData.groupNumber);
    }
    
});

const previousButton = document.createElement("button");
previousButton.type = "button";
previousButton.className = "btn btn-info button"
previousButton.innerText = "Anterior";
previousButton.addEventListener("click", previousEvent);

/* Elements related to first slide */
const searchBox = document.createElement("div");
searchBox.className = "mb-3 row justify-content-between search-box";

const searchRow = document.createElement("div");
searchRow.className = "search-row";

const searchInput = document.createElement("input"); // Contains search bar
searchInput.id = "search-input";
searchInput.type = "text";
searchInput.placeholder = "Busca tu nombre";
searchInput.ariaLabel = "Busca tu nombre";
searchInput.autocomplete = "off";
searchInput.onfocus = "window.location.href='#search-input'; return true;"

const searchButton = document.createElement("button");
searchButton.id = "search-button";

const magnifyingGlass = document.createElement("i");
magnifyingGlass.id = "search-icon";
magnifyingGlass.className = "fa-solid fa-magnifying-glass";

searchRow.appendChild(searchInput);
searchButton.appendChild(magnifyingGlass);
searchRow.appendChild(searchButton);
searchBox.appendChild(searchRow);

const resultsBox = document.createElement("div");    // Contains suggestions bar
resultsBox.className = "result-box";
resultsBox.id = "result-box";
searchBox.appendChild(resultsBox);

const groupBox = document.createElement("div");      // Contains group members
groupBox.id = "group-box";
groupBox.className = "mb-3";

const actionButtonContainer = document.createElement("div");
//actionButtonContainer.className = "row justify-content-center";
actionButtonContainer.id = "action-button-container";

/* Guest information for Group. This is what gets sent to google sheets. */
var groupData = {};
resetGroup();

/*
 * resetGroup()
 * ------------
 * Clears all data on the group that will (or won't) be attending.
 */
function resetGroup() {
    groupData.attending = [];
    groupData.notAttending = [];
    groupData.days = 0;
    groupData.seats = 0;
    groupData.note = "";
    groupData.groupNumber = 0;
    groupData.song = "";
}

var slideNumber = 0;   /* Keep track of what slide is being shown */

/* 
 * slideOne()
 * ---------------------------------------------
 * Builds the UI of the first slide of RSVP form
 */
function slideOne() {
    formSlideContainer.innerHTML = "";
    formSlideContainer.appendChild(searchBox);
    formSlideContainer.appendChild(groupBox);
    formSlideContainer.appendChild(alertBoxSlideOne);
    formSlideContainer.appendChild(actionButtonContainer);

}
slideOne();


function slideOneButton() {
    actionButtonContainer.innerHTML = '';

    if (groupData.attending.length != 0) {
        actionButtonContainer.appendChild(nextButton);
    } else {
        /* Stylize submit button to warn users that no one is attending */
        submitButton.value = "No Asistiremos"
        submitButton.style.background = '#dc3545';
        actionButtonContainer.appendChild(submitButton);
    }
}


function previousEvent() {
    console.log(slideNumber);
    if (slideNumber == 1) {
        slideOne();
        slideOneButton();
    } else {
        alertBox.innerHTML = "";
        alertBoxSlideOne.innerHTML = "";
        slideTwo();
        slideTwoButton();
    }
    slideNumber--;
}
let highlighted = null;
let result = [];

// Prevent reloading of page on enter press
window.onkeydown = function (e) {
    if (e.key === "Enter" || e.keyCode === 13) {
        e.preventDefault();
    }
}

function songRequestBuilder() {
    let songRequestContainer = document.createElement("div");
    songRequestContainer.className = "input-group mb-3";
    songRequests.className = "form-control";
    songRequests.placeholder = "Escribe tus canciones favoritas aquí";

    songRequests.addEventListener("keyup", songAction);

    function songAction() {
        groupData.song = songRequests.value;
    }

    songRequestContainer.appendChild(songRequests);
    return songRequestContainer;
    
}

/* inputBox.onkeyup
 * ----------------
 * Looks at text typed into search box and 
 * compares with names of invited people.
 * Displays matches found as possible search suggestions.
 * 
 * When a suggestion is clicked, name and fellow group members
 * are displayed.
 */
searchInput.onkeyup = function (e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
        enterKey(e);
        return;
    }

    if (e.key === 'ArrowUp' || e.keyCode === 38) {
        e.preventDefault();
        upKey(e);
        return;
    }

    if (e.key === 'ArrowDown' || e.keyCode === 40) {
        downKey(e);
        return;
    }

    result = []; // clear search results
    highlighted = null; // Nothing highlighted anymore
    let input = searchInput.value.toLowerCase();
    if (input.length) {
        for (let i = 0; i < groups.length; i++) {
            let group = groups[i];
            for (let j = 0; j < group.length; j++) {
                let name = group[j];
                if (name.toLowerCase().includes(input)) {
                    const foundName = document.createElement('li');
                    foundName.textContent = name;
                    foundName.setAttribute("group", i);
                    foundName.addEventListener('click', function () {
                        displayGroupMembers(i);
                    });
                    foundName.addEventListener('mouseover', function (e) {
                        if (highlighted) {
                            highlighted.style.background = "#FFFFFF";
                        }

                        foundName.style.background = "#e9f3ff";
                        highlighted = foundName;
                        console.log(foundName);
                    });

                    foundName.addEventListener('mouseleave', function (e) {
                        foundName.style.background = "#FFFFFF";
                        highlighted = null;
                    });

                    foundName.addEventListener('focusout', function (e) {
                        foundName.style.background = "#FFFFFF";
                        highlighted = null;
                    });
                    result.push(foundName);
                }
            }
        }
        result = rankResults(input, result);
        if (result.length > 0) {
            highlighted = result[0];
            highlighted.style.background = "#e9f3ff";
        }

        display(result);
    } else {
        resultsBox.innerHTML = '';
    }
}

function compareFunction(a, b) {
    if (a.textContent === b.textContent)
        return 0;
    if (a.textContent > b.textContent)
        return 1;
    return -1;
}

function rankResults(st, result) {
    let prime = [];
    let subprime = [];
    for (let i = 0; i < result.length; i++) {
        if (result[i].textContent.toLowerCase().startsWith(st)) {
            prime.push(result[i]);
        } else {
            subprime.push(result[i]);
        }
    }
    prime.sort(compareFunction);
    subprime.sort(compareFunction);

    return prime.concat(subprime);
}


function msdSort(array) {
    var m = getMaxLength(array);
    let result = msdSortHelper(array, 0, m);
    return result;

}

function printArray(array) {
    for (var i = 0; i < array.length; i++) {
        console.log(i + ": " + array[i].textContent + "\n");
    }
}

function msdSortHelper(array, index, maxLength) {
    let result = [];
    if ((array.length <= 1) || (index >= maxLength))
        return array;
    //printArray(array);
    array.sort((a, b) => {
        if (a.textContent.charAt(index) === b.textContent.charAt(index))
            return 0;
        if (a.textContent.charAt(index) > b.textContent.charAt(index))
            return 1;
        return -1;
    });
    //printArray(array);
    var start = 0;

    let l = array.length;
    for (var end = 1; end < l; end++) {
        if (end != l - 1 && (array[end].textContent.charAt(index) != array[start].textContent.charAt(index))) {
            result = result.concat(msdSortHelper(array.slice(start, end), index + 1, getMaxLength(array)));
            start = end;
        } else if (end == l - 1) {
            result = result.concat(msdSortHelper(array.slice(start), index + 1, getMaxLength(array)));
        }
    }

    return result;

}

function getMaxLength(arrayOfStrings) {
    var max = 0;
    for (var i = 0; i < arrayOfStrings.length; i++) {
        var m = arrayOfStrings[i].textContent.length
        if (m > max)
            max = m;
    }
    return max;
}

function enterKey(e) {
    e.preventDefault();
    let groupNumber;
    if (highlighted != null) {
        groupNumber = parseInt(highlighted.getAttribute("group"));
        displayGroupMembers(groupNumber);
        searchInput.blur();
    } else if (result.length > 0) {
        groupNumber = parseInt(result[0].getAttribute("group"));
        displayGroupMembers(groupNumber);
        searchInput.blur();
    }


    console.log("Enter Pressed and groupNumber = " + groupNumber);

}

function upKey(e) {
    e.preventDefault();
    console.log("up");
    let selected;
    if (highlighted && (selected = highlighted.previousElementSibling)) {
        highlighted.style.background = "#FFFFFF";
        selected.style.background = "#e9f3ff";
        highlighted = selected;
        highlighted.scrollIntoViewIfNeeded();
    }
}

function downKey(e) {
    e.preventDefault();
    console.log("down");
    let selected;

    if (!highlighted) {
        highlighted = result[0];
        highlighted.style.background = "#e9f3ff";
    } else if (selected = highlighted.nextElementSibling) {
        highlighted.style.background = "#FFFFFF";
        selected.style.background = "#e9f3ff";
        highlighted = selected;
        highlighted.scrollIntoViewIfNeeded();
    }
}


/* display(result)
 * ----------------
 * Displays names in suggestion box that
 * include search input.
 * 
 * result: Array of <li> elements containing the name
 *         that have been found to match 
 */
function display(result) {
    resultsBox.innerHTML = "";
    const suggestionList = document.createElement('ul');
    for (let i = 0; i < result.length; i++) {
        suggestionList.appendChild(result[i]);
    }
    resultsBox.appendChild(suggestionList);
}

/* displayGroupMembers(groups)
 * ---------------------------
 * The click event for each suggestion.
 * When a name is clicked, will display that name
 * and all other group members in group.
 * If the group can bring a plus one (or two, or three...)
 * then additional guests will be added as well.
 * 
 * groups: A 2D array, for example [["invited guest 1", "invited guest 2"], 1]
 *         which contain an array of invited guests for that group, and
 *         an integer for how many additional guests group can bring.
 */
function displayGroupMembers(index) {
    alertBoxSlideOne.innerHTML = "";
    resetGroup();
    groupData.groupNumber = index;
    slideOneButton();

    /* Add user instructions  */
    const groupDescription = document.createElement("p");
    groupDescription.innerText = "Elige los miembros de tu grupo que van a asistir.";
    groupDescription.className = "mb-3"

    let members = groups[index];            // Array of names of group members
    searchInput.value = "";                 // Clear input box
    resultsBox.innerHTML = "";              // Don't show anymore suggestions
    groupBox.innerHTML = "";                // Reset group box
    groupBox.appendChild(groupDescription); // Add user instructions

    /* Add group members to screen and keep track of what ones are attending or not. */
    for (let i = 0; i < members.length; i++) {
        let groupMember = members[i];
        let newName = newGroupMember(groupMember);
        groupData.notAttending.push(groupMember);
        groupBox.appendChild(newName);
    }
    resetForm();
}

function slideTwoButton() {
    actionButtonContainer.innerHTML = '';
    actionButtonContainer.appendChild(previousButton);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-info button";
    button.innerText = "Siguiente";
    button.addEventListener("click", nextButtonEvent);

    actionButtonContainer.appendChild(button);

}

function removeName(name, array) {
    let i = array.indexOf(name);
    if (i !== -1) {
        array.splice(i, 1);
    }
}

function resetForm() {
    // Uncheck checkboxes
    input1.checked = false;
    input2.checked = false;
    input3.checked = false;

    // remove text
    specificDays.value = "";
    songRequests.value = "";
}

window.onclick = e => {
    console.log(e.target);  // to get the element
    console.log(e.target.tagName);  // to get the element tag name alone
} 
/* newGroupMember()
 * ---------------
 * Stylizes the name of group member and 
 * adds it to the group box.
 */
function newGroupMember(name) {
    let inputGroup = document.createElement("div");
    inputGroup.className = "input-group mb-3";

    let checkBoxContainer = document.createElement("div");
    checkBoxContainer.className = "input-group-text";

    let textInput = document.createElement("input");
    textInput.type = "text";
    textInput.className = "form-control";
    textInput.value = name;
    textInput.ariaLabel = name + " is in this group";
    textInput.setAttribute("readonly", "");
    textInput.setAttribute("disabled", "");
    textInput.style.pointerEvents = "none";

    inputGroup.style.position = "relative";
    inputGroup.style.zIndex = "4";
    textInput.style.zIndex = "0";
    textInput.style.position="relative";
    checkBoxContainer.style.zIndex = "3";

    let checkBox = document.createElement("input");
    checkBox.className = "form-check-input mt-0";
    checkBox.type = "checkbox";
    checkBox.value = "";
    checkBox.ariaLabel = "Checkbox.  Check " + name + " is not attending."

    inputGroup.addEventListener("click", function () {
        if (checkBox.checked) {
            checkBox.checked = false;
            textInput.setAttribute("disabled", "");
            removeName(name, groupData.attending);
            groupData.notAttending.push(name);
            slideOneButton();
            console.log(inputGroup);
            
        } else {
            checkBox.checked = true;
            textInput.removeAttribute("disabled");
            removeName(name, groupData.notAttending);
            groupData.attending.push(name);
            slideOneButton();
            console.log(inputGroup);
        }
        console.log(groupData);
    });

    
    checkBox.addEventListener("click", function () {
        if (checkBox.checked) {
            checkBox.checked = false;
        } else {
            checkBox.checked = true;
        }
    });
    

    checkBoxContainer.appendChild(checkBox);

    inputGroup.appendChild(textInput);
    inputGroup.appendChild(checkBoxContainer);
    return inputGroup;

};

/* SLIDE TWO */
function slideTwo() {
    formSlideContainer.innerHTML = "";
    let selectDaysContainer = document.createElement("div");
    selectDaysContainer.className = "row mb-3";
    let selectDaysText = document.createElement("p");
    selectDaysText.textContent = "Selecciona los días que van a asistir"
    selectDaysContainer.appendChild(selectDaysText);
    formSlideContainer.appendChild(selectDaysContainer);

    let checkContainer = document.createElement("div");
    checkContainer.className = "row justify-content-between mb-3";

    // First Check Box
    let col1 = document.createElement("div");
    col1.className = "col";
    let formCheck1 = document.createElement("div");
    formCheck1.className = "form-check";
    //let input1 = document.createElement("input");
    input1.className = "form-check-input";
    input1.type = "checkbox";
    input1.id = "check1";
    let label1 = document.createElement("label");
    label1.className = "form-check-label";
    label1.for = "check1";
    label1.textContent = "Jueves";
    formCheck1.appendChild(input1);
    formCheck1.appendChild(label1);
    col1.appendChild(formCheck1);
    checkContainer.appendChild(col1);
    input1.addEventListener("change", thursdayAction);

    /* thursdayAction()
     * ----------------
     * update attendingDays to reflect whether guests will be 
     * attending thursday or not.
     */
    function thursdayAction() {
        if (input1.checked) {
            groupData.days = groupData.days | 0b100;
        } else {
            groupData.days = groupData.days & 0b011;
        }
        console.log(groupData);
    }

    // Second Check Box
    let col2 = document.createElement("div");
    col2.className = "col";
    let formCheck2 = document.createElement("div");
    formCheck2.className = "form-check";
    //let input2 = document.createElement("input");
    input2.className = "form-check-input";
    input2.type = "checkbox";
    input2.value = "";
    input2.id = "check2";
    input2.addEventListener("change", fridayAction);
    let label2 = document.createElement("label");
    label2.className = "form-check-label";
    label2.for = "check2";
    label2.textContent = "Viernes";
    formCheck2.appendChild(input2);
    formCheck2.appendChild(label2);
    col2.appendChild(formCheck2);
    checkContainer.appendChild(col2);
    function fridayAction() {
        if (input2.checked) {
            groupData.days = groupData.days | 0b010;
        } else {
            groupData.days = groupData.days & 0b101;
        }
        console.log(groupData);
    }

    // Third Check Box
    let col3 = document.createElement("div");
    col3.className = "col";
    let formCheck3 = document.createElement("div");
    formCheck3.className = "form-check";
    //let input3 = document.createElement("input");
    input3.className = "form-check-input";
    input3.type = "checkbox";
    input3.value = "";
    input3.id = "check3";
    input3.addEventListener("change", saturdayAction);
    let label3 = document.createElement("label");
    label3.className = "form-check-label";
    label3.for = "check3";
    label3.textContent = "Sábado";
    formCheck3.appendChild(input3);
    formCheck3.appendChild(label3);
    col3.appendChild(formCheck3);
    checkContainer.appendChild(col3);

    function saturdayAction() {
        if (input3.checked) {
            groupData.days = groupData.days | 0b001;
        } else {
            groupData.days = groupData.days & 0b110;
        }
        console.log(groupData);
    }

    formSlideContainer.appendChild(checkContainer);


    let specificDaysContainer = document.createElement("div");
    specificDaysContainer.className = "input-group mb-3";
    //let specificDays = document.createElement("textarea");
    specificDays.className = "form-control";
    specificDays.placeholder = "Escribe aquí si alguien en tu grupo va a asistir días diferentes.";
    specificDays.ariaLabel = "Escribe aquí si alguien en tu grupo va a asistir días diferentes.";
    specificDays.addEventListener("keyup", modifiedDays);

    function modifiedDays() {
        groupData.note = specificDays.value;
        console.log(groupData);
    }

    specificDaysContainer.appendChild(specificDays);

    formSlideContainer.appendChild(specificDaysContainer);
    slideTwoButton();
    formSlideContainer.appendChild(actionButtonContainer);
    slideTwoButton();
    //formSlideContainer.appendChild(previousButton);
    //formSlideContainer.appendChild(slideTwoButton());

}
/*
function slideTwoButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-info button";
    button.innerText = "Next";
    button.addEventListener("click", nextButtonEvent);
    return button;
}
*/

/* SLIDE THREE */

function slideThreeButton() {
    actionButtonContainer.innerHTML = '';
    actionButtonContainer.appendChild(previousButton);
    submitButton.value = "Enviar";
    submitButton.style.background = "#68cfee";
    actionButtonContainer.appendChild(submitButton);
}


function slideThree() {
    formSlideContainer.innerHTML = "";
    let slide3Instructions = document.createElement("p");
    slide3Instructions.textContent = "¿Cuántas personas necesitan autobús?"
    formSlideContainer.appendChild(slide3Instructions);
    // Create the outer div with classes "mb-3 row"
    const outerDiv = document.createElement('div');
    outerDiv.className = 'mb-3 row';

    // Create the column div with class "col"
    const colDiv = document.createElement('div');
    colDiv.className = 'col justify-content-center align-items-center';
    colDiv.id = "col-div"

    // Create the integer input container div with class "integer-input-container"
    const integerInputContainer = document.createElement('div');
    integerInputContainer.className = 'integer-input-container';

    // Create the subtract icon element
    const subtractIcon = document.createElement('iconify-icon');
    subtractIcon.id = 'subtract';
    subtractIcon.setAttribute('width', '25');
    subtractIcon.setAttribute('icon', 'ion:remove-circle-outline');

    // Create the integer input div with class "integer-input"
    const integerInputDiv = document.createElement('div');
    integerInputDiv.className = 'integer-input';

    // Create the input element for the integer input
    integerInput.id = 'integer-input';
    integerInput.type = 'number';
    integerInput.className = 'numbers-input';
    integerInput.min = '0';
    integerInput.max = '10';
    integerInput.value = '0';
    integerInput.step = '1';
    integerInput.addEventListener("focusout", maxValue);
    function maxValue() {
        let allowed = groupData.attending.length;
        let number = parseInt(integerInput.value, 10);
        if (!isFinite(number) || integerInput.value == " ") {
            integerInput.value = '0';
        } else if (number > allowed) {
            integerInput.value = allowed;
        }
    }

    /* Control which keys can be used as input */
    integerInput.addEventListener('keydown', e => {
        const pressed = e.key;
        const isNumber = (isFinite(pressed) && pressed != " ");
        console.log(pressed);
        const acceptableCodes = [
            "Backspace",
            "ArrowLeft",
            "ArrowRight",
            "Delete"
        ]

        /* if(acceptableCodes.includes(pressed) || (pressed > 47 && pressed < 58) || (pressed >95 && pressed < 106)) {
             return true;
         } */
        if (isNumber || acceptableCodes.includes(pressed)) {
            return true;
        }
        e.preventDefault();
        return false;
    });

    subtractIcon.addEventListener("click", subtract.bind(null, integerInput));

    // Append the input to the integer input div
    integerInputDiv.appendChild(integerInput);

    // Create the add icon element
    const addIcon = document.createElement('iconify-icon');
    addIcon.id = 'add';
    addIcon.setAttribute('width', '25');
    addIcon.setAttribute('icon', 'ion:add-circle-outline');
    addIcon.addEventListener("click", add.bind(event, integerInput));

    // Append the subtract icon, integer input div, and add icon to the integer input container
    integerInputContainer.appendChild(subtractIcon);
    integerInputContainer.appendChild(integerInputDiv);
    integerInputContainer.appendChild(addIcon);

    // Append the integer input container to the column div
    colDiv.appendChild(integerInputContainer);
    let allButton = document.createElement("button");
    allButton.type = "button";
    allButton.className = "btn btn-info button numbers-input";
    allButton.innerText = "Todos";
    allButton.id = "select-all";
    allButton.addEventListener("click", selectAllEvent);

    function selectAllEvent() {
        let allowed = groupData.attending.length;
        integerInput.value = allowed.toString(10);
    }

    integerInputContainer.appendChild(allButton);

    // Append the column div to the outer div
    outerDiv.appendChild(colDiv);


    // Append the outer div to the target container with ID "container"
    formSlideContainer.appendChild(outerDiv);
    
    //formSlideContainer.appendChild(previousButton);
   // submitButton.value = "Submit";
   // submitButton.style.background = "#68cfee";
    //formSlideContainer.appendChild(submitButton);
    let songRequestText = document.createElement("p");
    songRequestText.textContent = "¿Qué canciones te gustaría escuchar en la boda?";
    songRequestText.className = "mb-3";
    formSlideContainer.appendChild(songRequestText);
    formSlideContainer.appendChild(songRequestBuilder());
    formSlideContainer.appendChild(alertBox);
    slideThreeButton();
    formSlideContainer.appendChild(actionButtonContainer);

};

function updateValue() {
    groupData.seats = integerInput.valueAsNumber;
    console.log(groupData);
}


/* Use button to add */
function add(input) {
    let number = parseInt(input.value);
    number += 1;
    let allowed = groupData.attending.length;
    if (number <= allowed) {
        input.value = number.toString(10);
    }

    return true;
}

/*Use button to subtract */
function subtract(input) {
    let number = parseInt(input.value);
    number -= 1;
    if (number < 0) {
        input.value = "0";
        return true;
    }
    input.value = number.toString(10);
    return true;
};



/* nextButtonEvent()
 * ----------------
 * Defines what should happen when 
 * nextButton is clicked.
*/
function nextButtonEvent() {
    formSlideContainer.innerHTML = "";
    slideNumber++;
    if (slideNumber == 1) {
        slideTwo();
    } else {
        slideThree();
    }

}



const url = "https://script.google.com/macros/s/AKfycbwfEvxW4vsQMgGhYbuFSHDkRJEIZIkF_arpBcxtGaGZyafkPmImTV_IlmLzbq4sOARe2A/exec";


function getNamesFromGoogleSheets() {
    $.get(url, "names", function(data) {
    // This function executes when the request is successful
    groups = JSON.parse(data);
}).fail(function(xhr, status, error) {
    // This function executes if the request fails
    console.error("Error:", error);
});
}

function submitWrapper(dataInput, isAttending, groupNumber) {
    if (isAttending == 0) {
        alertBoxSlideOne.innerHTML = "";
        alertBoxSlideOne.appendChild(customAlert("info", "Enviando Respuestas"));
    } else {
        alertBox.innerHTML = "";
        alertBox.appendChild(customAlert("info", "Enviando Respuestas"));
    }
    
    
    $.get(url, "" + groupNumber, function(data) {
        if (data === "false") {
            submitToGoogleSheet(dataInput, isAttending);
        }
        else {
            if (isAttending == 0) {
                alertBoxSlideOne.innerHTML = "";
                alertBoxSlideOne.appendChild(customAlert("danger", "Your group has already submitted"));
            } else {
                alertBox.innerHTML = "";
                alertBox.appendChild(customAlert("danger", "Your group has already submitted."));
            }
            
        }

        
    }).fail(function(xhr, status, error) {
        if (isAttending == 0) {
            alertBoxSlideOne.innerHTML = "";
            alertBoxSlideOne.appendChild(customAlert("danger", "Lo siento, problemas con el servidor :("));
        } else {
            alertBox.innerHTML = "";
            alertBox.appendChild(customAlert("danger", "Lo siento, problemas con el servidor :("));
        }
      
        
    });
}

function submitToGoogleSheet(data, isAttending) {

    $.post(url, data)
        .done(function (response) {
            console.log(response);
            if (response.result === "error") {
                alertBox.innerHTML = "";
                alertBox.appendChild(customAlert("danger", response.message));
            } else {
                alertBox.innerHTML = "";
                searchInput.value = "";               // Clear input box
                resultsBox.innerHTML = "";         // Don't show anymore suggestions
                groupBox.innerHTML = "";
                actionButtonContainer.innerHTML = "";
                resetGroup();
                slideOne();
                if (isAttending) {
                    alert("¡Gracias! Recibimos su confirmación, nos vemos pronto :)");
                } else {
                    alert("Lamentamos que no podrán asistir.");
                }
                
            }
        })
        .fail(function (response) {
            console.log(response);
            alertBox.innerHTML = "";
            alertBox.appendChild(customAlert("danger", "Lo siento, problemas con el servidor :("));
        });
}

function customAlert(type, message) {
    let alertMessage = document.createElement("div");
    alertMessage.className = "alert alert-" + type + " alert-dismissible fade show";
    alertMessage.setAttribute("role", "alert");
    alertMessage.innerText = message;
    return alertMessage;
}


/* Guest List */

var groups;
getNamesFromGoogleSheets();