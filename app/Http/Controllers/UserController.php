<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'is_admin' => 'boolean',
        ]);

        // $rawPassword = bin2hex(random_bytes(4));
        $rawPassword = '12345678';
        $data['password'] = bcrypt($rawPassword);
        $data['email_verified_at'] = now();

        User::create($data);
        return redirect()->back();
    }

    public function changRole(User $user)
    {
        $user->is_admin = (bool) !$user->is_admin;
        $user->save();
        $message = $user->name . ($user->is_admin ? ' is now an admin.' : ' is no longer an admin.');
    }

    public function block(User $user)
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()->withErrors(['You cannot block yourself.']);
        }

        $user->blocked_at = $user->blocked_at ? null : now();
        $user->save();

        $message = $user->blocked_at ? 'Your account has been blocked.' : 'Your account has been activated.';
        return response()->json(['message' => $message]);
    }
}
