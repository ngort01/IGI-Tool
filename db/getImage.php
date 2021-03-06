<?php
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
	$client = new MongoClient($uri, $options);
	$db = $client->selectDB("igi-tool-db");

	// get request parameters
	$fileId = $_REQUEST['oid'];
	$mode = $_REQUEST['mode'];

	if (is_null($fileId) || $fileId === "") {
		
		// list all images
		
		if ($mode === 'uploaded' || is_null($mode) || $mode === '') {
			
			// get all uploaded pictures
			
			$collection = $db -> fs -> files;
			$img_cur = $collection -> find();
				
			if (count($img_cur) > 0 ) {
			
				foreach ($img_cur as $img) {
	
					echo json_encode($img) . '<br>';
				}
			} else {
				echo "No images found!";
			}
			
		} elseif ($mode === 'byPoi') {

			// get only images, connected to an poi
			
			$collection = $db -> pois;
			$poi_cur = $collection -> find( array('picture' => array('$exists' => 'true')) );
			
			if (count($poi_cur) > 0 ) {
	
				foreach ($poi_cur as $poi) {
					
					if (count($poi['picture']['data']) == 1) {
						// handle single pictures
						
						echo json_encode($poi['picture']) . '<br>';
						
					} else {
						// handle picture arrays
						
						foreach ($poi['picture'] as $pic) {
							echo json_encode($pic) . '<br>';
						}
					}
				}
			} else {
				echo "No images found!";
			}
		}
		
	} else {
		
		// get a single image
		try {
		
			$grid = $db->getGridFS();
			$file = $grid -> findOne( array('_id' => new MongoId($fileId)) );
		
			if ($file) {
				$imageFileType = pathinfo($file -> getFilename(), PATHINFO_EXTENSION);
				
				if ($imageFileType == "jpg") {
					header('Content-type:image/jpg');
				} elseif ($imageFileType == "png") {
					header('Content-type:image/png');
				} elseif ($imageFileType == "jpeg") {
					header('Content-type:image/jpeg');
				} elseif ($imageFileType == "gif" ) {
					header('Content-type:image/gif');
				} else {
					header('Content-type:text/html');
				}
				
				echo $file -> getBytes();
			} else {
				header('Content-type:text/html');
				echo "No image found!";
			}
		
		} catch (Exception $e) {
			echo $e -> getMessage();
		}
	}
	
	$client->close();
?>