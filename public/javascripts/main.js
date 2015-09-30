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

/*! UIkit 2.22.0 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
!function(t){"use strict";function i(i,o){return o?("object"==typeof i?(i=i instanceof jQuery?i:t.$(i),i.parent().length&&(o.persist=i,o.persist.data("modalPersistParent",i.parent()))):i="string"==typeof i||"number"==typeof i?t.$("<div></div>").html(i):t.$("<div></div>").html("UIkit.modal Error: Unsupported data type: "+typeof i),i.appendTo(o.element.find(".uk-modal-dialog")),o):void 0}var o,e=!1,n=0,s=t.$html;t.component("modal",{defaults:{keyboard:!0,bgclose:!0,minScrollHeight:150,center:!1,modal:!0},scrollable:!1,transition:!1,init:function(){if(o||(o=t.$("body")),this.element.length){var i=this;this.paddingdir="padding-"+("left"==t.langdirection?"right":"left"),this.dialog=this.find(".uk-modal-dialog"),this.active=!1,this.element.attr("aria-hidden",this.element.hasClass("uk-open")),this.on("click",".uk-modal-close",function(t){t.preventDefault(),i.hide()}).on("click",function(o){var e=t.$(o.target);e[0]==i.element[0]&&i.options.bgclose&&i.hide()})}},toggle:function(){return this[this.isActive()?"hide":"show"]()},show:function(){if(this.element.length){if(!this.isActive())return this.options.modal&&e&&e.hide(!0),this.element.removeClass("uk-open").show(),this.resize(),this.options.modal&&(e=this),this.active=!0,n++,this.element.addClass("uk-open"),s.addClass("uk-modal-page").height(),this.element.attr("aria-hidden","false"),this.element.trigger("show.uk.modal"),t.Utils.checkDisplay(this.dialog,!0),this}},hide:function(i){if(!i&&t.support.transition){var o=this;this.one(t.support.transition.end,function(){o._hide()}).removeClass("uk-open")}else this._hide();return this},resize:function(){var t=o.width();if(this.scrollbarwidth=window.innerWidth-t,o.css(this.paddingdir,this.scrollbarwidth),this.element.css("overflow-y",this.scrollbarwidth?"scroll":"auto"),!this.updateScrollable()&&this.options.center){var i=this.dialog.outerHeight(),e=parseInt(this.dialog.css("margin-top"),10)+parseInt(this.dialog.css("margin-bottom"),10);i+e<window.innerHeight?this.dialog.css({top:window.innerHeight/2-i/2-e}):this.dialog.css({top:""})}},updateScrollable:function(){var t=this.dialog.find(".uk-overflow-container:visible:first");if(t.length){t.css("height",0);var i=Math.abs(parseInt(this.dialog.css("margin-top"),10)),o=this.dialog.outerHeight(),e=window.innerHeight,n=e-2*(20>i?20:i)-o;return t.css("height",n<this.options.minScrollHeight?"":n),!0}return!1},_hide:function(){this.active=!1,n--,this.element.hide().removeClass("uk-open"),this.element.attr("aria-hidden","true"),n||(s.removeClass("uk-modal-page"),o.css(this.paddingdir,"")),e===this&&(e=!1),this.trigger("hide.uk.modal")},isActive:function(){return this.active}}),t.component("modalTrigger",{boot:function(){t.$html.on("click.modal.uikit","[data-uk-modal]",function(i){var o=t.$(this);if(o.is("a")&&i.preventDefault(),!o.data("modalTrigger")){var e=t.modalTrigger(o,t.Utils.options(o.attr("data-uk-modal")));e.show()}}),t.$html.on("keydown.modal.uikit",function(t){e&&27===t.keyCode&&e.options.keyboard&&(t.preventDefault(),e.hide())}),t.$win.on("resize orientationchange",t.Utils.debounce(function(){e&&e.resize()},150))},init:function(){var i=this;this.options=t.$.extend({target:i.element.is("a")?i.element.attr("href"):!1},this.options),this.modal=t.modal(this.options.target,this.options),this.on("click",function(t){t.preventDefault(),i.show()}),this.proxy(this.modal,"show hide isActive")}}),t.modal.dialog=function(o,e){var n=t.modal(t.$(t.modal.dialog.template).appendTo("body"),e);return n.on("hide.uk.modal",function(){n.persist&&(n.persist.appendTo(n.persist.data("modalPersistParent")),n.persist=!1),n.element.remove()}),i(o,n),n},t.modal.dialog.template='<div class="uk-modal"><div class="uk-modal-dialog" style="min-height:0;"></div></div>',t.modal.alert=function(i,o){o=t.$.extend(!0,{bgclose:!1,keyboard:!1,modal:!1,labels:t.modal.labels},o);var e=t.modal.dialog(['<div class="uk-margin uk-modal-content">'+String(i)+"</div>",'<div class="uk-modal-footer uk-text-right"><button class="uk-button uk-button-primary uk-modal-close">'+o.labels.Ok+"</button></div>"].join(""),o);return e.on("show.uk.modal",function(){setTimeout(function(){e.element.find("button:first").focus()},50)}),e.show()},t.modal.confirm=function(i,o,e){o=t.$.isFunction(o)?o:function(){},e=t.$.extend(!0,{bgclose:!1,keyboard:!1,modal:!1,labels:t.modal.labels},e);var n=t.modal.dialog(['<div class="uk-margin uk-modal-content">'+String(i)+"</div>",'<div class="uk-modal-footer uk-text-right"><button class="uk-button uk-modal-close">'+e.labels.Cancel+'</button> <button class="uk-button uk-button-primary js-modal-confirm">'+e.labels.Ok+"</button></div>"].join(""),e);return n.element.find(".js-modal-confirm").on("click",function(){o(),n.hide()}),n.on("show.uk.modal",function(){setTimeout(function(){n.element.find(".js-modal-confirm").focus()},50)}),n.show()},t.modal.prompt=function(i,o,e,n){e=t.$.isFunction(e)?e:function(){},n=t.$.extend(!0,{bgclose:!1,keyboard:!1,modal:!1,labels:t.modal.labels},n);var s=t.modal.dialog([i?'<div class="uk-modal-content uk-form">'+String(i)+"</div>":"",'<div class="uk-margin-small-top uk-modal-content uk-form"><p><input type="text" class="uk-width-1-1"></p></div>','<div class="uk-modal-footer uk-text-right"><button class="uk-button uk-modal-close">'+n.labels.Cancel+'</button> <button class="uk-button uk-button-primary js-modal-ok">'+n.labels.Ok+"</button></div>"].join(""),n),a=s.element.find("input[type='text']").val(o||"").on("keyup",function(t){13==t.keyCode&&s.element.find(".js-modal-ok").trigger("click")});return s.element.find(".js-modal-ok").on("click",function(){e(a.val())!==!1&&s.hide()}),s.on("show.uk.modal",function(){setTimeout(function(){a.focus()},50)}),s.show()},t.modal.blockUI=function(i,o){var e=t.modal.dialog(['<div class="uk-margin uk-modal-content">'+String(i||'<div class="uk-text-center">...</div>')+"</div>"].join(""),t.$.extend({bgclose:!1,keyboard:!1,modal:!1},o));return e.content=e.element.find(".uk-modal-content:first"),e.show()},t.modal.labels={Ok:"Ok",Cancel:"Cancel"}}(UIkit);