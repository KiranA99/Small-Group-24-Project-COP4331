<?php
    require_once 'databaseLogin.php';
    require_once 'httpPackage.php';

    // Connect to database.
    $server = new Server();
    $conn = $server->connect();

    // Retrieve the data from the HTTP Request body.
    $data = httpRequest();
    $id = $data['id'];
     
    // Delete the contact with the selected id.
    $query = "DELETE FROM contacts WHERE id = ?";
    $preparedStatement = $conn->prepare($query);
    $preparedStatement->bind_param("i", $id);
    $preparedStatement->execute();
   
    // Return with 204 NO CONTENT HTTP header for successful deletion.
    noContent();

    // Close the database at end of script
    $preparedStatement->close();
    $conn->close();
    exit;
?>