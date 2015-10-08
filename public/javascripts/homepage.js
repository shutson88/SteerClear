function greeting(){
	// Check browser support
	if (typeof(Storage) !== "undefined") {
	    // Retrieve
	    document.getElementById("greeting").innerHTML = "Hello, " + localStorage.getItem("username");
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
        	console.log(json);
        	for(var i in obj.animals){
        		console.log(obj.animals[i].name);

	        	var tableRef = document.getElementById('animal-table').getElementsByTagName('tbody')[0];

				// Insert a row in the table at the last row
				var newRow   = tableRef.insertRow(tableRef.rows.length);
				newRow.className='clickable-row';

				// Insert a cell in the row at index 0
				var id  = newRow.insertCell(0);
				var name = newRow.insertCell(1);
				var lastWeight = newRow.insertCell(2);

				// Append a text node to the cell
				var newText  = document.createTextNode(obj.animals[i].id);
				id.appendChild(newText);
				newText  = document.createTextNode(obj.animals[i].name);
				name.appendChild(newText);
				newText  = document.createTextNode(obj.animals[i].latestWeight);
				lastWeight.appendChild(newText);
        	}
    	}
    }
	xhttp.open("POST", "http://" + window.location.host + "/api/viewanimals", true); //TODO: doesn't work if I set to GET, server returns 403 Forbidden
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send("token="+window.localStorage.getItem('token'));

}