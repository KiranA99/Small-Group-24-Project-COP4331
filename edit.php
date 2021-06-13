<?php
    require_once 'databaseLogin.php';
    require_once 'httpPackage.php';

    // Connect to database.
    $server = new Server();
    $conn = $server->connect();

    // Retrieve the data from the HTTP Request body.
    $data = httpRequest();
    $id = $data['id'];
    $userID = $data['user_id'];
    $firstName = $data['first_name'];
    $lastName = $data['last_name'];
    $phoneNumber = $data['phone_number'];
    $email = $data['email'];

    // Assumes: The edited contact has pre-filled values that populate with their current data.
    $query = "UPDATE contacts SET first_name = ?, last_name = ?, phone_number = ?, email = ? WHERE id = ? AND user_id = ?";
    $preparedStatement = $conn->prepare($query);
    $preparedStatement->bind_param("ssssii", $firstName, $lastName, $phoneNumber, $email, $id, $userID);
    $preparedStatement->execute();
    
    // Return with 204 NO CONTENT HTTP header for successful update.
    noContent();
    
    // Close the database at end of script
    $preparedStatement->close();
    $conn->close();
    exit;
?>