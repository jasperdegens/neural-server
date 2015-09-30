var modal = UIkit.modal('.uk-modal');
var $progressBar = $('.uk-progress-bar');


$(document).ready(function() {
  // fileDropInit();
  
  //populate preview of uploaded images
  $('.drop-area').find('input').change(function(e){
    readURL(e.target);
  });

  //ajax form submit
  $('form').on('submit', function(e){
    // show modal
    modal.show();

    e.preventDefault();
    $form = $(e.target);
    var url = $form.attr('action');
    // var data = $form.serialize();
    var formData = new FormData();

    $form.find(':input').not('button').each(function(){
      //check if file 
      console.log(this);
      var $elem = $(this);
      if ($elem.attr('type') === 'file') {
        var file = $('[name='+$elem.attr('name'))[0].files[0];
        formData.append($elem.attr('name'), file);
      } else {
        formData.append($elem.attr('name'), $elem.val());
      }
    });
    $.ajax({
        url: url,
        type: 'POST',
        xhr: function() {  // Custom XMLHttpRequest
            var myXhr = $.ajaxSettings.xhr();
            if(myXhr.upload){ // Check if upload property exists
                myXhr.upload.addEventListener('progress',uploadProgress, false);
            }
            return myXhr;
        },
        success: uploadComplete,
        error: uploadFail,
        data: formData,
        //Options to tell jQuery not to process data or worry about content-type.
        cache: false,
        contentType: false,
        processData: false
    });
  });
});

function uploadProgress(e){
  var percent = Math.floor((e.loaded * 100) / e.total) + '%';
  if (percent === '100%') { percent = '99%';}
  $progressBar.css('width', percent).html(percent);
}

function uploadFail(){
  $progressBar.parent().addClass('uk-progress-danger');
  $('.modal-title').fadeOut(1000, function(){
    $(this).text('Something went wrong...').fadeIn(1000);
  });
  setTimeout(function(){
    modal.hide();
    redirect('/');
  }, 5000);
}

function uploadComplete(){
  $progressBar.css('width', '100%').html('100%');
  $progressBar.parent().addClass('uk-progress-success');
  $('.uk-modal-dialog h3').fadeOut(1000);
  $('.modal-title').fadeOut(1000, function(){
    $(this).text('Success!').fadeIn(1000);
  });
  setTimeout(function(){
    modal.hide();
    redirect('/');
  }, 5000);
}

function redirect(path){
  setTimeout(function(){window.location.replace(path);}, 200);
}


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
