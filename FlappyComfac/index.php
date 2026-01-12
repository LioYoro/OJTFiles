<?php
session_start();

// If coming from a lost game
$lost = isset($_GET['lose']);

// Handle new game: clear previous name
if(isset($_POST['new_game'])){
    unset($_SESSION['player_name']); // ✅ Clear old name
    $name = '';
}

// Handle new name submission
if(isset($_POST['name'])){
    $_SESSION['player_name'] = strtoupper(substr($_POST['name'],0,3));
    header('Location: game.php');
    exit;
}

// Retrieve current player name (if any)
$name = $_SESSION['player_name'] ?? '';
?>
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Flappy Bird</title>

<style>
html,body{height:100%;margin:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(#4ec0ca,#bdefff);font-family:Arial,Helvetica,sans-serif;}
.wrap{width:420px;height:640px;position:relative;border-radius:12px;box-shadow:0 14px 35px rgba(0,0,0,.25);overflow:hidden;text-align:center;}
#winFace, #loseFace {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 60%;       /* reduce width */
  height: auto;     /* keep aspect ratio */
  max-height: 40%;  /* limit max height */
  display: none;
  pointer-events: none;
  z-index: 10;
  object-fit: contain;
  opacity: 1;    /* optional for lose face overlay */
}
.title{position:absolute;top:110px;width:100%;font-size:42px;font-weight:900;color:#fff;text-shadow:0 4px 12px rgba(0,0,0,.5);z-index:3;}
.menu{position:absolute;bottom:160px;width:100%;z-index:3;}
.menu input{width:60px;font-size:28px;text-align:center;text-transform:uppercase;}
.btn{display:block;width:180px;margin:12px auto;padding:14px 0;font-size:18px;font-weight:800;border-radius:14px;background:#fff;color:#222;text-decoration:none;box-shadow:0 6px 14px rgba(0,0,0,.2);}
.footer{position:absolute;bottom:20px;width:100%;color:#fff;opacity:.9;z-index:3;}
</style>
</head>

<body>
<div class="wrap">

  <!-- Lose overlay -->
<script>
const lost = <?= $lost ? 'true' : 'false' ?>;

const loseFace = document.getElementById('loseFace');

// Only show the lose overlay if the user actually died
if(lost){
  loseFace.style.display='block';
  loseFace.style.opacity='1'; // full visibility when user died
}else{
  loseFace.style.display='none';
}
</script>


  <div class="title">Flappy Bird</div>

  <div class="menu">
    <?php if(!$name): ?>
    <form method="POST">
      <label>Name (3 letters):</label><br>
      <input type="text" name="name" maxlength="3" required pattern="[A-Za-z]{3}"><br>
      <button type="submit" class="btn">▶ Start</button>
    </form>
    <?php else: ?>
      <a href="powerup_game.php" class="btn">▶ Continue</a>
      <form method="POST" style="margin-top:10px;">
        <button type="submit" name="new_game" value="1" class="btn">🔄 New Game</button>
      </form>
    <?php endif; ?>
  </div>

  <div class="footer">
    Click / Tap / Space to flap
  </div>
</div>

<script>
const lost = <?= $lost ? 'true' : 'false' ?>;
if(lost){
  document.getElementById('loseFace').style.display='block';
}
</script>
</body>
</html>
