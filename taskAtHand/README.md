///////// [1]

Di bab ini kita akan mempelajari :
~ Tiga komponen dasar dari aplikasi HTML5, HTML, CSS, dan JavaScript
~ Beberapa dasar jQuery untuk anda yang belum familiar dengan JavaScript library
~ Bagaimana menginisialisasi aplikasi dan menangani interaksi pengguna
~ Bagaimana membuat HTML templates yang bisa digunakan kembali
~ bagaimana menggunakan HTML5 Web Storage API untuk menyimpan dan memanggil aplikasi





///// Komponen HTML5 application

			HTML5 Application
JavaScript		HTML		CSS
				HTML5
APIs			Markup		CSS3
Canvas			DOCTYPE		Transforms	
Multimedia		<canvas>	Color
Web Storage		<audio>		Animations
FileAPI			<video>		Text Effects
Drag-and-Drop	<section>	Web Fonts
App Cache		<header>	Backgrounds
Geolocation		<footer>	Gradiends
				<article>	border

Sekarang kita akan membuat struktur folder untuk aplikasi, buat folder dengan nama 'template'.
|-template
|--audio
|--images
|--lib
|--app.css
|--app.html
|--app.js

folder lib nantinya akan kita gunakan untuk menampung selurunh file third-party JavaScript library pada aplikasi.





///// Membuat file HTML

<!DOCTYPE html>
<html>
<head>
	<title>app</title>
	<link rel="stylesheet" href="app.css">
	<script src="lib/jquery-2.2.3.min.js"></script>
	<script src="app.js"></script>
</head>
<body>
	<div id="app">
		<header>app</header>
		<div id="main"></div>
		<footer></footer>
	</div>
</body>
</html>