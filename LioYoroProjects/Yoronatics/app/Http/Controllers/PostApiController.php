<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostApiController extends Controller
{
    // GET /api/posts
    public function index()
    {
        return Post::all(); // returns JSON
    }

    // POST /api/posts
    public function store(Request $request)
    {
        $post = Post::create($request->only('title', 'body'));
        return response()->json($post, 201);
    }

    // PUT /api/posts/{post}
    public function update(Request $request, Post $post)
    {
        $request->validate([
            'title' => 'required',
            'body' => 'required'
        ]);

        $post->update($request->only('title', 'body'));

        return response()->json($post, 200);
    }

    // DELETE /api/posts/{post}
    public function destroy(Post $post)
    {
        $post->delete();
        return response()->json(['message' => 'Deleted'], 200);
    }
}
