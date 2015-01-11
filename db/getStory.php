<?php
	/*
	 * return stories by ID, by tag name or by tag ID
	 * if none of these is given, all stories will be returned
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
	$collection = $db->stories;

	// get request parameters
	$oid = $_REQUEST['oid'];
	$tag_oid = $_REQUEST['tag_oid'];
	$tag_name = $_REQUEST['tag_name'];


	if ($oid) {
		// get story by ID

		$cursor = $collection -> find( array('_id' => new MongoId($oid)) );
		$count = $cursor -> count();

		if ($count > 0) {

			$array = array();
			foreach ($cursor as $story) {

				$array[] = $story;
			}
			echo json_encode($array);
		}
	} elseif ($tag_oid) {
		// get stories by tag ID

		// TODO change request to 'tags' CONTAINS new MongoId($tag_oid)
		$cursor = $collection -> find( array('tag_id' => new MongoId($tag_oid)) );
		$count = $cursor -> count();

		if ($count > 0) {

			$array = array();
			foreach ($cursor as $story) {

				$array[] = $story;
			}
			echo json_encode($array);
		}
	} elseif ($tag_name) {
		// get stories by tag name

		// get tag oid
		$tag = json_decode(file_get_contents('getTag.php?name='.$tag_name));
		$tag_oid = $tag['_id'];

		// TODO $tag_oid should be CONTAINED in 'tags'. Does this work?
		// find( array('tags' => array('$in' => new MongoId($tag_oid))) );
		$cursor = $collection -> find( array('tag_id' => new MongoId($tag_oid)) );
		$count = $cursor -> count();

		if ($count > 0) {

			$array = array();
			foreach ($cursor as $story) {

				$array[] = $story;
			}
			echo json_encode($array);
		}
	} else {
		// get all stories
	
		$cursor = $collection -> find();
		$count = $cursor -> count();

		if ($count > 0) {

			$array = array();
			foreach ($cursor as $story) {

				$array[] = $story;
			}
			echo json_encode($array);
		}
	}
	
	// Since this is an example, we'll clean up after ourselves.
	// $collection->drop();

	// Only close the connection when your app is terminating
	$client->close();
?>
