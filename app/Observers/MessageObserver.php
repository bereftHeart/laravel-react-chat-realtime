<?php

namespace App\Observers;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Support\Facades\Storage;

class MessageObserver
{
    public function deleting(Message $message)
    {
        $message->attachments->each(function ($attachment) {
            $dir = dirname($attachment->path);
            Storage::disk('public')->deleteDirectory($attachment->path);
            $attachment->delete();
        });

        if ($message->group_id) {
            if ($message->id === $message->group->last_message_id) {
                $message->group->update(['last_message_id' => $message->group->messages()->where('id', '!=', $message->id)->latest()->first()->id]);
            }
        } else {
            $conversation = Conversation::where('last_message_id', $message->id)->first();

            if ($conversation) {
                $prevMsg = Message::where(function ($query) use ($message) {
                    $query->where('sender_id', $message->sender_id)
                        ->where('receiver_id', $message->receiver_id)
                        ->orWhere('sender_id', $message->receiver_id)
                        ->where('receiver_id', $message->sender_id);
                })->where('id', '!=', $message->id)->latest()->first();

                if ($prevMsg) {
                    $conversation->update(['last_message_id' => $prevMsg->id]);
                }
            }
        }
    }
}
