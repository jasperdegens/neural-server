function Init(){var e=document.getElementsByClassName("filedrag"),r=new XMLHttpRequest;if(r.upload)for(var a=0;a<e.length;a++)filedrag[a].addEventListener("dragover",FileDragHover,!1),filedrag[a].addEventListener("dragleave",FileDragHover,!1),filedrag[a].addEventListener("drop",FileSelectHandler,!1)}function FileDragHover(e){e.stopPropagation(),e.preventDefault(),e.target.className="dragover"==e.type?"hover":""}function FileSelectHandler(e){FileDragHover(e)}window.File&&window.FileList&&window.FileReader&&Init();