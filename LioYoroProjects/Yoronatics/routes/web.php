<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;

// Show all posts & form
Route::get('/', [HomeController::class, 'index']);

// Handle new post submission
Route::post('/posts', [HomeController::class, 'store']);

// Show edit form for a specific post
Route::get('/posts/{post}/edit', [HomeController::class, 'edit']);

// Handle update submission
Route::put('/posts/{post}', [HomeController::class, 'update']);

// Delete a post
Route::delete('/posts/{post}', [HomeController::class, 'destroy']);
