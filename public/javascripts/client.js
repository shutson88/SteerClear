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
			window.sessionStorage.setItem('token', token);
			window.sessionStorage.setItem('username', document.getElementById("username").value);
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

function logout() {
	window.sessionStorage.removeItem("animalID");
	window.sessionStorage.removeItem('token');
	window.location.assign("http://" + window.location.host + "/index");
}

function checkToken(callback) {
    var token = window.sessionStorage.getItem('token');
    if(token) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {

			if(xhttp.readyState == 4) {
                var json = JSON.parse(xhttp.responseText)
                if(json.success === false) {
					alert("token expired");
					
					window.location.replace("http://" + window.location.host + '/signin');
					if(callback) callback();
					
                }
				if(callback) callback();
            }
		
        }
		xhttp.open("POST", "http://" + window.location.host + "/api/checktoken", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send("token="+token);
       
    } else {
        console.log("http://" + window.location.host + '/signin');
        window.location.assign("http://" + window.location.host + '/signin');
    }	
	
	
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
				window.location.assign("http://" + window.location.host + "/index");

				



			}
		}

	}
	var managedBy;
	if(document.getElementById("managedBy")) {
		managedBy = document.getElementById("managedBy").value;
	} else {
		managedBy = sessionStorage.getItem("username");
	}

	if(!document.getElementById("id").value ||
		!document.getElementById("name").value ||
		!document.getElementById("type").value ||
		!document.getElementById("breed").value) {
				
		console.log("Missing info, can't add!");
	} else {
		xhttp.open("POST", "http://" + window.location.host + "/api/addanimal", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send(
			"id="+document.getElementById("id").value +
			"&managedBy="+managedBy +
			"&name="+document.getElementById("name").value +
			"&type="+document.getElementById("type").value +
			"&breed="+document.getElementById("breed").value +
			"&token="+window.sessionStorage.getItem('token'));		
	}

	

		



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
	return today;
	//document.getElementById("date").value = today;
	
	
}

function addweight() {
	var xhttp = new XMLHttpRequest();
	var id = document.getElementById("id").value;
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			var obj = JSON.parse(xhttp.responseText);

			if(obj.success != true) {
				alert(obj.message);
			}
			else {
				window.location.replace("http://" + window.location.host + "/animal?id=" + id);
				//document.getElementById("successDiv").textContent = "Added successfully...redirecting in 2 seconds...";
				//setTimeout(function() {
				//	window.location.replace("http://" + window.location.host + "/index");
				//}, 2000);



			}
		}

	}
	if(!document.getElementById("id").value ||
		!document.getElementById("date").value ||
		!document.getElementById("weight").value) {
				
		console.log("Missing info, can't add!");
	} else {
		xhttp.open("POST", "http://" + window.location.host + "/api/addweight", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhttp.send(
			"id="+id +
			"&weight="+document.getElementById("weight").value +
			"&date="+document.getElementById("date").value +
			"&token="+window.sessionStorage.getItem('token'));		
	}

	
	
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
