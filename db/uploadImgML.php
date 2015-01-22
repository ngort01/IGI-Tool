 <?php

	$target_dir = "uploads/";
	$target_file = $target_dir . basename($_FILES["new-img-filename"]["name"]);
	$uploadOk = 1;
	$imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
	$poi_oid = $_REQUEST['poi_oid'];

	// Check if image file is a actual image or fake image
	if(isset($_POST["submit"])) {
		$check = getimagesize($_FILES["new-img-filename"]["tmp_name"]);
		if($check !== false) {
		    echo "File is an image - " . $check["mime"] . ".<br>";
		    $uploadOk = 1;
		} else {
		    echo "File is not an image.<br>";
		    $uploadOk = 0;
		}
	}

	// Check if file already exists
	if (file_exists($target_file)) {
		echo "Sorry, file already exists.<br>";
		$uploadOk = 0;
	}

	// Check file size
	if ($_FILES["new-img-filename"]["size"] > 500000) {
		echo "Sorry, your file is too large.<br>";
		$uploadOk = 0;
	}

	// Allow certain file formats
	if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
	&& $imageFileType != "gif" ) {
		echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.<br>";
		$uploadOk = 0;
	}

	// Check if $uploadOk is set to 0 by an error
	if ($uploadOk == 0) {
		echo "Sorry, your file was not uploaded.<br>";

	// if everything is ok, try to upload file
	} else {
		
		// connect to db
		$uri = "mongodb://uploader:JustLoadIt@ds053090.mongolab.com:53090/igi-tool-db";
		$options = array("connectTimeoutMS" => 30000);

		$client = new MongoClient($uri, $options);
		$db = $client -> selectDB('igi-tool-db');

		// upload image
		$grid = $db -> getGridFS();
		$name = basename($_FILES["new-img-filename"]["name"]);
		$id = $grid -> storeUpload('new-img-filename', $name);

		if ($id) {
		    echo "The file ". $name . " has been uploaded with ID " . $id . "<br>";

			// add image to poi
			$collection = $db -> pois;

			$img_doc = array('name' => $name, 'data' => new MongoId($id));
			$collection -> update( array('_id' => new MongoId($poi_oid),
						array( '$set' => array('picture' => $img_doc) )
					)
				);

		} else {
		    echo "Sorry, there was an error uploading your file.<br>";
		}
	}
?> 
