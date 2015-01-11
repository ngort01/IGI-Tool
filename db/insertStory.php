<?php
	/*
	 * create a new story (with a name) and return it's ID
	 * if there already is a story by this name, this one's ID is returned
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
	$name = $_REQUEST['name'];
	$description = $REQUEST['description'];
	$tag_oid = $REQUEST['tag_oid'];
	$story_element_oid = $REQUEST['story_element_oid'];

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

		$tag_oid_strings = split(',', $tag_oid);
		$tag_oids = array();

		if (isset($tag_oid_strings) && !empty($tag_oid_strings)) {
			foreach ($tag_oid_strings as $to_string) {

				$tag = json_decode(file_get_contents('getTag.php?oid='.$to_string));
				$tag_oids[] = $tag['_id'];
			}
		}

		$story_element_oid_strings = split(',', $story_element_oid);
		$story_element_oids = array();

		if (isset($story_element_oid_strings) && !empty($story_element_oid_strings)) {
			foreach ($story_element_oid_strings as $seo_string) {

				$story_element = json_decode(file_get_contents('getStoryElement.php?oid='.$seo_string));
				$story_element_oids[] = $story_element['_id'];
			}
		}

		// create a new document
		$document = array('name' => $name);
		if (isset($description) && $description !== '') $document['description'] = $description;
		if (isset($story_element_oids) && !empty($story_element_oids)) {
			if (count($story_element_oids) == 1) $document['story_element_id'] = $story_element_oids[0];
			else $document['story_element_id'] = $story_element_oids;
		}
		if (isset($tag_oids) && !empty($tag_oids)) {
			if (count($tag_oids) == 1) $document['tag_id'] = $tag_oids[0];
			else $document['tag_id'] = $tag_oids;
		}
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
