var token = "";

function login() {
  
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
      	//console.log("token: " + token);
    }
  }
  xhttp.open("POST", "http://" + window.location.host + "/api/authenticate", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("username="+document.getElementById("username").value+"&password="+document.getElementById("password").value);
}

function register() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			var obj = JSON.parse(xhttp.responseText);
			
			if(obj.success != true) {
				alert(obj.message);
			}
			else {
				
				document.getElementById("successDiv").textContent = "Successfully Registered...redirecting in 2 seconds...";
				setTimeout(function() {
					window.location.replace("http://" + window.location.host + "/index");
				}, 2000);
				
				
				
			}
		}
		
	}
	xhttp.open("POST", "http://" + window.location.host + "/register", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(
		"username="+document.getElementById("username").value + 
		"&password="+document.getElementById("password").value); 
		//TODO: modify when the user model is changed
	
}

function addanimal() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			var obj = JSON.parse(xhttp.responseText);
			
			if(obj.success != true) {
				alert(obj.message);
			}
			else {
				
				document.getElementById("successDiv").textContent = "Added successfully...redirecting in 2 seconds...";
				setTimeout(function() {
					window.location.replace("http://" + window.location.host + "/index");
				}, 2000);
				
				
				
			}
		}
		
	}	
	xhttp.open("POST", "http://" + window.location.host + "/api/addanimal", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(
		"id="+document.getElementById("id").value + 
		"&managedBy="+document.getElementById("managedBy").value +
		"&name="+document.getElementById("name").value +
		"&type="+document.getElementById("type").value +
		"&breed="+document.getElementById("breed").value +
		"&date="+document.getElementById("date").value +
		"&latestWeight="+document.getElementById("latestWeight").value +
		"&token="+window.localStorage.getItem('token')); 
		//TODO: modify when the animal model is changed	
	
	
	
}

function loadHomepage(){
	var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "http://" + window.location.host + "/index", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.onreadystatechange = function() { 
    if (xhttp.readyState == 4 && xhttp.status == 200){
     // console.log(xhttp.responseText);
      window.location.assign("http://" + window.location.host + "/index")
    }
    //console.log("token: "+token);
    xhttp.send("token="+token);
}
}