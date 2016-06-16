<?php
	//header("Access-Control-Allow-Origin:*");

	// $base64 = $_POST["img"];
	//
	// $file = base64_encode( $base64 );
	// $name = "uploads/" .time(). ".png";
	// file_put_contents($name, $file);
	//
	// $arr = array('code'=>1, 'msg'=>'上传成功', 'url'=>$name);
	// echo json_encode($arr);


		$data = $_POST['img'];
		$encodedData = str_replace(' ','+',$data);
		$image=base64_decode($encodedData);
		$filename = "uploads/" .time(). ".png";
    $fp = fopen($filename, 'w');
    if( fwrite($fp, $image) ){
			$arr = array('code'=>1, 'msg'=>'上传成功', 'url'=>$filename);
			echo json_encode($arr);
		};
    fclose($fp);
?>
