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
		"&password="+document.getElementById("password").value +
        "&first_name="+document.getElementById("first_name").value +
        "&last_name="+document.getElementById("last_name").value +
        "&email="+document.getElementById("email").value);
		
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
		"&token="+window.localStorage.getItem('token'));
		



}

function getCurrentDate() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;
	var yyyy = today.getFullYear();
	
	if(dd < 10) {
		dd='0' + dd;
	}
	if(mm < 10) {
		mm='0' + mm;
	}
	today = mm+'/'+dd+'/'+yyyy;
	document.getElementById("date").value = today;
	
	
}

function addWeight() {
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
	xhttp.open("POST", "http://" + window.location.host + "/api/addweight", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(
		"id="+document.getElementById("id").value +
		"&weight="+document.getElementById("weight").value +
		"&date="+document.getElementById("date").value +
		"&token="+window.localStorage.getItem('token'));
	
	
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
