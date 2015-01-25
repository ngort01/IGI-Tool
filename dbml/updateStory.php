<?php 
	/*
	 * return it's ID
	 * if there already is a story by this name, this one's ID is returned
	 */

	/*
	 * Standard single-node URI format:
	 * mongodb://[username:password@]host:port/[database] 
	 */
	$uri = "mongodb://uploader:JustLoadIt@ds053090.mongolab.com:53090/igi-tool-db";
	$options = array("connectTimeoutMS" => 30000);

	$client = new MongoClient($uri, $options);
	$db = $client->selectDB("igi-tool-db");

	// get tag collection
	$collection = $db->stories;

	// get request parameters
	$story_oid = $_REQUEST['oid'];
	$story_element_oid = $_REQUEST['new_story_element_oid'];

	echo 'story_oid = ' . $story_oid . '<br>';
	echo 'story_element_oid = ' . $story_element_oid . '<br>';

	$story = $collection -> findOne( array('_id' => new MongoId($story_oid)) );

	echo 'story element(s): ' . $story['story_element_id'] . '<br>';

	// add story element id to story
	if (is_array($story['story_element_id']) || is_null($story['story_element_id'])) {

		echo 'add element to array<br>';

		// add element to array
		// TODO can "array('_id' => new MongoId($story_oid))" be replaced by $story ?
		$collection -> update( array('_id' => new MongoId($story_oid)),
				array('$push' => array( 'story_element_id' => new MongoId($story_element_oid)) )
			);
	} else {

		echo 'add element to array<br>';
		
		// create an array from the existing element and the new one
		$collection -> update( array('_id' => new MongoId($story_oid)),
				array('$set' => array( 'story_element_id' => array (
						$story['story_element_id'],			// old element
						new MongoId($story_element_oid))	// element to add
					)
				)
			);
	}

	$s = $collection -> findOne( array('_id' => new MongoId($story_oid)) );
	echo 'story element(s): ' . $s['story_element_id'];


	// Since this is an example, we'll clean up after ourselves.
	// $collection->drop();

	// Only close the connection when your app is terminating
	$client->close();
?>
