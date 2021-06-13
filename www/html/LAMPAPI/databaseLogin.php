<?php
    // Class to quickly log into the database
    class Server
    {
        private $hostname;
        private $username;
        private $password;
        private $database;

        function __construct()
        {
            $this->hostname = 'localhost';
            $this->username = 'backendSquad';
            $this->password = 'password';
            $this->database = 'cop4331_24';
        }

        // Creates and returns mysqli object
        function connect()
        {
            $conn = new mysqli($this->hostname, $this->username, $this->password, $this->database);
            if ($conn->connect_error)
                die("Error connecting to database!<br>Error: $conn->connect_error");
            
            return $conn;  
        }
    }
?>