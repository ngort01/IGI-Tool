<?php
	/*
	 * return story elements by ID, story ID, POI ID, tag ID or tag name
	 * if none of these is given, all story elements will be returned
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

	echo 'LOG: get request parameters<BR>';

	// get request parameters
	$oid = $_REQUEST['oid'];
	$story_oid = $_REQUEST['story_oid'];
	$poi_oid = $_REQUEST['poi_oid'];
	$tag_oid = $_REQUEST['tag_oid'];
	$tag_name = $_REQUEST['tag_name'];

	echo 'LOG: get story elements<BR>';


	if ($oid) {
		// get story element by ID

		echo 'LOG: get story element by ID<BR>';

		$cursor = $collection -> find( array('_id' => new MongoId($oid)) );
		$count = $cursor -> count();

		if ($count > 0) {

			$array = array();
			foreach ($cursor as $story_element) {

				$array[] = $story_element;
			}
			echo json_encode($array);
		}

	} elseif ($story_oid) {
		// get all story elements of one story

		echo 'LOG: get story element by story ID<BR>';

		// TODO join story and story_elements and handle as one request, if possible
		$s_col = $db -> stories;
		$s_cur = $s_col -> find( array('_id' => new MongoId($story_oid)) );
		$s_count = $s_cur -> count();

		if ($s_count > 0) {

			$array = array();
			foreach ($s_cursor as $story) {

				foreach ($story['story_element_id'] as $se_id) {

					$se_cur = $collection -> find( array('_id' => new MongoId($se_id)) );
					$se_count = $se_cur -> count();

					if ($se_count > 0) {

						foreach ($se_cur as $story_element) {

							$array[] = $story_element;
						}
					}
				}
			}
			echo json_encode($array);
		}

	} elseif ($poi_oid) {
		// get story elements by POI ID

		echo 'LOG: get story element by POI ID<BR>';

		$cursor = $collection -> find( array('poi_id' => new MongoId($poi_oid)) );
		$count = $cursor -> count();

		if ($count > 0) {

			$array = array();
			foreach ($cursor as $story_element) {

				$array[] = $story_element;
			}
			echo json_encode($array);
		}

	} elseif ($tag_oid) {
		// get story elements by tag ID

		echo 'LOG: get story element by tag ID<BR>';

		$cursor = $collection -> find( array('tag_id' => new MongoId($oid)) );
		$count = $cursor -> count();

		if ($count > 0) {

			$array = array();
			foreach ($cursor as $story_element) {

				$array[] = $story_element;
			}
			echo json_encode($array);
		}

	} elseif ($tag_name) {
		// get story element by tag name

		echo 'LOG: get story element by tag name<BR>';

		// get tag oid
		$tag = json_decode(file_get_contents('getTag.php?name='.$tag_name));
		$tag_oid = $tag['_id'];

		if(isset($tag_oid) && !empty($tag_oid) && $tag_oid !== '') {

			// TODO change request to 'tags' CONTAINS new MongoId($tag_oid)
			$cursor = $collection -> find( array('tag_id' => new MongoId($tag_oid)) );
			$count = $cursor -> count();

			if ($count > 0) {

				$array = array();
				foreach ($cursor as $story_element) {

					$array[] = $story_element;
				}
				echo json_encode($array);
			}
		}
	} else {
		// get all story elements

		echo 'LOG: get all story elements<BR>';
	
		$cursor = $collection -> find();
		$count = $cursor -> count();

		if ($count > 0) {

			$array = array();
			foreach ($cursor as $story_element) {

				$array[] = $story_element;
			}
			echo json_encode($array);
		}
	}
	
	// Since this is an example, we'll clean up after ourselves.
	// $collection->drop();

	// Only close the connection when your app is terminating
	$client->close();
?>
