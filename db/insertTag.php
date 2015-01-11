<?php 
	/*
	 * create a new tag (with a name) and return it's ID
	 * if there already is a tag by this name, this one's ID is returned
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

	// TODO check for missing name

	// check whether a tag with this name already exists
	$cursor = $collection -> find( array('name' => $name) );
	$count = $cursor -> count();

	if ($count > 0) {
		foreach ($cursor as $tag) {

			// return existing tag's ID
			echo $tag['_id'];
		}
	} else {
	// TODO only create a tag if a name is given

		// create a new document
		$document = array('name' => $name);
		$collection -> insert($document);

		// get the new tag's ID
		$id = $document['_id'];

		// return ID
		echo $id;
	}
	
	// Since this is an example, we'll clean up after ourselves.
	// $collection->drop();

	// Only close the connection when your app is terminating
	$client->close();
?>
