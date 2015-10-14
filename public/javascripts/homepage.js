function greeting(){
	// Check browser support
	if (typeof(Storage) !== "undefined") {
	    // Retrieve
	    document.getElementById("greeting").innerHTML = "Hello, " + sessionStorage.getItem("username");
	} else {
	    document.getElementById("greeting").innerHTML = "Welcome";
	}
}

function getAnimals(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
        	var json = "{\"animals\":"+xhttp.responseText+"}";
        	var obj = JSON.parse(json);
        	//console.log(json);
        	for(var i in obj.animals){
        		//console.log(obj.animals[i].name);
				greeting();
	        	var tableRef = document.getElementById('animal-table').getElementsByTagName('tbody')[0];

				// Insert a row in the table at the last row
				var newRow   = tableRef.insertRow(1);
				newRow.className='clickable-row';
				newRow.setAttribute("id", obj.animals[i]._id);
				// Insert a cell in the row at index 0
				var id  = newRow.insertCell(0);
				var name = newRow.insertCell(1);
				var type = newRow.insertCell(2);
				var breed = newRow.insertCell(3);

				// Append a text node to the cell
				var newText  = document.createTextNode(obj.animals[i]._id);
				id.appendChild(newText);
				newText  = document.createTextNode(obj.animals[i].name);
				name.appendChild(newText);
				newText  = document.createTextNode(obj.animals[i].type);
				type.appendChild(newText);
				newText = document.createTextNode(obj.animals[i].breed);
				breed.appendChild(newText);
        	}
    	}
    }
	xhttp.open("POST", "http://" + window.location.host + "/api/viewanimals", true); //TODO: doesn't work if I set to GET, server returns 403 Forbidden
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("token="+window.sessionStorage.getItem('token'));

}

function getAnimal(id) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			obj = JSON.parse(xhttp.responseText)[0];
			var tableRef;
			document.getElementById("greeting").innerHTML = obj.name;
			//console.log(obj._id);
			var weights;

			
			getWeights(obj._id, function(data) {
				weights = data.weights;
				//console.log(weights);
				//console.log(weights.length);
				for(var i = 0; i < weights.length; i++){
					//console.log(weights[i]);
					tableRef = document.getElementById('animal-table').getElementsByTagName('tbody')[0];
				
					// Insert a row in the table at the last row
					var newRow   = tableRef.insertRow(1);
					newRow.className='clickable-row';
					
					// Insert a cell in the row at index 0
					var idCell  = newRow.insertCell(0);
					var dateCell = newRow.insertCell(1);
					var weightCell = newRow.insertCell(2);
				
					// Append a text node to the cell
					var newText  = document.createTextNode(weights[i].id);
					idCell.appendChild(newText);
					var date = new Date(weights[i].date);
					newText  = document.createTextNode(date.toDateString());
					dateCell.appendChild(newText);
					newText  = document.createTextNode(weights[i].weight);
					weightCell.appendChild(newText);
				}				
			
			
			
			});


		}

	}
	xhttp.open("POST", "http://" + window.location.host + "/api/viewanimal", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(
		"id="+id +
		"&token="+window.sessionStorage.getItem('token'));
		


	
}





function getWeights(id, callback){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
        	var json = "{\"weights\":"+xhttp.responseText+"}";
        	var obj = JSON.parse(json);
			//console.log(obj);

			callback.apply(this, [obj]);
			
			
    	}
    }
	xhttp.open("POST", "http://" + window.location.host + "/api/viewweights", true); 
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(
		"id="+id +
		"&token="+window.sessionStorage.getItem('token'));

}