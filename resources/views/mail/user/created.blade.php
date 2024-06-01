<x-mail::message>
    Hi {{ $user->name }},

    Your account has been created successfully.

    **Here are your login details:**
    Email: {{ $user->email }}
    Password: {{ $password }}
    Please login and change your password

    <x-mail::button url="{{ route('login') }}" color="primary">Verify</x-mail::button>

    Thank you for using our application.
</x-mail::message>
