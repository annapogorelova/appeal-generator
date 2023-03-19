actions = [
    "прибрати <acc>",
    "демонтувати <acc>",
    "посприяти демонтажу <gen>",
    "здійснити демонтаж <gen>"
]

from_object = [
    "з будинку",
    "з фасаду будинку",
    "з будівлі"
]

location_options = [
    " за адресою",
    ", що знаходиться за адресою",
    ", що знаходиться на"
]

conditioner_options = {
    "acc_single": "кондиціонер",
    "acc_mult": "кондиціонери",
    "gen_single": "кондиціонера",
    "gen_mult": "кондиціонерів"
}

antenna_options = {
    "acc_single": "антенy",
    "acc_mult": "антени",
    "gen_single": "антени",
    "gen_mult": "антен"
}

roof_options = {
    "acc_single": "дашок",
    "acc_mult": "дашки",
    "gen_single": "дашка",
    "gen_mult": "дашків"
}

tech_elements_options = {
    "acc_mult": "технічні елементи",
    "gen_mult": "технічних елементів"
}

conj = ["і", "та"]

doc_name_options = [
    "№952 від 19.10.2022",
    "№952 від 19/10/2022",
    "№952 від 10/19/2022"
];

ref_options = [
    "згідно рішення ЛМР",
    "у відповідності до рішення ЛМР",
    "згідно із рішенням ЛМР",
    "згідно з рішенням ЛМР"
];

tech_elements_addon_options = [
    "(разом з кріпленнями, дротами та іншими залишками)",
    "(разом із дротами та кріпленнями)",
    "(разом із дротами та кріпленнями, а також іншими залишками)",
    "(з кріпленнями і дротами)",
    "(з дротами та кріпленнями)"
]

greetings = ["Доброго дня!", "Доброго дня.", "Добрий день!", "Добрий день.", "Вітаю.", "Вітаю!"];
thanks = ["Дякую!", "Дякую."]


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


function selectRandom(stringsArray) {
    const randomIndex = Math.floor(Math.random() * stringsArray.length);
    return stringsArray[randomIndex];
}


function getElement(options, grammatic_case, is_multiple) {
    obj_type = is_multiple ? "mult" : "single";
    return options[`${grammatic_case}_${obj_type}`];
}


function getTechElementText(params, grammatic_case) {
    if (params["hasTechElements"]) {
        elementsText = tech_elements_options[`${grammatic_case}_mult`];
        addonText = selectRandom(tech_elements_addon_options);
        elementsText += " " + addonText;

        return elementsText;
    } else {
        elements = [];

        if (params["hasConditioner"]) {
            elements.push(getElement(conditioner_options, grammatic_case, params["hasMultipleConditioners"]));
        }

        if (params["hasAntenna"]) {
            elements.push(getElement(antenna_options, grammatic_case, params["hasMultipleAntennas"]));
        }

        if (params["hasRoof"]) {
            elements.push(getElement(roof_options, grammatic_case, params["hasMultipleRoofs"]));
        }

        rand_conj = selectRandom(conj);
        elements = shuffleArray(elements);

        elementsText = "";

        if (elements.length > 2) {
            elementsText = elements.slice(0, elements.length - 1).join(", ");
            elementsText = `${elementsText} ${rand_conj} ${elements[elements.length - 1]}`;
        } else {
            elementsText = elements.join(` ${rand_conj} `);
        }

        if (params["hasConditioner"] || params["hasAntenna"]) {
            addonText = selectRandom(tech_elements_addon_options);
            elementsText += " " + addonText;
        }

        return elementsText;
    }
}


function getReferenceText() {
    ref = selectRandom(ref_options);
    doc_name = selectRandom(doc_name_options);
    return `${ref} ${doc_name}`;
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRequestBody(params) {
    // Request
    text = "прошу";

    // Action
    action = selectRandom(actions);
    gramatic_case_regex = /<(.*)>/g;
    grammatic_case = action.match(gramatic_case_regex)[0].replace("<", "").replace(">", "");

    // Tech elements
    elementsText = getTechElementText(params, grammatic_case);
    text += " ";
    text += action.replace(gramatic_case_regex, elementsText);
    text += ` ${selectRandom(from_object)}`;

    // UNESCO
    if (params["isUnesco"]) {
        text += " - частини об'єкта Всесвітньої спадщини ЮНЕСКО (пам'ятки національного значення)";
    } else if (params["isArchitecturalMonument"]) {
        text += " - пам'ятки";
    }

    // Address
    rand_location = selectRandom(location_options);
    text += `${rand_location} ${params["address"]}`;

    return text;
}


function generateAppealText(params) {
    // Greeting
    greeting = "";
    add_greeting = selectRandom([true, false]);

    if (add_greeting) {
        greeting = selectRandom(greetings);
    }

    requestBody = getRequestBody(params);
    referenceBody = getReferenceText();

    body = shuffleArray([requestBody, referenceBody]);
    appealText = body.join(", ");
    appealText = capitalizeFirstLetter(appealText);

    if (greeting != "") {
        appealText = `${greeting} ${appealText}.`;
    } else {
        appealText += ".";
    }

    add_thanks = selectRandom([true, false]);
    if (add_thanks) {
        appealText += ' ' + selectRandom(thanks);
    }

    return appealText;
}


function copyToClipboard() {
    const messageTextArea = document.getElementById("messageBox");
    messageTextArea.select();
    document.execCommand("copy");
}
