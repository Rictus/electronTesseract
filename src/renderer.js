if (typeof require === "function") {
    //NodeJS
    var runner = require('./ImageOCR')();
} else {
    //Classic HTML
    console.info("The on-browser feature is not available yet.");
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
        if (domElements.input.files.length > 0) {
            var file = domElements.input.files[0];
            domElements.putImage(file.path);
            domElements.setLoading();
            runner.getText(file.path, file.name, function (txt) {
                this.unsetLoading();
                domElements.putText(txt);
            });
        } else {
            // TODO Show error to user
            console.error("No file selected.");
        }
    }
};

var initListeners = function () {
    if ('draggable' in domElements.elementExample) {

    } else {
        console.info("The drag and drop feature is not supported.");
    }

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
};

initListeners();