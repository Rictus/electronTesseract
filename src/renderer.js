var onBrowser = typeof require !== "function";
if (!onBrowser) {
    var runner = require('./ImageOCR')();
}

var domElements = {
    container: document.getElementsByClassName('imageDrop-mainContainer')[0],
    input: document.getElementById("imageDropInput"),
    imgContainer: document.getElementsByClassName('imageDrop-imgCont')[0],
    text: document.getElementsByClassName('imageDrop-textFound')[0],
    img: document.getElementsByClassName('imageDrop-img')[0],
    elementExample: document.createElement('span'),
    retryButton: document.getElementsByClassName('retryButton')[0],
    launchButton: document.getElementsByClassName('launchButton')[0],
    form: document.getElementsByClassName('imageDrop-form')[0],
    textExplain: document.getElementsByClassName('imageDrop-explain')[0],
    putImage: function (path) {
        this.img.setAttribute('src', path);
        this.container.classList.add("imageSelected");
    },
    putText: function (textFound) {
        if (typeof textFound === "string" && textFound.length > 0) {
            this.text.innerHTML = textFound;
            this.container.classList.add("textFound");
        } else {
            console.log("No text found.");
        }
    },
    setLoading: function () {
        this.container.classList.add("loading");
    },
    unsetLoading: function () {
        this.container.classList.remove("loading");
    },
    retry: function () {
        this.unsetLoading();
        this.img.setAttribute('src', '');
        this.container.classList.remove("imageSelected");
        this.container.classList.remove("textFound");
    },
    launch: function () {
        var that = this;
        if (domElements.input.files.length > 0) {
            var file = domElements.input.files[0];
            domElements.putImage(file.path);
            domElements.setLoading();
            runner.getText(file.path, file.name, function (txt) {
                that.unsetLoading();
                domElements.putText(txt);
            });
        } else {
            console.error("No file selected.");
        }
    }
};

var initDropzone = function () {
    Dropzone.options.imageDropMainContainer = {
        url: "/imageUpload",
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
};

var initListeners = function () {
    if (typeof Dropzone === "object" || typeof Dropzone === "function") {
        initDropzone();
        console.info("Drag and drop feature initialized.");
    } else {
        console.error("Dropzone library is not loaded.");
    }

    if (!onBrowser) {
        domElements.launchButton.addEventListener('click', function () {
            domElements.launch();
        });
        domElements.retryButton.addEventListener('click', function () {
            domElements.retry();
        });
        domElements.input.addEventListener('change', function () {
            var file = domElements.input.files[0];
            console.log(file);
            domElements.putImage(file.path);
        });
    }
};

initListeners();