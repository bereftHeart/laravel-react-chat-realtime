<x-mail::message>
    Hi {{ $user->name }},

    @if ($user->blocked_at)
        Your account has been blocked.
    @else
        Your account has been activated successfully. You can normally use our system.
        <x-mail::button url="{{ route('login') }}" color="primary">Click to login</x-mail::button>
    @endif

    Thank you for using our application.
</x-mail::message>
