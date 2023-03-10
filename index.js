// Get elements from index.html
let buildingForm = document.forms.buildingInfo;

let streetName = document.getElementById('streetName');
let suburb = document.getElementById('suburb');
let postcode = document.getElementById('postcode');
let dob = document.getElementById('dob');
let buildingType = document.getElementById('buildingType');
let features = document.getElementsByName('features');
let selectAllButton = document.getElementById('selectAllButton');
let textArea = document.getElementById('textArea');
let resetButton = document.getElementById('resetButton');

// Checks whether the select button should be "Select All" or "Deselect All" and
// updates it
function checkSelectDeselect () {
    if (getFeatures().length == 4) {
        document.getElementById("selectAllButton").innerHTML = "Deselect All";
    } else {
        document.getElementById("selectAllButton").innerHTML = "Select All";
    }
}

// Selects or deselects all features in the form
function selectDeselectAll(option) {
    let checkValue;
    if (option === "select") {
        checkValue = true;
    } else {
        checkValue = false;
    }

    for (let i = 0; i < features.length; i++) {
        document.getElementsByName('features')[i].checked = checkValue;
    }
    checkSelectDeselect();
}

// Returns the parsed date of the dob
function getParsedDate() {
    const splitDate = dob.value.split("/");
    return Date.parse(splitDate[1] + "/" + splitDate[0] + "/" + splitDate[2]);
}

// Returns the age from the dob
function getAge() {
    const diffInMS = Date.now() - getParsedDate();
    let age = new Date(diffInMS);
    return Math.abs(age.getUTCFullYear() - 1970);
}

// Checks the building type to decide if "a" or "an" is used in the final output
function aOrAn() {
    if (buildingType.value === "Apartment") {
        return "an"
    } 
    return "a"
}

// Returns an array of all checked features
function getFeatures() {
    let featuresArray = [];
    for (let i = 0; i < features.length; i++) {
        if (features[i].checked) {
            featuresArray.push(features[i].value);
        }
    }
    return featuresArray;
}

// Returns the string of features for the final output
function getFeatureString() {
    const featuresArray = getFeatures();

    if (featuresArray.length == 0) {
        return "no features"
    } else if (featuresArray.length == 1) {
        return featuresArray[0];
    } else if (featuresArray.length == 2){
        return featuresArray[0] + " and " + featuresArray[1];
    } else {
        let retString = "";
        for (let i = 0; i < featuresArray.length; i++) {
            if (i == featuresArray.length - 2) {
                retString += (featuresArray[i] + " and ");
            } else if (i == featuresArray.length - 1) {
                retString += featuresArray[i];
            } else {
                retString += (featuresArray[i] + ", ");
            }
        }
        return retString;
    }
}

// Function to render the page after every event
function render() {
    let err1 = checkStreetSuburb(streetName, "street");
    let err2 = checkStreetSuburb(suburb, "suburb");
    let err3 = checkPostcode();
    let err4 = checkDOB();

    const errors = [err1, err2, err3, err4];
    let errorFree = true;

    for (let i = 0; i < errors.length; i++) {
        if (errors[i]) {
            textArea.value = errors[i];
            errorFree = false;
            break;
        }
    }

    if (errorFree) {
        const output = `You are ${getAge()} years old, and your address is ${streetName.value} ` +
                        `St, ${suburb.value}, ${postcode.value}, Australia. Your building is ` +
                        `${aOrAn()} ${buildingType.value}, and it has ${getFeatureString()}`;
        
        textArea.value = output;
    }
}

// Checks whether the inputted street or suburb is valid, depending on the category
function checkStreetSuburb(element, category) {
    if (element.value.length < 3 || element.value.length > 50) {
        if (category === "street") {
            return "Please input a valid street name";
        } else {
            return "Please input a valid suburb";
        }
    }
}

// Checks whether the postcode is valid
function checkPostcode() {
    if (postcode.value.length != 4 || isNaN(+postcode.value)) {
        return "Please input a valid postcode";
    }
}

// Checks whether the date of birth is valid ie it matches the regex, can be parsed
// by the date object and is not in the future
function checkDOB() {
    regex = /[0-9]{2}\/[0-9]{2}\/[0-9]{4}/;
    if (!regex.test(dob.value)) {
        return "Please enter a valid date of birth"
    }

    if (isNaN(getParsedDate()) || getParsedDate() > Date.now()) {
        return "Please enter a valid date of birth"
    }
}

// Event listeners for streetname, suburb, postcode and dob
streetName.addEventListener('blur', (event) => {
    render();
});

suburb.addEventListener('blur', (event) => {
    render();
});

postcode.addEventListener('blur', (event) => {
    render();
});

dob.addEventListener('blur', (event) => {
    render();
});

// Event listeners for building type and features
buildingType.addEventListener('change', (event) => {
    render();
});

for (let i = 0; i < features.length; i++) {
    features[i].addEventListener('change', (event) => {
        checkSelectDeselect();
        render();
    });
}

// Event listener for select all button, makes sure deselect all is displayed when
// all the features are checked and select all is displayed otherwise
selectAllButton.addEventListener('click', (event) => {
    if (selectAllButton.innerHTML === "Select All") {
        selectDeselectAll("select")
    } else {
        selectDeselectAll("deselect")
    }
});

// Event listener for the reset button and changes select all button back to original
// state if it was previously deselect all
resetButton.addEventListener('click', (event) => {
    selectAllButton.innerHTML = "Select All"
});
