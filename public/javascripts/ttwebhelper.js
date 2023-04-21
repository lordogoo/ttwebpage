function openCloseButton(elementname,buttonname){
	let obj = document.getElementById(elementname);
	let button = document.getElementById(buttonname);
	if(obj != undefined){
		if(obj.style.display == "none"){
			obj.style.display = "";
			button.innerHTML = "&#8744;";
		}else{
			obj.style.display = "none";
			button.innerHTML = "&#62;";
		}
	}
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function openCloseLoadWithCookie(elementname,buttonname){
	let obj = document.getElementById(elementname);
	let button = document.getElementById(buttonname);
	let value = getCookie(elementname);
	if(value != "true"){
		obj.style.display = "";
		button.innerHTML = "&#8744;";
	}else{
		obj.style.display = "none";
		button.innerHTML = "&#62;";
	}
}

function openCloseButtonWithCookie(elementname,buttonname){
	let obj = document.getElementById(elementname);
	let button = document.getElementById(buttonname);
	if(obj != undefined){
		if(obj.style.display == "none"){
			obj.style.display = "";
			button.innerHTML = "&#8744;";
			document.cookie = elementname + "=false"
		}else{
			obj.style.display = "none";
			button.innerHTML = "&#62;";
			document.cookie = elementname + "=true"
		}
	}
}