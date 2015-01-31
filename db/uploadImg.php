 <?php

	$target_dir = "uploads/";
	$target_file = $target_dir . basename($_FILES["new-img-file"]["name"]);
	$uploadOk = 1;
	$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
	$poi_oid = $_REQUEST['poi_oid'];
	$add_to_poi = $_REQUEST['add_to_poi'];
	$display_name = $_REQUEST['display_name'];
	$result_mode = $_REQUEST['result_mode'];
	
	if ($result_mode === 'full') {
		echo 'POI OID = ' . $poi_oid . '<br>';
		echo 'DISPLAY NAME = ' . $display_name . '<br>';
		echo 'ADD TO POI = ' . $add_to_poi . '<br>';
		
		if ($add_to_poi === 'true') {
			echo 'ADD IMAGE TO POI<br>';
		} else {
			echo 'DO NOT ADD IMAGE<br>';
		}
		
		echo 'RESULT MODE = ' . $result_mode . '<br>';
		
		if ($result_mode === 'full') {
			echo 'RESULT MODE FULL<br>';
		} else {
			echo 'RESULT MODE UNCHECKED<br>';
		}
	}	

	// Check if image file is a actual image or fake image
	if(isset($_POST["submit"])) {
		$check = getimagesize($_FILES["new-img-file"]["tmp_name"]);
		if($check !== false) {
		    if ($result_mode === 'full') {
		    	echo "File is an image - " . $check["mime"] . ".<br>";
		    }
		    $uploadOk = 1;
		} else {
			if ($result_mode === 'full') {
				echo "File is not an image.<br>";
			}
		    $uploadOk = 0;
		}
	}

	// Check if file already exists
	if (file_exists($target_file)) {
		if ($result_mode === 'full') {
			echo "Sorry, file already exists.<br>";
		}
		$uploadOk = 0;
	}

	// Check file size
	if ($_FILES["new-img-file"]["size"] > 500000) {
		if ($result_mode === 'full') {
			if ($result_mode === 'full') {
				echo "Sorry, your file is too large.<br>";
			}
		}
		$uploadOk = 0;
	}

	// Allow certain file formats
	if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
	&& $imageFileType != "gif" ) {
		if ($result_mode === 'full') {
			echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.<br>";
		}
		$uploadOk = 0;
	}

	// Check if $uploadOk is set to 0 by an error
	if ($uploadOk == 0) {
		if ($result_mode === 'full') {
			echo "Sorry, your file was not uploaded.<br>";
		}

	// if everything is ok, try to upload file
	} else {

		$uri = "mongodb://localhost:27017/igi-tool-db";
		$options = array("connectTimeoutMS" => 30000);

		$client = new MongoClient($uri, $options);
		$db = $client -> selectDB("igi-tool-db");

		$grid = $db -> getGridFS();
		
		$name = basename($_FILES["new-img-file"]["name"]);
		$id = $grid -> storeUpload('new-img-file', $name);

		if ($id) {
			if ($result_mode === 'full') {
				echo 'The file "' . $name . '" has been uploaded with ID "' . $id . '".<br>';
				
			} elseif ($result_mode === 'json') {
				header('Content-Type: application/json');
				echo json_encode( array(
							'name' => $display_name,
							'id' => '' . $id,
							'size' => $_FILES["new-img-file"]["size"] )
						 );
			} else {
				echo $id;
			}

			if ($add_to_poi === 'true') {
				// add image to poi
				$collection = $db -> pois;

				$poi = $collection -> findOne( array('_id' => new MongoId($poi_oid)) );
				$img_doc = array('name' => $display_name, 'data' => new MongoId($id));
				
				// if (is_array($poi['picture']) || is_null($poi['picture'])) {
				// didn't work, because in php documents and arrays both are arrays
				// workaround:
				// if picture has got a data attribute, it is a single picture entry
				// not an array of picture entries
				if (count($poi['picture']['data']) == 1) {

					// create an array from the existing picture and the new one
					if ($result_mode === 'full') {
						echo 'Adding picture to POI...<br>Creating array from pictures...<br>';
					}
					$collection -> update(
							array('_id' => new MongoId($poi_oid)),
							array('$set' =>
									array('picture' =>
											array(
													$poi['picture'],	// old, existing picture
													$img_doc			// picture to add
											)
									)
							)
					);

				} else {
					
					// add new picture to array or create a new array
					if ($result_mode === 'full') {
						echo 'Adding picture to POI...<br>';
					}
					// TODO can "array('_id' => new MongoId($poi_oid)" be replaced by $poi?
					$collection -> update(
							array('_id' => new MongoId($poi_oid)),
							array( '$push' => array('picture' => $img_doc) )
						);
				}
				
				// check if picture is part of the POI
				if ($result_mode === 'full') {
					
					$cur = $collection -> find(
							array(
								'_id' => new MongoId($poi_oid),
								'picture.data' => new MongoId($id)
							)
						) -> limit(1);
					
					$count = $cur -> count();
					if ($count > 0) {
						echo 'The image "' . $display_name . '" has been added to POI "' . $poi_oid . '".<br>';
					} else {
						echo 'The image "' . $display_name . '" could not be added to POI "' . $poi_oid . '".<br>';
					}
				}
			}

		} else {
			if ($result_mode === 'full') {
				echo "Sorry, there was an error uploading your file.<br>";
			}
		}
	}
?> 
