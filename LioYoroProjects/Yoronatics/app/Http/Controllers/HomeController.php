<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        $posts = Post::all();
        return view('home', ['posts' => $posts]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|max:255',
            'body'  => 'required'
        ]);

        Post::create($request->only('title', 'body'));

        return redirect('/');
    }

    // Show edit form
    public function edit(Post $post)
    {
        return view('edit', ['post' => $post]);
    }

    // Handle update
    public function update(Request $request, Post $post)
    {
        $request->validate([
            'title' => 'required|max:255',
            'body'  => 'required'
        ]);

        $post->update($request->only('title', 'body'));

        return redirect('/');
    }

    // Handle delete
    public function destroy(Post $post)
    {
        $post->delete();
        return redirect('/');
    }
}
