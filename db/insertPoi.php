<?php 
	/*
	 * create new POI (with name and location) and return it's ID
	 * if there already is a POI with this exact name and location,
	 * this one's ID is returned
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
	$db = $client -> selectDB("igi-tool-db");

	// get tag collection
	$collection = $db -> pois;

	// get request parameters
	$name = $_REQUEST['name'];
	$location = $_REQUEST['location'];
	$description = $_REQUEST['description'];
	$story_element_oid = $_REQUEST['story_element_oid'];
	$story_element_name = $_REQUEST['story_element_name'];

	// TODO check for missing name or location
	// TODO check description for whitespaces, quotation and punctuation marks 

	// create location document from coordinates
	$coordinates = split(',', $location);
	$location_doc = array('type' => 'Point', 'coordinates' => array((float) $coordinates[0], (float) $coordinates[1]));

	// check whether a poi with this name and location already exists
	$cursor = $collection -> find( array('name' => $name, 'location' => $location_doc) );
	$count = $cursor -> count();

	if ($count > 0) {
		foreach ($cursor as $poi) {

			echo $poi['_id'];
			// TODO what happens to description and other attributes?
		}
	} else {

		// prepare document data
		$story_element_oid_strings = split(',', $story_element_oid);
		$story_element_name_strings = split(',', $story_element_name);
		$story_element_oids = array();

		if (isset($story_element_oid) && !empty($story_element_oid)) {

			echo 'Log: add SE by OID<BR>';

			foreach ($story_element_oid_strings as $seo_string) {

				// TODO doesn't work: search for a story element with this ID (string) get story element ID
				// (to make sure the story element exists)
				// TODO use relative URL
				$story_element = json_decode(file_get_contents('http://giv-interaction.uni-muenster.de/db/getStoryElement.php?oid='.$seo_string));
				$story_element_oids[] = $story_element['_id'];
			}
		} else if (isset($story_element_name) && !empty($story_element_name)) {

			echo 'Log: add SE by NAME<BR>';	

			foreach ($story_element_name_strings as $sen_string) {

				echo 'Log: IN FOREACH CLAUSE<BR>';

				// TODO use relative URL
				$story_element = json_decode(file_get_contents('http://giv-interaction.uni-muenster.de/db/getStoryElement.php?name='.$sen_string));
				$story_element_oids[] = $story_element['_id'];

			echo 'Log: AFTER ADDING MONGOID<BR>';
			}
			echo 'Log: STORY ELEMENT IDS IS ' . $story_element_oids . '<BR>';
		}

		// create a new document
		$document = array('name' => $name, 'location' => $location_doc);

		if (isset($description) && $description !== '') $document['description'] = $description;
		if (isset($story_element_oids) && !empty($story_element_oids)) {
			if (count($story_element_oids) == 1) $document['storyId'] = $story_element_oids[0];
			else $document['storyId'] = $story_element_oids;
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
