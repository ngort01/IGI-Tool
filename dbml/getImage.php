<?php
	/*
	 * Standard single-node URI format:
	 * mongodb://[username:password@]host:port/[database] 
	 */
	$uri = "mongodb://uploader:JustLoadIt@ds053090.mongolab.com:53090/igi-tool-db";
	$options = array("connectTimeoutMS" => 30000);

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
				header('Content-type:image/png');
				echo $file->getBytes();
			} else {
				echo "No image found!";
			}
		
		} catch (Exception $e) {
			echo $e->getMessage();
		}
	}
	
	$client->close();
?>
