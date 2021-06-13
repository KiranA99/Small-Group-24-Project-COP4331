<?php
    require_once 'databaseLogin.php';
    require_once 'httpPackage.php';

    // Connect to database.
    $server = new Server();
    $conn = $server->connect();

    // Retrieve the data from the HTTP Request body.
    $data = httpRequest();
    $userID = $data['user_id'];
       
    // Query for a table to return contacts for that user.
    // Order the results by last names then first.
    $query = "SELECT * FROM contacts WHERE user_id = ? ORDER BY last_name, first_name";
    $preparedStatement = $conn->prepare($query);
    $preparedStatement->bind_param("i", $userID);
    $preparedStatement->execute();
    $resultTable = $preparedStatement->get_result();

    // If there are no contacts for this user, return 404 NOT FOUND.
    if ($resultTable->num_rows < 1)
    {
        notFound();
    }
    // Otherwise return the contacts for this user with 200 OK.
    else 
    {
        $users = array();
        
        // Iterate through all the contacts and append to a nested associative array.
        for ($i = 0; $i < $resultTable->num_rows; $i++)
        {
            $row = $resultTable->fetch_assoc();
            $id = $row['id'];
            $firstName = $row['first_name'];
            $lastName = $row['last_name'];
            $phoneNumber = $row['phone_number'];
            $email = $row['email'];

            $user = array(
                'id' => $id,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'phone_number' => $phoneNumber,
                'email' => $email
            );

            array_push($users, $user);
        }

        // Store the results in an associative array to convert to JSON.
        $data = array(
            'data' => $users,
            'count' => count($users)
        );

        // Return status code 200 and JSON of the contacts for this user.
        ok();
        header("Content-Type: application/json");
        httpReponse($data);
    }

    // Close the database at end of script
    $preparedStatement->close();
    $conn->close();
    exit;
?>