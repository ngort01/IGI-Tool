<?php
	/*
	 * modified simple example, copied from:
	 * https://github.com/mongolab/mongodb-driver-examples/blob/master/php/php_simple_example.php
	 *
	 */

	/*
	 * Standard single-node URI format:
	 * mongodb://[username:password@]host:port/[database] 
	 */
	$uri = "mongodb://localhost:27017/igi-tool-db";
	$options = array("connectTimeoutMS" => 30000);

	/*
	 * Include the replica set name as an option for a multi-node replica set connection:
	 * $uri = "mongodb://myuser:mypass@host1:port1,host2:port:2/mydb";
	 * $options = array("replicaSet" => "myReplicaSet", "connectTimeoutMS" => 30000);
	 */
	$client = new MongoClient($uri, $options);		// new Mongo('localhost');
	$db = $client->selectDB("igi-tool-db");

	// get tag collection
	$collection = $db->tags;

	// get request parameters
	$name = $_REQUEST['name'];
	$oid = $_REQUEST['oid'];


	if ($name && $oid) {
		// get tags by name and ID

		// check whether a tag with this name already exists
		$cursor = $collection -> find( array('name' => $name, '_id' => new MongoId($oid)) );
		$count = $cursor -> count();

		if ($count > 0) {

			$array = array();
			foreach ($cursor as $tag) {

				$array[] = $tag;
			}
			echo json_encode($array);
		}
	} elseif ($name) {
		// get tags by name

		// check whether a tag with this name already exists
		$cursor = $collection -> find( array('name' => $name) );
		$count = $cursor -> count();

		if ($count > 0) {

			$array = array();
			foreach ($cursor as $tag) {

				$array[] = $tag;
			}
			echo json_encode($array);
		}
	} elseif ($oid) {
		// get tags by ID

		// check whether a tag with this ID already exists
		$cursor = $collection -> find( array('_id' => new MongoId($oid)) );
		$count = $cursor -> count();

		if ($count > 0) {

			$array = array();
			foreach ($cursor as $tag) {

				$array[] = $tag;
			}
			echo json_encode($array);
		}
	} else {
		// get all tags
	
		$cursor = $collection -> find();
		$count = $cursor -> count();

		if ($count > 0) {

			$array = array();
			foreach ($cursor as $tag) {

				$array[] = $tag;
			}
			echo json_encode($array);
		}
	}
	
	// Since this is an example, we'll clean up after ourselves.
	// $collection->drop();

	// Only close the connection when your app is terminating
	$client->close();
?>
