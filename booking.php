<?php
  include('config.php');

  header("Access-Control-Allow-Origin: *");
  header("Content-Type: application/json; charset=UTF-8");
	
  $conn = mysqli_connect($host,$user,$pwd,$dbname);

  $data = $_POST['myData'];

  $data = json_decode($_POST['myData'], true);

  //Assign data
  $res_id = $data["id"];
  $date = $data["date"];
  $time = $data["time"];
  $guest = $data["guest"];
  $fname = $data["fname"];
  $lname = $data["lname"];
  $email = $data["email"];
  $mobile = $data["mobile"];

  $sql = "INSERT INTO booking (Booking_ID, Restaurant_ID, Date, Time, Guest_Number, FirstName, LastName, Email, MobileNo) VALUES (NULL, '$res_id', '$date', '$time', '$guest', '$fname', '$lname', '$email', '$mobile')";

  if (mysqli_query($conn, $sql)) {
    echo "Your booking has been successfully reserved";
  } else {
    echo "There is something wrong with the reservation, please try again";
  }
    
?>