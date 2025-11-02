<!DOCTYPE html>
<html lang="en">
<?php 
// Include required components
include 'components/head.php';
?>
<body>
    <?php 
    // Include page sections
    include 'components/header.php';
    include 'components/main-content.php';
    include 'components/footer.php';
    ?>

    <!-- JavaScript -->
    <script defer src="js/app.js?v=<?php echo time(); ?>"></script>
</body>
</html>