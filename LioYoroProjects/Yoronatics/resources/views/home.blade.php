@extends('layouts.app')

@section('title', 'All Posts')

@section('content')

    @if(count($posts) > 0)
        @foreach($posts as $post)
            <h3>{{ $post->title }}</h3>
            <p>{{ $post->body }}</p>
            <small>Created at: {{ $post->created_at }}</small>
            
            <br>
            <a href="/posts/{{ $post->id }}/edit">Edit</a>

            <form method="POST" action="/posts/{{ $post->id }}" style="display:inline;">
                @csrf
                @method('DELETE')
                <button type="submit" onclick="return confirm('Delete this post?')">Delete</button>
            </form>

            <hr>
        @endforeach
    @else
        <p>No posts yet.</p>
    @endif

    <h2>Add New Post</h2>

    <form method="POST" action="/posts">
        @csrf
        <input type="text" name="title" placeholder="Title">
        <br><br>
        <textarea name="body" placeholder="Body"></textarea>
        <br><br>
        <button type="submit">Add Post</button>
    </form>

    @if ($errors->any())
        <div style="color:red;">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

@endsection
