<?php
    // Function that grabs HTTP request converted into an associative array
    function httpRequest()
    {
        return json_decode(file_get_contents("php://input"), true);
    }

    // Function sends and HTTP response in a JSON format
    function httpReponse($arrayToSend)
    {
        header('Content-type: application/json');
		echo json_encode($arrayToSend);
    }

    // 200 Ok
    function ok()
    {
        return http_response_code(200);
    }

    // 201 Created 
    function created()
    {
        return http_response_code(201);
    }

    // 204 No Content (page won't be visited so can't send any data/echo)
    function noContent()
    {
        return http_response_code(204);
    }

    // 400 Bad Request 
    function badRequest()
    {
        return http_response_code(400);
    }

    // 404 Not Found 
    function notFound()
    {
        return http_response_code(404);
    }
?>