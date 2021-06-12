var urlBase = 'http://cop4331-24.com/';

// Declare fields.
var username;
var password;
var firstName;
var lastName;

// Function for when user clicks to log in.
function attemptRegister()
{
    // Reset fields.
    username = "";
	password = "";
    firstName = "";
    lastName = "";

    // Grab the username and password fields entered in the HTML.
    username = document.getElementById("username").value;
    password = document.getElementById("password").value;
	firstName = document.getElementById("first_name").value;
	lastName = document.getElementById("last_name").value;
	var confirmPass = document.getElementById("confpw").value;
    
	// Don't initiate request until the filled out fields are valid.
	if (isNotValidField(username) || isNotValidField(password) || isNotValidField(firstName) || 
		isNotValidField(lastName) || isNotValidField(confirmPass))
	{
		alert("Field is empty or too large!");
	}
	// If the password and confirm password don't match alert user.
	else if (password != confirmPass)
	{
		alert("Passwords do not match!");
	}
	else
	{
		// Hash the password before being sent out.
		password = md5(password);

		// Prepare the values for HTTP request in JSON.
		var payload = `{"username" : "${username}", "password" : "${password}", "first_name" : "${firstName}", "last_name" : "${lastName}"}`;
		var url = urlBase + 'LAMPAPI/register.php';
		var xhr = new XMLHttpRequest();

		// Create JSON HTTP Request destination.
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

		try
		{
			// This event fires anytime the readstate changes (opening HTTP Request, sending HTTP Request, etc).
			xhr.onreadystatechange = function() 
			{
				// If the ready state so happens to be 4 (4 = request finished and response is sent back), 
				// and the status code of the HTTP Response for this Request is 201 CREATED.
				if (this.readyState == 4 && this.status == 201) 
				{
					// Redirect user to successful login page.
					window.location.href = urlBase + "RRedirect.html";
				}
				// If the response header is 400 Bad Request, signal user already exists.
				else if (this.readyState == 4 && this.status == 400)
				{
					// SAY USER exists text box
             		alert("Username already exists!");
				}
			};

			xhr.send(payload);
		}
		catch (err)
		{
			alert(err.message);
		}
	}
}

// Function to determine if the register fields are valid.
function isNotValidField(str)
{
	return (!str || str.trim().length === 0 || str.trim().length > 29);
}
