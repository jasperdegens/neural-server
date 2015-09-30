$(document).ready(function() {
  // fileDropInit();
  $('.drop-area').find('input').change(function(e){
    readURL(e.target);
  });
});

function readURL(input) {
  console.log(input);
  var name = $(input).attr('name');
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $('#'+name).css('background', 'url('+e.target.result+')')
                 .addClass('active');
      console.log(e.target);
    };

    reader.readAsDataURL(input.files[0]);
  }
}


//
// initialize
function fileDropInit() {

  var filedrags = $('.drop-area');
  console.log(filedrags);

  
  for (var i = 0; i < filedrags.length; i++) {
  // add handlers to all filedrops
    filedrags[i].addEventListener("dragover", FileDragHover, false);
    filedrags[i].addEventListener("dragleave", FileDragHover, false);
    filedrags[i].addEventListener("drop", FileSelectHandler, false);
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
  console.log(e);
  $(e.target).find("input").prop("file", e.dataTransfer.files[0]);
  e.preventDefault();


  // // fetch FileList object
  // var files = e.target.files || e.dataTransfer.files;

  // // process all File objects
  // for (var i = 0, f; f = files[i]; i++) {
  //   ParseFile(f);
  // }

}
