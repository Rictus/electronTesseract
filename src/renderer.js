var Dropzone = require('./dropzone.js');
var onBrowser = typeof require !== "function";
if (!onBrowser) {
    var runner = require('./ImageOCR')();
}

var domElements = {
    imageDropMainContainer: document.getElementById("imageDropMainContainer")
};

var initDropzone = function () {
    var url;
    if (onBrowser) {
        url = "/imageUpload";
    } else {
        url = "/WIP"; // WIP Which URL when using electron ?
    }
    var opts = {
        url: url,
        paramName: "image",
        acceptedFiles: "image/*",
        addRemoveLinks: true,
        success: function (file, servRes) {
            var pE = file.previewElement;
            var el = document.createElement("pre");
            el.innerHTML = "<pre style='color:black;'>" + servRes + "</pre>";
            pE.appendChild(el);
        }
    };
    new Dropzone(domElements.imageDropMainContainer, opts);
};

var initListeners = function () {
    if (typeof Dropzone === "object" || typeof Dropzone === "function") {
        initDropzone();
        console.info("Drag and drop feature initialized.");
    } else {
        console.error("Dropzone library is not loaded.");
    }
};

initListeners();