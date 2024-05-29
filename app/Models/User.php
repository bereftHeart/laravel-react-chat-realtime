<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'avatar',
        'is_admin',
        'name',
        'email',
        'password',
        'email_verified_at',
        'blocked_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_users');
    }

    public static function getUserExceptUser(User $user)
    {
        $uid = $user->id;
        return User::select(['users.*', 'messages.message as last_message', 'messages.created_at as last_message_date'])
            // get all users with their last messages except this user
            ->where('users.id', '!=', $uid)
            // if this user is NOT admin then filter users that are not blocked
            ->when(!$user->is_admin, function ($query) {
                $query->whereNull('users.blocked_at');
            })
            // join on conversations that one of the two users of the conversation must be this user
            ->leftJoin('conversations', function ($join) use ($uid) {
                $join->on('conversations.user_id1', '=', 'users.id')
                    ->where('conversations.user_id2', '=',  $uid)
                    ->orWhere(function ($query) use ($uid) {
                        $query->on('conversations.user_id2', '=', 'users.id')
                            ->where('conversations.user_id1', '=', $uid);
                    });
            })
            // join on messages to get the last message
            ->leftJoin('messages', 'messages.id', '=', 'conversations.last_message_id')
            // users that have been blocked should be at the bottom
            ->orderByRaw('IFNULL(users.blocked_at, 1)')
            // sort by latest message
            ->orderBy('messages.created_at', 'desc')
            // also sort by name
            ->orderBy('users.name', 'asc')
            ->get();
    }

    public function toConversationArray()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'avatar' => $this->avatar,
            'is_user' => true,
            'is_group' => false,
            'is_admin' => (bool) $this->is_admin,
            'last_message' => $this->last_message,
            'last_message_date' => $this->last_message_date ? $this->last_message_date . ' UTC' : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'blocked_at' => $this->blocked_at
        ];
    }
}
