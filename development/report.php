<?php 
header("Content-Type: application/json");

$priv_key = file_get_contents('private.key');
$pub_key = file_get_contents("public.key");

if(isset($_GET['pubkey'])) {
	echo json_encode([
		'publicKey' => $pub_key
	]);
	exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$parsed = "";

for($i = 0; $i < count($data); $i++) {
	openssl_private_decrypt(base64_decode($data[$i]), $decrypted, $priv_key);
	$parsed .= $decrypted;
}

file_put_contents("report.json", $parsed);