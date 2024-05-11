const input = document.getElementById("integer-input");
const subtract = document.getElementById("subtract");
const add = document.getElementById("add");
const rsvpForm = document.getElementById("rsvp-form");
const sendButtonContainer = document.getElementById("send-button-container");
const buttonParent = sendButtonContainer.parentNode;
const names = [];



function addName() {
    /* Add name fields */
var newName = document.createElement("div");
var newFirst = document.createElement("input");
var newLast = document.createElement("input");

newName.className = "mb-3 row justify-content-between";
newFirst.className = "form-control firstNameInput"
newFirst.type = "text";
newFirst.placeholder = "Nombre";

newLast.className = "form-control"
newLast.type = "text";
newLast.placeholder = "Apellido";

newName.appendChild(newFirst);
newName.appendChild(newLast);
buttonParent.insertBefore(newName, sendButtonContainer);
names.push(newName);
return true;
}



/* Use button to add */
add.addEventListener("click", e => {
    let number = parseInt(input.value);
    number += 1;
    input.value = number.toString(10);
    addName();
    return true;

})

/*Use button to subtract */
subtract.addEventListener("click", e => {
    let number = parseInt(input.value);
    number -= 1;
    if (number < 0) {
        input.value = "0";
        return true;
    }
    input.value = number.toString(10);
    rsvpForm.removeChild(names.pop());
    return true;
});

/* Control which keys can be used as input */ 
input.addEventListener('keydown', e => {
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


/* Guest List */ 
const groups = [];

/* Create Various Groups */
const group1 = new Map([
    ["invited", ["Leonard Mohr", "Flor Grimaldo"]],
    ["aditional guests", 0]
]); 

groups.add(group1);

