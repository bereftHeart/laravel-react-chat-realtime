<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Mail\UserActive;
use App\Mail\UserCreated;
use App\Mail\UserRoleChanged;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'is_admin' => 'boolean',
        ]);

        $rawPassword = bin2hex(random_bytes(4));
        $data['password'] = bcrypt($rawPassword);
        $data['email_verified_at'] = now();

        $user = User::create($data);

        Mail::to($user)->send(new UserCreated($user, $rawPassword));

        return redirect()->back();
    }

    public function changeRole(User $user)
    {
        $user->is_admin = (bool) !$user->is_admin;
        $user->save();
        $message = $user->name . ($user->is_admin ? ' is now an admin.' : ' is no longer an admin.');

        Mail::to($user)->send(new UserRoleChanged($user));

        return response()->json(['message' => $message]);
    }

    public function block(User $user)
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()->withErrors(['You cannot block yourself.']);
        }

        $user->blocked_at = $user->blocked_at ? null : now();
        $user->save();

        Mail::to($user)->send(new UserActive($user));

        $message = 'User "' . $user->name . ($user->blocked_at ? '" has been blocked.' : ' has been activated.');
        return response()->json(['message' => $message]);
    }
}
