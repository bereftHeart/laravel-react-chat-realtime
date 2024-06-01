<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;

Route::middleware(['auth', 'verified', 'active'])->group(function () {
    Route::redirect('/', 'dashboard');
    Route::get('/dashboard', [HomeController::class, 'home'])->name('dashboard');
    Route::get('user/{user}', [MessageController::class, 'byUser'])->name('chat.user');
    Route::get('group/{group}', [MessageController::class, 'byGroup'])->name('chat.group');
    Route::resource('group', GroupController::class)->only(['store', 'update', 'destroy']);
    Route::resource('message', MessageController::class)->only(['store', 'destroy']);
    Route::get('message/{message}/older', [MessageController::class, 'loadOlder'])->name('message.loadOlder');

    Route::middleware('admin')->group(function () {
        Route::post('user', [UserController::class, 'store'])->name('user.store');
        Route::post('user/{user}/change-role', [UserController::class, 'changeRole'])->name('user.changeRole');
        Route::post('user/{user}/block', [UserController::class, 'block'])->name('user.block');
    });
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
