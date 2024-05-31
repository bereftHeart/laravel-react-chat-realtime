<?php

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

// Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
//     return (int) $user->id === (int) $id;
// });

Broadcast::channel('online', function ($user) {
    return $user ? new UserResource($user) : null;
});

Broadcast::channel('message.user.{user_id1}-{user_id2}', function (User $user, $uid1, $uid2) {
    return $user->id == $uid1 || $user->id == $uid2 ? $user : null;
});

Broadcast::channel('message.group.{group_id}', function (User $user, $group_id) {
    return $user->groups->contains('id', $group_id) ? $user : null;
});

Broadcast::channel('group.deleted.{group_id}', function (User $user, $group_id) {
    return $user->groups->contains('id', $group_id);
});
