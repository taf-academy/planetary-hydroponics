var SIM = (function () {
	var phs = {
            messages: []
        },
        params = {
            oxygen: {
                low: 0,
                high: 100,
                value: 1
            },
            light: {
                low: 0,
                high: 100,
                value: 1
            },
            nutrients: {
                low: 0,
                high: 100,
                value: 1
            },
            water: {
                low: 0,
                high: 100,
                value: 1
            },
            planet: {
                value: "mars"
            }
        },
        plantState = {
            UNKNOWN: "UNKNOWN",
            DEAD: "DEAD",
            FEEBLE: "FEEBLE",
            ACCEPTABLE: "ACCEPTABLE",
            THRIVING: "THRIVING"
        },
        plantImages = {
            UNKNOWN: "plant_unknown.jpg",
            DEAD: "plant_dead.jpg",
            FEEBLE: "plant_feeble.jpg",
            ACCEPTABLE: "plant_acceptable.jpg",
            THRIVING: "plant_thriving.jpg"
        };

    /**
     * Collects and validates for input
     */   
	phs.collectInput = function () {
        clearImage();
        clearMessages();
        clearErrors();

        var form = document.getElementById('simInput');
        params.oxygen.value = getInt(form['oxygen'], params.oxygen.low, params.oxygen.high);
        params.light.value = getInt(form['light'], params.light.low, params.light.high);
        params.water.value = getInt(form['water'], params.water.low, params.water.high);
        params.nutrients.value = getInt(form['nutrients'], params.nutrients.low, params.nutrients.high);
        params.planet.value = getRadio(form['planetsRadios'], params.planet.value);

        if (noErrors(params)) {
            console.log("Running simulation...");
            var currentPlantState = runSimulation(params.oxygen.value, params.light.value, params.water.value, params.nutrients.value, params.planet.value);
            showImage(plantImages[currentPlantState]);
            console.log("Simulation complete.");
        }
        else {
            addMessage("Could not run simulation due to one or more errors.");
        }

        
        showMessages();

    };

    /**
     * Ensure no errors before running simulation.
     */
    function noErrors (o) {
        for (var m in o) {
            if (o.hasOwnProperty(m) && typeof o[m].value == "undefined")
                return false;
        }
        return true;
    }

    /**
     * Return the value of a radio button in given group element
     */
    function getRadio(element, def) {
        if (typeof element.value == "undefined") {
            return def;
        }
        else {
            return element.value;   
        }
    }

    /**
     * Return the value of a text field, enforce integer within range
     */
	function getInt(element, low, high, def) {
        var val = parseInt(element.value);
        if (isNaN(val) || val < low || val > high) {
            showError(element.nextElementSibling, "Please enter an integer value between " + low + " and " + high);
            return def;
        }
        else {
            return val;
        }
    }
    
    /**
     * Displays form errors
     */
    function showError(element, err) {
        element.innerHTML = err;
    }

    /**
     * Clears form errors
     */
    function clearErrors() {
        var errorSpans = document.getElementsByClassName('error');

        for (var i = 0; i < errorSpans.length; i++) {
            errorSpans[i].innerHTML = "";
        }
    }

    /**
     * Shows an image
     */
    function showImage(imageName) {
        document.getElementById('plantDisplay').innerHTML = '<img src="img/' + imageName + '"/>';
    }

    /**
     * Clears the image
     */
    function clearImage() {
        document.getElementById('plantDisplay').innerHTML = "";
    }

    /**
     * Appends a message to the output panel list
     */
    function addMessage(message) {
        phs.messages.push(message);
    }

    /**
     * Shows messages in the output panel
     */
    function showMessages() {
        var messageHTML = "";
        for (var i = 0; i < phs.messages.length; i++) {
            console.log(phs.messages[i]);
            messageHTML += '<p><span class="simMessage">' +  phs.messages[i] + '</span></p>';
        }
        document.getElementById('messagePanel').innerHTML = messageHTML;
    }

    /**
     * Clears messages from the output panel
     */
    function clearMessages() {
        phs.messages = [];
        document.getElementById('messagePanel').innerHTML = "";
    }

    /**
     * This is where you code the simulation.
     * If you add new planets, add them here,
     * and add a new function for the new planet 
     * as is done below for Mars and Titan.
     */
    function runSimulation(oxygen, light, water, nutrients, planet) {
        var currentPlantState = plantState.DEAD;

        switch (planet) {
            case "mars":
                currentPlantState = runMarsSimulation(oxygen, light, water, nutrients);
                break;

            case "titan":
                currentPlantState = runTitanSimulation(oxygen, light, water, nutrients);
                break;
        }

        switch (currentPlantState) {
            case plantState.DEAD:
                addMessage("Your plant is DEAD!");
                break;

            case plantState.FEEBLE:
                addMessage("Your plant is barely alive!");    
                break;

            case plantState.ACCEPTABLE:
                addMessage("Your plant is doing OK.");    
                break;

            case plantState.THRIVING:
                addMessage("Your plant is thriving!");
                break;

            default:
        }

        return currentPlantState;
    }

    /**
     * Returns current plant state for Mars simulation with given params
     */
    function runMarsSimulation(oxygen, light, water, nutrients) {
        var currentPlantState = plantState.DEAD;

        if (oxygen < 2) {
            addMessage("That's not enough oxygen!");
            currentPlantState = plantState.DEAD;
        }

        if (oxygen > 1 && water > 1 && nutrients > 1 && light > 1) {
            addMessage("Everything looks great.");
            currentPlantState = plantState.THRIVING;
        }

        return currentPlantState;
    }

    /**
     * Returns current plant state for Titan simulation with given params
     */
    function runTitanSimulation(oxygen, light, water, nutrients) {
        var currentPlantState = plantState.DEAD;

        if (water < 2) {
            addMessage("That's not enough water!");
            currentPlantState = plantState.FEEBLE;
        }

        if (oxygen > 1 && water > 1 && nutrients > 1 && light > 1) {
            addMessage("Everything looks great!");
            currentPlantState = plantState.THRIVING;
        }

        return currentPlantState;
    }

	return phs;
}());