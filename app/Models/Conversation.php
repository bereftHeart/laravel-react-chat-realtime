<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id1',
        'uer_id2',
        'last_message_id',

    ];

    public static function getConversationsForSideBar(User $user)
    {
        $users = User::getUserExceptUser($user);
        $groups = Group::getGroupForUser($user);

        return $users->map(function (User $usr) {
            return $usr->toConversationArray();
        })->concat($groups->map(function (Group $grp) {
            return $grp->toConversationArray();
        }));
    }

    public static function updateMessage($receiver_id, $sender_id, Message $message)
    {
        $conversation = Conversation::where('user_id1', $receiver_id)
            ->where('user_id2', $sender_id)
            ->orWhere('user_id1', $sender_id)
            ->where('user_id2', $receiver_id)
            ->first();

        if ($conversation) {
            $conversation->last_message_id = $message->id;
            $conversation->save();
        } else {
            Conversation::create([
                'user_id1' => $receiver_id,
                'user_id2' => $sender_id,
                'last_message_id' => $message->id,
            ]);
        }
    }
}
