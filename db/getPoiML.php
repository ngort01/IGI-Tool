<?php 
	/*
	 * returns a POI by ID or by bounding box, encoded in JSON
	 * if no ID or bounding box is given, all POI will be returned
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
	$oid = $_REQUEST['oid'];
	$bbox = $_REQUEST['bbox'];

	if ($oid) {
		// get poi by ID

		$cursor = $collection -> find( array('_id' => new MongoId($oid)) );
		$count = $cursor -> count();

		if ($count > 0) {

			$array = array();
			foreach ($cursor as $poi) {

				$array[] = $poi;
			}
			echo json_encode($array);
		}
	} elseif ($bbox) {
		// get poi by bounding box

		// TODO mongoDB provide the possibility to filter the database for geo objects
		// instead of compareing coordinates, e.g. a rectangle as a bounding box
		$bbox_array = split(',', $bbox);

		// TODO check comparisons in this query
		$cursor = $collection -> find( array(
				'name' => $name,
				'location' => array(
					'type' => 'Point',
					'coordinates' => array(
						0 => array('$gte' => (float) $bbox_array[0], '$lte' => (float) $bbox_array[1]),
						1 => array('$gte' => (float) $bbox_array[2], '$lte' => (float) $bbox_array[3])
						)
					)
				)
			);
		$count = $cursor -> count();

		if ($count > 0) {

			$array = array();
			foreach ($cursor as $poi) {

				$array[] = $poi;
			}
			echo json_encode($array);
		}
	} else {
		// get all POI
	
		$cursor = $collection -> find();
		$count = $cursor -> count();

		if ($count > 0) {

			$array = array();
			foreach ($cursor as $poi) {

				$array[] = $poi;
			}
			echo json_encode($array);
		}
	}
	
	// Since this is an example, we'll clean up after ourselves.
	// $collection->drop();

	// Only close the connection when your app is terminating
	$client->close();
?>
