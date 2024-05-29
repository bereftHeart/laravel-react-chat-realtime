<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Group;
use App\Models\Message;
use Illuminate\Support\Str;
use App\Models\Conversation;
use Illuminate\Http\Request;
use App\Events\SocketMessage;
use App\Models\MessageAttachment;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Cache\Store;
use App\Http\Resources\MessageResource;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\UserResource;

class MessageController extends Controller
{
    public function byUser(User $user)
    {
        $messages = Message::where('sender_id', auth()->id())
            ->where('receiver_id', $user->id)
            ->orWhere('sender_id', $user->id)
            ->where('receiver_id', auth()->id())
            ->latest()
            ->paginate(10);

        // return $user->toConversationArray();
        return Inertia('Dashboard', [
            'selectedConversation' => $user->toConversationArray(),
            'messages' => MessageResource::collection($messages),
            'receiver' => new UserResource($user)
        ]);
    }

    public function byGroup(Group $group)
    {
        $messages = $group->messages()
            ->latest()
            ->paginate(10);

        return Inertia('Dashboard', [
            'selectedConversation' => $group->toConversationArray(),
            'messages' => MessageResource::collection($messages),
        ]);
    }

    public function loadOlder(Message $message)
    {
        // return $message->id;
        if ($message->group_id) {
            $messages = Message::where('group_id', $message->group_id)
                ->where('created_at', '<', $message->created_at)
                ->latest()
                ->paginate(10);
        } else {
            $messages = Message::where('created_at', '<', $message->created_at)
                ->where(function ($query) use ($message) {
                    $query->where('sender_id', $message->sender_id)
                        ->where('receiver_id', $message->receiver_id)
                        ->orWhere('sender_id', $message->receiver_id)
                        ->where('receiver_id', $message->sender_id);
                })
                ->latest()
                ->paginate(10);
        }

        return MessageResource::collection($messages);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  StoreMessageRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreMessageRequest $request)
    {
        $data = $request->validated();
        $data['sender_id'] = auth()->id();
        $receiver_id = $data['receiver_id'] ?? null;
        $group_id = $data['group_id'] ?? null;


        DB::beginTransaction();

        try {
            $message = Message::create($data);

            if ($request->has('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $directory = 'attachments/' . date('Y-m-d/h:i:s') . Str::random(10);
                    Storage::disk('public')->makeDirectory($directory);

                    $attachments[] = [
                        'message_id' => $message->id,
                        'name' => $file->getClientOriginalName(),
                        'mime' => $file->getClientMimeType(),
                        'size' => $file->getSize(),
                        'path' => $file->store($directory, 'public')
                    ];

                    $message->attachments()->createMany($attachments);
                }
            }

            DB::commit();

            if ($receiver_id) {
                Conversation::updateMessage($receiver_id, auth()->id(), $message);
            }

            if ($group_id) {
                Group::updateMessage($group_id, $message);
            }

            SocketMessage::dispatch($message);

            return response()->json($message, 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(['error' => 'Failed to store message: ' . $e->getMessage()], 500);
        }

        if ($receiver_id) {
            Conversation::updateMessage($receiver_id, auth()->id(), $message);
        }

        if ($group_id) {
            Group::updateMessage($group_id, $message);
        }

        SocketMessage::dispatch($message);

        return new MessageResource($message);
    }

    /** 
     * Remove the specified resource from storage.
     * @param  Message  $message
     * @return \Illuminate\Http\Response
     */
    public function destroy(Message $message)
    {
        if ($message->sender_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $message->delete();
        return response()->noContent();
    }
}
