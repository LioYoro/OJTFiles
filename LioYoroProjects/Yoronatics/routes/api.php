<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostApiController;

Route::apiResource('posts', PostApiController::class);
Route::get('/posts', [PostApiController::class, 'index']);
Route::post('/posts', [PostApiController::class, 'store']);
Route::put('/posts/{post}', [PostApiController::class, 'update']);
Route::delete('/posts/{post}', [PostApiController::class, 'destroy']);
