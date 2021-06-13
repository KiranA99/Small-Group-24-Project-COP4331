<?php
    require_once 'databaseLogin.php';
    require_once 'httpPackage.php';

    // Connect to database.
    $server = new Server();
    $conn = $server->connect();

    // Retrieve the data from the HTTP Request body.
    $data = httpRequest();
    $username = $data['username'];
    $password = $data['password'];
    $firstName = $data['first_name'];
    $lastName = $data['last_name'];

    // Act if the username and password fields are not empty/whitespaces.
    if (trim($username) != '' && trim($password) != '')
    {        
        // Query for a table to see if the user/pass already exists.
        $query = "SELECT * FROM users WHERE username = ? AND password = ?";
        $preparedStatement = $conn->prepare($query);
        $preparedStatement->bind_param("ss", $username, $password);
        $preparedStatement->execute();
        $resultTable = $preparedStatement->get_result();

        // If the user doesn't exist, insert into to table successfully.
        if ($resultTable->num_rows < 1)
        {
            $query = "INSERT INTO users(username, password, first_name, last_name) VALUES(?, ?, ?, ?)";
            $preparedStatement = $conn->prepare($query);
            $preparedStatement->bind_param("ssss", $username, $password, $firstName, $lastName);
            $preparedStatement->execute();

            // Returns HTTP header 201 CREATED
            created();
        }
        // Otherwise return HTTP header 400 BAD REQUEST as user already exists.
        else 
        {
            badRequest();
        }
    }

    // Close the database at end of script
    $preparedStatement->close();
    $conn->close();
    exit;
?>