<?php
    require_once 'databaseLogin.php';
    require_once 'httpPackage.php';

    // Connect to database.
    $server = new Server();
    $conn = $server->connect();

    // Retrieve the data from the HTTP Request body.
    $data = httpRequest();
    $userID = $data['user_id'];
     
    // Delete all contacts for this user.
    $query = "DELETE FROM contacts WHERE user_id = ?";
    $preparedStatement = $conn->prepare($query);
    $preparedStatement->bind_param("i", $userID);
    $preparedStatement->execute();
   
    // Return with 204 NO CONTENT HTTP header for successful deletion.
    noContent();

    // Close the database at end of script
    $preparedStatement->close();
    $conn->close();
    exit;
?>