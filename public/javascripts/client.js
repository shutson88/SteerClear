var token = "";

function authenticate() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
    	console.log(document.getElementById("username").value);
    	var obj = JSON.parse(xhttp.responseText);

    	if(obj.success != true){
    		alert(obj.message);
    	}
    	else{
    		token = obj.token;
			window.localStorage.setItem('token', token);
    		loadHomepage();
    	}
		
      	//console.log(xhttp.responseText);
      	//console.log("token: " + token);
    }
  }
  xhttp.open("POST", "http://localhost:8080/api/authenticate", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("username="+document.getElementById("username").value+"&password="+document.getElementById("password").value);
}

function loadHomepage(){
	var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:8080/api/", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.onreadystatechange = function() { 
    if (xhttp.readyState == 4 && xhttp.status == 200){
      callback(xhttp.responseText);
    }
  }
  console.log("token: "+token);
  xhttp.send("token="+token);
}