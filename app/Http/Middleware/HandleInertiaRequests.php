<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\File;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {

        $locale = app()->getLocale();

        // lang/{locale}/messages.php ကို array အဖြစ်ဖတ်
        $messages = [];
        $path = lang_path($locale.'/messages.php');

        if (File::exists($path)) {
            $messages = require $path;
        }

        return [
            ...parent::share($request),

            'auth' => [
                    'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                ] : null,
            ],

            // ✅ language locale ကိုထပ်ပေါင်း
            'locale' => app()->getLocale(),
            'translations' => [
                'messages' => $messages,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
