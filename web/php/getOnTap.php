<?php
    require_once 'connect.php'; // The mysql database connection script
    
    $sql= "SELECT * FROM on_tap";
    $query = mysqli_query($db, $sql);
    
    $beerId = "";
    $breweryId = "";
    $styleId = "";
    
    $tap = new stdClass;
    $beer = new stdClass;
    $brewery = new stdClass;
    $breweries = array();
    
    while($row = mysqli_fetch_assoc($query)) {
        $beerId = $row['beer'];
        $lastUpdate = $row['last_update'];
        $lastPour = $row['last_pour'];
        
        $tap->weight = round(($row['weight'] - $row['empty_weight']) * 16);  // Subtract keg weight then convert from pounds to ounces
        $tap->lastUpdateDate = date("D, F j", strtotime($lastUpdate));
        $tap->lastUpdateTime = date("g:ia", strtotime($lastUpdate));
        $tap->lastPourDate = date("D, F j", strtotime($lastPour));
        $tap->lastPourTime = date("g:ia", strtotime($lastPour));
        break;  // Should only be one result; break after first match
    }
    
    $sql = "SELECT * FROM beers WHERE id = " . $beerId;
    $query = mysqli_query($db, $sql);
    
    while($row = mysqli_fetch_assoc($query)) {
        $beer->name = $row['name'];
        $beer->abv = $row['abv'];
        $beer->description = $row['description'];
        $beer->style = $row['style'];
        $breweryId = $row['brewery_key'];
        break;  // Should only be one result; break after first match
    }
    
    $sql = "SELECT id, name, website, image FROM breweries";
    $query = mysqli_query($db, $sql);
    
    while($row = mysqli_fetch_assoc($query)) {
        $x = new stdClass;
        $x->name = $row['name'];
        $x->website = $row['website'];
        $x->image = $row['image'];
        
        $breweries[] = $x;
        
        if($breweryId == $row['id']) {
            $brewery->name = $row['name'];
            $brewery->website = $row['website'];
        }
    }
    
    shuffle($breweries);
    
    $results = new stdClass;
    $results->tap = $tap;
    $results->beer = $beer;
    $results->brewery = $brewery;
    $results->breweries = $breweries;
    
    header('Content-Type: application/json');
    echo json_encode($results);
    
    mysqli_close($db);
?>