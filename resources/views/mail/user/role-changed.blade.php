<x-mail::message>

    Hi {{ $user->name }},

    @if ($user->is_admin)
        You are now an admin. You can add and block users.
    @else
        Your role was changed into regular user.
    @endif

    Thank you for using our application.
</x-mail::message>
