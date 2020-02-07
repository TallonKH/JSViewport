var rootDiv;
var viewport;

$(function () {
    setupElements();
    main();
});

function setupElements() {
    rootDiv = document.getElementById("rootDiv");
}

function main() {
    viewport = new CustomViewport();
    rootDiv.appendChild(viewport.container);
    viewport.background.color = "#1a1a1a";
    // viewport.minZoomFactor = 0.25;
    // viewport.maxZoomFactor = 2;
    // viewport.pannable = true;
    // viewport.zoomSensitivity = 1;
    // viewport.panSensitivity = 0.5;
    // viewport.zoomCenter = "mouse";
    
    const grabbables = [];
    for (let i = -15; i < 15; i++) {
        const grabbable = new GrabObj(viewport, new NPoint(i*25*Math.cos(Math.abs(i) / 25), 0*Math.sin(i/10)));
        grabbable.color = colorLerp("#ff4747", "#4769ff", (i+15)/30);
        viewport.registerObj(grabbable);
    }
}

class CustomViewport extends Viewport {
    constructor({} = {}) {
        super({
            "minZoomFactor": 0.25,
            "maxZoomFactor": 4,
            "pannable": true,
            "zoomSensitivity": 1,
            "panSensitivity": 0.5,
            "zoomCenter": "mouse"
        });

        this.backgroundColor = "#1a1a1a"
    }

    onRedraw () {
        super.onRedraw();
        // console.log("asdf");
    }
}