<?php
    require_once 'connect.php'; // The mysql database connection script
    
    parse_str($_SERVER['QUERY_STRING']); // Parse our url query string
    $requesty = $_GET['weight'];
    
    $sql= 'SELECT * FROM on_tap';
    $query = mysqli_query($db, $sql);
    
    $onTapId = '';
    $apiKeyDb = '';
    $weightDb = '';
    
    while($row = mysqli_fetch_assoc($query)) {
        $onTapId = $row['id'];
        $apiKeyDb = $row['api_key'];
        $weightDb = $row['weight'];
        break;  // Should only be one result; break after first match
    }
    
    if(isset($weight) && isset($apiKey) && strcmp($apiKey, $apiKeyDb) == 0) {
        $diff = abs($weightDb - $weight);
        $scenario = '';
        
        if($weight < $weightDb && $diff > 0.1) { // Weight has decreased enough to indicate a change
            $sql = 'UPDATE on_tap' .
                   ' SET weight = ' . $weight . ', last_update = now(), last_pour = now()' .
                   ' WHERE id = ' . $onTapId;
        } elseif ($diff > 0.1) { // Weight has increased indicating a possible refill
            $sql = 'UPDATE on_tap' .
                   ' SET weight = ' . $weight . ', last_update = now()' .
                   ' WHERE id = ' . $onTapId;
        } else { // No weight change
            $sql = 'UPDATE on_tap' .
                   ' SET last_update = now()' .
                   ' WHERE id = ' . $onTapId;
        }
        
        $query = mysqli_query($db, $sql);
    } else {
        echo 'Invalid request';
    } 
    
    mysqli_close($db);   
?>