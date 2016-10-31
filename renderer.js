var runner = require('./runner')();
var el = document.getElementById("imageDropInput");

var imgShow = {
    container: document.getElementsByClassName('imageDrop-imgCont')[0],
    element: document.getElementsByClassName('imageDrop-img')[0],
    putImage: function (path) {
        this.element.setAttribute('src', path);
        if (!this.container.classList.contains("active")) {
            this.container.classList.add("active");
        }
    }
};


function processFile(file) {
    console.log(file);
    runner.getText(file.path, file.name);
}

var initDragNDrop = function () {
    if ('draggable' in document.createElement('span')) {

    } else {
        console.info("The drag and drop feature is not supported.");
    }
};


initDragNDrop();
el.addEventListener('change', function () {
    if (el.files.length > 0) {
        processFile(el.files[0]);
    }
});