var urlBase = 'http://cop4331-24.com/';

// Declare user fields.
var userID;
var userFirstName;
var userLastName;

// Reads from cookie and sets the values for that users id and name.
function readCookie()
{
    // Reset id and names to ensure grabbing from cookie source.
	userID = -1;
	userFirstName = "";
	userLastName = "";

    // Split the cookie string by its separator ;.
	var data = document.cookie;
	data = data.split(",");

    // Iterate through each key-value.
	for (var i = 0; i < data.length; i++) 
	{
        // Split the key-val into key [0] and value [1].
		var keyVal = data[i].trim();
		keyVal = keyVal.split("=");

        // Assign the variable value depending the key.
		if (keyVal[0] == "firstName")
		{
			userFirstName = keyVal[1];
		}
		else if (keyVal[0] == "lastName")
		{
			userLastName = keyVal[1];
		}
		else if (keyVal[0] == "id")
		{
			userID = parseInt(keyVal[1].trim());
		}
	}
	
    // If cookie didn't store a proper user or expired then redirect user to login.
	if (userID < 0)
	{
		window.location.href = "login.html";
	}
    // Display logged in users name.
	else
	{
		document.getElementById("loggedUser").innerHTML = "Hello, " + userFirstName + " " + userLastName;
	}
}

// Logs user out.
function logout()
{
    // Clear user fields held.
	userID = -1;
	userFirstName = "";
	userLastName = "";

    // Clear cookies by setting date to previous time.
	document.cookie = "firstName=,lastName=,id=;expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Relocate user to login page.
	window.location.href = "login.html";
}

// Function to search and display filtered contact list.
function search()
{
	var searchKey = document.getElementById("query").value;

	// Prepare the values for HTTP request in JSON.
    var payload = `{"user_id" : "${userID}", "search_key" : "${searchKey}"}`;
	
    var url = urlBase + 'LAMPAPI/search.php';
    var xhr = new XMLHttpRequest();

    // Create JSON HTTP Request destination.
    xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
	{
        // This event fires anytime the readstate changes (opening HTTP Request, sending HTTP Request, etc).
		xhr.onreadystatechange = function() 
		{
            // If the ready state so happens to be 4 (4 = request finished, response is ready), 
            // and the status code of the HTTP Response for this Request is 200 OK.
			if (this.readyState == 4 && this.status == 200) 
			{
				// Clear the table contents if it has pre-existing rows.
				document.getElementById('contactsTable').getElementsByTagName('tbody')[0].innerHTML = '';

                // Grab fields passed from HTTP Response body to local fields.
				var jsonObject = JSON.parse(xhr.responseText);
				var count = jsonObject.count; 

				// Traverse the nested JSON to get all the values returned.
				for (let i = 0; i < count; i++)
				{
					var id = jsonObject.data[i].id;
					var firstName = jsonObject.data[i].first_name;
					var lastName = jsonObject.data[i].last_name;
					var phoneNumber = jsonObject.data[i].phone_number;
					var email = jsonObject.data[i].email;

					// Insert the received data into the table.
					insertRow(id, firstName, lastName, phoneNumber, email);
				}
			}
			// If no contacts are found alert users.
			else if (this.readyState == 4 && this.status == 404)
			{
				document.getElementById('contactsTable').getElementsByTagName('tbody')[0].innerHTML = '<td></td><td></td><td>No contacts found</td>';
			}
		};

		xhr.send(payload);
	}
	catch (err)
	{
		alert(err.message);
	}
}	

// Function to add a contact.
function addContact()
{
	// Declare add fields.
	var addFirstName = document.getElementById("addFirst").value;
	var addLastName = document.getElementById("addLast").value;
	var addPhoneNumber = document.getElementById("addPhone").value;
	var addEmail = document.getElementById("addEmail").value;

	// Exit if the fields are invalid
	if (!isValidContact(addFirstName, addLastName, addEmail, addPhoneNumber))
	{
		alert("Fields are empty or too large!");
		return;
	}

	// Prepare the values for HTTP request in JSON.
    var payload = `{"user_id" : "${userID}", "first_name" : "${addFirstName}", 
		 "last_name" : "${addLastName}", "phone_number" : "${addPhoneNumber}", "email" : "${addEmail}"}`;

	// Remove the escape characters.
	payload = payload.replace(/[\r\n\t]/g, "");

	var url = urlBase + 'LAMPAPI/add.php';
    var xhr = new XMLHttpRequest();

    // Create JSON HTTP Request destination.
    xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
	{
        // This event fires anytime the readstate changes (opening HTTP Request, sending HTTP Request, etc).
		xhr.onreadystatechange = function() 
		{
            // If the ready state so happens to be 4 (4 = request finished, response is ready), 
            // and the status code of the HTTP Response for this Request is 201 CREATED.
			if (this.readyState == 4 && this.status == 201) 
			{
				// Refresh table to see newly added contact.
				search();

				// Clear the add contact fields.
				addFirstName = "";
				addLastName = "";
				addPhoneNumber = "";
				addEmail = "";
				document.getElementById("addFirst").value = "";
				document.getElementById("addLast").value = "";
				document.getElementById("addPhone").value = "";
				document.getElementById("addEmail").value = "";
			}
			// Otherwise, contact already exists with same number/email.
			else if (this.readyState == 4 && this.status == 400)
			{
				alert("Contact already exists with same email or number!");
			}
		};

		xhr.send(payload);
	}
	catch (err)
	{
		alert(err.message);
	}
}

// Function to delete a contact.
function deleteContact(buttonInstance)
{
	// Notify user if they're sure to delete.
	if (!confirm("Are you sure you want to delete this contact?"))
	{
		return;
	}

	// Get row and the row data from located button.
	row = buttonInstance.closest('tr');
	var id = row.cells[5].innerHTML;
	
	// Prepare the values for HTTP request in JSON.
	var payload = `{"id" : "${id}"}`;
	
	var url = urlBase + 'LAMPAPI/delete.php';
	var xhr = new XMLHttpRequest();

	// Create JSON HTTP Request destination.
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		// This event fires anytime the readstate changes (opening HTTP Request, sending HTTP Request, etc).
		xhr.onreadystatechange = function() 
		{
			// If the ready state so happens to be 4 (4 = request finished, response is ready), 
			// and the status code of the HTTP Response for this Request is 204 No Content.
			if (this.readyState == 4 && this.status == 204) 
			{
				// Refresh table to see newly deleted contact.
				search();
			}
		};

		xhr.send(payload);
	}
	catch (err)
	{
		alert(err.message);
	}
}

// Function to insert the content into the table.
function insertRow(id, firstName, lastName, phoneNumber, email)
{
	var tableRef = document.getElementById("contactsTable").getElementsByTagName('tbody')[0];
	
	// Add a new row and insert HTML data into it.
	var newRow = tableRef.insertRow(tableRef.rows.length);
	newRow.innerHTML = `<td>${firstName}</td>
						<td>${lastName}</td>
						<td>${phoneNumber}</td>
						<td>${email}</td>
						<td>
                          <button type="button" class="edit-btn" onclick="openPopup(this);"><i class="material-icons">edit</i></button>   
                          <button type="button" class="deletebtn" onclick="deleteContact(this);"><i class="material-icons">person_remove</i></button>
                        </td>
						<td style="display:none;">${id}</td>`;
}


// Declare edit fields.
var editID;
var editFirstName;
var editLastName;
var editPhoneNumber;
var editEmail;
var row;

// Function to open the edit pop on the specified row.
function openPopup(buttonInstance)
{
	// Get row and the row data from located button.
	row = buttonInstance.closest('tr');
	editID = row.cells[5].innerHTML;
	editFirstName = row.cells[0].innerHTML;
	editLastName = row.cells[1].innerHTML;
	editPhoneNumber = row.cells[2].innerHTML;
	editEmail = row.cells[3].innerHTML;

	// Display the edit popup.
	document.getElementById("edit_popup").style.display="block";

	// Prefill the fields with that rows data onto the edit popup.
	document.getElementById("editFirst").value = editFirstName;
	document.getElementById("editLast").value = editLastName;
	document.getElementById("editPhone").value = editPhoneNumber;
	document.getElementById("editEmail").value = editEmail;
}

// Function to confirm edit changes to a row.
function confirmEdit()
{
	// Grab the values from the input text.
	editFirstName = document.getElementById("editFirst").value;
	editLastName = document.getElementById("editLast").value;
	editPhoneNumber = document.getElementById("editPhone").value;
	editEmail = document.getElementById("editEmail").value;

	// Exit if the fields are invalid
	if (!isValidContact(editFirstName, editLastName, editEmail, editPhoneNumber))
	{
		alert("Fields are empty or too large!");
		return;
	}

	// Prepare the values for HTTP request in JSON.
    var payload = `{"user_id" : "${userID}", "id" : "${editID}", "first_name" : "${editFirstName}", 
		 "last_name" : "${editLastName}", "phone_number" : "${editPhoneNumber}", "email" : "${editEmail}"}`;

	// Remove the escape characters.
	payload = payload.replace(/[\r\n\t]/g, "");
	
    var url = urlBase + 'LAMPAPI/edit.php';
    var xhr = new XMLHttpRequest();

    // Create JSON HTTP Request destination.
    xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
	{
        // This event fires anytime the readstate changes (opening HTTP Request, sending HTTP Request, etc).
		xhr.onreadystatechange = function() 
		{
            // If the ready state so happens to be 4 (4 = request finished, response is ready), 
            // and the status code of the HTTP Response for this Request is 204 NO CONTENT.
			if (this.readyState == 4 && this.status == 204) 
			{
				// Change the values of the edited row.
				row.cells[5].innerHTML = editID;
				row.cells[0].innerHTML = editFirstName;
				row.cells[1].innerHTML = editLastName;
				row.cells[2].innerHTML = editPhoneNumber;
				row.cells[3].innerHTML = editEmail;
				
				// Close the edit pop up.
				closePopup();
			}
		};

		xhr.send(payload);
	}
	catch (err)
	{
		alert(err.message);
	}
}

// Function to close the edit popup.
function closePopup()
{
	// Clear the fields and close the popup.
	document.getElementById("editFirst").value = "";
	document.getElementById("editLast").value = "";
	document.getElementById("editPhone").value = "";
	document.getElementById("editEmail").value = "";
	editID = "";
	editFirstName = "";
	editLastName = "";
	editPhoneNumber = "";
	editEmail = "";
	document.getElementById("edit_popup").style.display="none";
}

// Function to delete all the contacts for a user.
function deleteAllContacts()
{
	// Notify user if they're sure to delete.
	if (!confirm("Are you sure you want to delete all contacts?"))
	{
		return;
	}

	// Prepare the values for HTTP request in JSON.
	var payload = `{"user_id" : "${userID}"}`;
	
	var url = urlBase + 'LAMPAPI/deleteAll.php';
	var xhr = new XMLHttpRequest();

	// Create JSON HTTP Request destination.
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		// This event fires anytime the readstate changes (opening HTTP Request, sending HTTP Request, etc).
		xhr.onreadystatechange = function() 
		{
			// If the ready state so happens to be 4 (4 = request finished, response is ready), 
			// and the status code of the HTTP Response for this Request is 204 No Content.
			if (this.readyState == 4 && this.status == 204) 
			{
				// Refresh table to see newly cleared contacts.
				search();
			}
		};

		xhr.send(payload);
	}
	catch (err)
	{
		alert(err.message);
	}
}

// Function to determine if contact fields are valid.
function isValidContact(firstName, lastName, email, phoneNumber)
{
	return (firstName && firstName.trim().length !== 0 && firstName.trim().length < 29) &&
		(lastName && lastName.trim().length !== 0 && lastName.trim().length < 29) &&
		(email && email.trim().length !== 0 && email.trim().length < 44) &&
		(phoneNumber && phoneNumber.trim().length !== 0 && phoneNumber.trim().length < 19);
}
