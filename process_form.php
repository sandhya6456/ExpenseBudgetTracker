<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $text = $_POST['text'];
    $amount = $_POST['amount'];

    // Validate and sanitize input
    $text = trim($text);
    $amount = filter_var($amount, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    $conn = mysqli_connect("localhost", "root", '', "expense_tracker");
    if (!$conn) {
        die("ERROR: Could not connect. " . mysqli_connect_error());
    }

    $stmt = $conn->prepare("INSERT INTO transactions (text, amount) VALUES (?, ?)");
    $stmt->bind_param("sd", $text, $amount);

    // Execute the statement
    if ($stmt->execute()) {
        echo "Transaction added successfully.";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
    $stmt->close();
    $conn->close();
}
?>