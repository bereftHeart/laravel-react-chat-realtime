<?php

namespace Database\Factories;

use App\Models\Group;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Message>
 */
class MessageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // $senderID = fake()->randomElement([0, 1]);
        // if ($senderID === 0) {
        //     $senderID = fake()->randomElement(User::where('id', '!=', 1)->pluck('id')->toArray());
        //     $receiverID = 1;
        // } else {
        //     $receiverID = fake()->randomElement(User::where('id', '!=', 1)->pluck('id')->toArray());
        // }

        $senderID = fake()->randomElement(User::pluck('id')->toArray());
        $receiverID = fake()->randomElement(User::where('id', '!=', $senderID)->pluck('id')->toArray());


        $groupID = null;
        if (fake()->boolean()) {
            $groupID = fake()->randomElement(Group::pluck('id')->toArray());
            $group = Group::find($groupID);
            $senderID = fake()->randomElement($group->users->pluck('id')->toArray());
            $receiverID = null;
        }
        return [
            'sender_id' => $senderID,
            'receiver_id' => $receiverID,
            'group_id' => $groupID,
            'message' => fake()->realText(100),
            'created_at' => fake()->dateTimeBetween('-1 year', 'now')
        ];
    }
}
