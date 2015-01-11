<?php
	/*
	 * create a new story element (with a name) and return it's ID
	 * if there already is a story element by this name, this one's ID is returned
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
	$collection = $db->story_elements;

	// get request parameters
	$poi_oid = $REQUEST['poi_oid'];
	$name = $_REQUEST['name'];
	$tag_oid = $REQUEST['tag_oid'];
	$abstract = $REQUEST['abstract'];
	$text = $REQUEST['text'];

	// TODO check for missing name, etc.

	// check whether a story with this name already exists
	$cursor = $collection -> find( array('name' => $name) );
	$count = $cursor -> count();

	if ($count > 0) {
		foreach ($cursor as $story) {

			// return existing story's ID
			echo $tag['_id'];
		}
	} else {
		// prepare document data

		$poi_oid_strings = split(',', $poi_oid);
		$poi_oids = array();

		if (isset($poi_oid_strings) && !empty($poi_oid_strings)) {
			foreach ($poi_oid_strings as $po_string) {

				$poi = json_decode(file_get_contents('getPoi.php?oid='.$poi_string));
				$poi_oids[] = $poi['_id'];
			}
		}

		$tag_oid_strings = split(',', $tag_oid);
		$tag_oids = array();

		if (isset($tag_oid_strings) && !empty($tag_oid_strings)) {
			foreach ($tag_oid_strings as $to_string) {

				$tag = json_decode(file_get_contents('getTag.php?oid='.$to_string));
				$tag_oids[] = $tag['_id'];
			}
		}

		// create a new document
		$document = array('name' => $name);

		if (isset($poi_oids) && !empty($poi_oids)) {
			if (count($poi_oids) == 1) $document['poi_id'] = $poi_oids[0];
			else $document['poi_id'] = $poi_oids;
		}
		if (isset($tag_oids) && !empty($tag_oids)) {
			if (count($tag_oids) == 1) $document['tag_id'] = $tag_oids[0];
			else $document['tag_oid'] = $tag_oids;
		}
		if (isset($abstract) && $abstract !== '') $document['abstract'] = $abstract;
		if (isset($text) && $text !== '') $document['text'] = $text;
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
