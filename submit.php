<?php
$host = 'localhost';
$dbname = 'k2si'; // ← あなたのDB名に合わせて変更
$user = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data)) {
        http_response_code(400);
        echo "データが空です";
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO K2SI_pos (price) VALUES (:price)");

    foreach ($data as $item) {
        $stmt->bindValue(':price', $item['price'], PDO::PARAM_INT);
        $stmt->execute();
    }

    echo "保存成功";
} catch (PDOException $e) {
    http_response_code(500);
    echo "エラー: " . $e->getMessage();
}
?>
