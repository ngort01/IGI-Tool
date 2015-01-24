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
	$client = new MongoClient($uri, $options);		// new Mongo('localhost');
	$db = $client->selectDB("igi-tool-db");

	// get tag collection
	$collection = $db->pois;
	
	// get request parameters
	$fileId = $_REQUEST['oid'];

	try {
		$files = $db->fs->files;	
		$fileName1 = $files->findOne(array('_id' => new MongoId($fileId)));
		$fileName = $fileName1['filename'];

		$grid = $db->getGridFS();
		$file = $grid->findOne(array('filename' => $fileName));
		$files = $db->fs->files;
		$file1 = $files->findOne(array('filename' => $fileId));
		
		if ($file) {
			header('Content-type:image/png');
			echo $file->getBytes();
		} else {
			echo "No image found!";
		}

	} catch (Exception $e) {
		echo $e->getMessage();
	}
	$client->close();
?>
