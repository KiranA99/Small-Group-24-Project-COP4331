<?php
    require_once 'databaseLogin.php';
    require_once 'httpPackage.php';

    // Connect to database.
    $server = new Server();
    $conn = $server->connect();

    // Retrieve the data from the HTTP Request body.
    $data = httpRequest();
    $firstName = $data['first_name'];
    $lastName = $data['last_name'];
    $phoneNumber = $data['phone_number'];
    $email = $data['email'];
    $userID = $data['user_id'];

    // Act if the fields are not empty/whitespaces.
    if (trim($firstName) != '' && trim($lastName) != '' && trim($phoneNumber) != '' && trim($email) != '')
    {        
        // Query for a table to see if the phone/email already exists for that user.
        $query = "SELECT * FROM contacts WHERE (phone_number = ? OR email = ?) AND (user_id = ?)";
        $preparedStatement = $conn->prepare($query);
        $preparedStatement->bind_param("ssi", $phoneNumber, $email, $userID);
        $preparedStatement->execute();
        $resultTable = $preparedStatement->get_result();

        // If the user doesn't exist, insert into to table successfully.
        if ($resultTable->num_rows < 1)
        {
            $query = "INSERT INTO contacts(first_name, last_name, phone_number, email, user_id) VALUES(?, ?, ?, ?, ?)";
            $preparedStatement = $conn->prepare($query);
            $preparedStatement->bind_param("ssssi", $firstName, $lastName, $phoneNumber, $email, $userID);
            $preparedStatement->execute();

            // Returns HTTP header 201 CREATED
            created();
        }
        // Otherwise return HTTP header 400 BAD REQUEST as contact already exists for current user.
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