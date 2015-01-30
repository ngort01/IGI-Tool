<?php 
	/*
	 * adds uploaded pictures to a POI
	 */

	/*
	 * Standard single-node URI format:
	 * mongodb://[username:password@]host:port/[database] 
	 */
	$uri = "mongodb://uploader:JustLoadIt@ds053090.mongolab.com:53090/igi-tool-db";
	$options = array("connectTimeoutMS" => 30000);

	/*
	 * Include the replica set name as an option for a multi-node replica set connection:
	 * $uri = "mongodb://myuser:mypass@host1:port1,host2:port:2/mydb";
	 * $options = array("replicaSet" => "myReplicaSet", "connectTimeoutMS" => 30000);
	 */
	$client = new MongoClient($uri, $options);		// new Mongo('localhost');
	$db = $client->selectDB("igi-tool-db");

	// get tag collection
	$collection = $db->pois;

	// get request parameters
	$poi_oid = $_REQUEST['oid'];
	$img_oid = $_REQUEST['new_img_oid'];
	$display_name = $_REQUEST['display_name'];
	
	echo 'poi_oid = ' . $poi_oid . '<br>';
	echo 'img_oid = ' . $img_oid . '<br>';
	echo 'display_name = ' . $display_name . '<br>';

	if ($poi_oid !== '' && $img_oid !== '' && $display_name !== '') {
	
		$poi = $collection -> findOne( array('_id' => new MongoId($poi_oid)) );
		$img_doc = array('name' => $display_name, 'data' => new MongoId($img_oid));
	
		if (count($poi['picture']['data']) == 1) {
	
			// create an array from the existing picture and the new one
			echo 'Adding picture to POI...<br>Creating array from pictures...<br>';
			
			$collection -> update(
				array('_id' => new MongoId($poi_oid)),
					array('$set' =>
						array('picture' =>
							array(
								$poi['picture'],	// old, existing picture
								$img_doc			// picture to add
							)
						)
					)
				);
	
		} else {
		
			// add new picture to array or create a new array
			echo 'Adding picture to POI...<br>';

			// TODO can "array('_id' => new MongoId($poi_oid)" be replaced by $poi?
			$collection -> update(
			array('_id' => new MongoId($poi_oid)),
				array( '$push' => array('picture' => $img_doc) )
				);
			}
	
			// check if picture is part of the POI
			$cur = $collection -> find(
					array(
						'_id' => new MongoId($poi_oid),
						'picture.data' => new MongoId($img_oid)
					)
				) -> limit(1);
				
			$count = $cur -> count();
			if ($count > 0) {
				echo 'The image "' . $display_name . '" has been added to POI "' . $poi_oid . '".<br>';
			} else {
				echo 'The image "' . $display_name . '" could not be added to POI "' . $poi_oid . '".<br>';
			}
	} else {
		
		echo 'Missing information. Could not add picture to POI.'; 
	}

	// Since this is an example, we'll clean up after ourselves.
	// $collection->drop();

	// Only close the connection when your app is terminating
	$client->close();
?>
