@extends('layouts.app')

@section('title', 'Edit Post')

@section('content')

    <h2>Edit Post</h2>

    <form method="POST" action="/posts/{{ $post->id }}">
        @csrf
        @method('PUT')

        <input type="text" name="title" value="{{ $post->title }}" placeholder="Title">
        <br><br>
        <textarea name="body" placeholder="Body">{{ $post->body }}</textarea>
        <br><br>
        <button type="submit">Update Post</button>
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

    <br>
    <a href="/">Back to Posts</a>

@endsection
