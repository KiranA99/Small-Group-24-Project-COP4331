var urlBase = 'http://cop4331-24.com/';

// Declare fields.
var id;
var firstName;
var lastName;

// Function for when user clicks to log in.
function attemptLogin()
{
    // Reset fields.
    id = 0;
    firstName = "";
    lastName = "";

    // Grab the username and password fields entered in the HTML.
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    
	// Hash the password before being sent out
	password = md5(password);

    // Prepare the values for HTTP request in JSON.
    var payload = `{"username" : "${username}", "password" : "${password}"}`;
    var url = urlBase + 'LAMPAPI/login.php';
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
                // Grab fields passed from HTTP Response body to local fields.
				var jsonObject = JSON.parse(xhr.responseText);
				id = jsonObject.id;
				firstName = jsonObject.first_name;
				lastName = jsonObject.last_name;
                
				saveCookie();

                // Change page to contacts page with registered user.
				window.location.href = "contacts.html";
			}
            // If the response header is 400 Bad Request, signal user doesn't exist.
            else if (this.readyState == 4 && this.status == 400)
            {
                alert("Username or password does not exist!");
            }
		};

		xhr.send(payload);
	}
	catch (err)
	{
		alert(err.message);
	}
}

// Cookie holds onto user info and expires in 20 minutes.
function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime() + (minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",id=" + id + ";expires=" + date.toUTCString();
}

