<?php
	include('config.php');

  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json; charset=UTF-8");
	
	$conn = mysqli_connect($host,$user,$pwd,$dbname);

  $data = $_POST['myData'];

	$sql = "SELECT * FROM restaurants WHERE Name LIKE '%{$data}%' OR Location LIKE '%{$data}%' OR Type LIKE '%{$data}%'";
	
	$result = mysqli_query($conn, $sql);

	//initialize array data
	$restaurants = array();

	//Assign fetched data to specified array
	$row_counter = 0;

	while ($row = mysqli_fetch_array($result))
	{
    $restaurants[] = $row;    
	}

  echo json_encode($restaurants);
?>