
// call initialization file
if (window.File && window.FileList && window.FileReader) {
  Init();
}

//
// initialize
function Init() {

  var filedrags = document.getElementsByClassName('filedrag');


  // is XHR2 available?
  var xhr = new XMLHttpRequest();
  if (xhr.upload) {
  
    for (var i = 0; i < filedrags.length; i++) {
    // add handlers to all filedrops
      filedrag[i].addEventListener("dragover", FileDragHover, false);
      filedrag[i].addEventListener("dragleave", FileDragHover, false);
      filedrag[i].addEventListener("drop", FileSelectHandler, false);
    }
  }
}

// file drag hover
function FileDragHover(e) {
  e.stopPropagation();
  e.preventDefault();
  e.target.className = (e.type == "dragover" ? "hover" : "");
}

// file selection
function FileSelectHandler(e) {

  // cancel event and hover styling
  FileDragHover(e);

  // // fetch FileList object
  // var files = e.target.files || e.dataTransfer.files;

  // // process all File objects
  // for (var i = 0, f; f = files[i]; i++) {
  //   ParseFile(f);
  // }

}
