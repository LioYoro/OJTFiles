<!DOCTYPE html>
<html>
<head>
    <title>@yield('title', 'Yoronatics')</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1, h2 { color: #2c3e50; }
        hr { margin: 20px 0; }
        input, textarea { width: 300px; padding: 5px; }
        button { padding: 5px 10px; cursor: pointer; }
        a { margin-right: 10px; }
    </style>
</head>
<body>

    <h1>Yoronatics Posts</h1>

    @yield('content')

</body>
</html>
