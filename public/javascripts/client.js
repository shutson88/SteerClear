var token = "";

function authenticate() {
  
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
        	var obj = JSON.parse(xhttp.responseText);


    	if(obj.success != true){
    		alert(obj.message);
    	}
    	else{
    		token = obj.token;
        window.localStorage.setItem('token', token);
        window.localStorage.setItem('username', document.getElementById("username").value);
    		window.location.assign("http://" + window.location.host + "/index");
    	}
		
      	//console.log(xhttp.responseText);
      	console.log("token: " + token);
    }
  }
  xhttp.open("POST", "http://" + window.location.host + "/api/authenticate", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("username="+document.getElementById("username").value+"&password="+document.getElementById("password").value);
}

function loadHomepage(){
	var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://localhost:8080/", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.onreadystatechange = function() { 
    if (xhttp.readyState == 4 && xhttp.status == 200){
      console.log(xhttp.responseText);
      window.location.assign("http://" + window.location.host + "/index")
    }
    //console.log("token: "+token);
    xhttp.send("token="+token);
}
}