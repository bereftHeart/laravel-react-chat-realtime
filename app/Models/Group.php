<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'owner_id',
        'last_message_id'
    ];

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'group_users');
    }

    public static function getGroupForUser(User $user)
    {
        // return Group::where('owner_id', $user->id)->get();
        return self::select(['groups.*', 'messages.message as last_message', 'messages.created_at as last_message_date'])
            // get the groups where the user is a member
            ->join('group_users', 'groups.id', '=', 'group_users.group_id')
            ->leftJoin('messages', 'groups.last_message_id', '=', 'messages.id')
            ->where('group_users.user_id', $user->id)
            // sort by the last message
            ->orderBy('messages.created_at', 'desc')
            // sort by the group name
            ->orderBy('groups.name', 'asc')
            ->get();
    }

    public function toConversationArray()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'is_group' => true,
            'is_user' => false,
            'owner_id' => $this->owner_id,
            'users' => $this->users,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'last_message' => $this->last_message,
            'last_message_date' => $this->last_message_date,
        ];
    }

    public static function updateMessage($group_id, Message $message)
    {
        return self::updateOrCreate(
            ['id' => $group_id],
            ['last_message_id' => $message->id]
        );
    }
}
