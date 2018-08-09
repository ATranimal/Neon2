import CF009_MEI from "./CF009.mei";
import CF009_BG from "./CF009.png";
import CF018_MEI from "./CF018.mei";
import CF018_BG from "./CF018.png";

/**
 * Pages that can be loaded.
 * @type {{name: string, mei: string, img: string}[]}
 */
const selectionOptions = [
    {
        name: "CF009",
        mei: CF009_MEI,
        img: CF009_BG
    },
    {
        name: "CF018",
        mei: CF018_MEI,
        img: CF018_BG
    }
];

let selector = document.getElementById("page-selector");
selectionOptions.forEach(option => {
    var elem = document.createElement('option');
    elem.setAttribute("value", '{"mei":"' + option.mei + '","img":"' + option.img + '"}');
    elem.innerHTML = option.name;
    selector.appendChild(elem);
});
