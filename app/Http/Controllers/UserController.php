<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function create()
    {
        return Inertia::render('Users/Create');
    }

    // ✅ API List
    public function data()
    {
        return response()->json([
            'data' => User::latest()->get(['id','name','email','role','created_at']),
        ]);
    }

    // ✅ Create User
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => ['required','string','max:255'],
            'email'    => ['required','email','max:255','unique:users,email'],
            'role'     => ['required', Rule::in(['admin','staff'])],
            'password' => ['required','string','min:6'],
        ]);

        $user = User::create([
            'name' => trim($data['name']),
            'email' => trim($data['email']),
            'role' => $data['role'],
            'password' => Hash::make($data['password']),
        ]);

        return response()->json([
            'ok' => true,
            'message' => "User created successfully.",
            'data' => $user,
        ]);
    }

    // ✅ Update User Info
    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name'  => ['required','string','max:255'],
            'email' => ['required','email','max:255', Rule::unique('users','email')->ignore($user->id)],
            'role'  => ['required', Rule::in(['admin','staff'])],
        ]);

        $user->update([
            'name' => trim($data['name']),
            'email' => trim($data['email']),
            'role' => $data['role'],
        ]);

        return response()->json([
            'ok' => true,
            'message' => "User updated successfully.",
            'data' => $user,
        ]);
    }

    // ✅ Change Password
    public function updatePassword(Request $request, User $user)
    {
        $data = $request->validate([
            'password' => ['required','string','min:6','confirmed'],
        ]);

        $user->update([
            'password' => Hash::make($data['password']),
        ]);

        return response()->json([
            'ok' => true,
            'message' => "Password updated successfully.",
        ]);
    }

    // ✅ Delete
    public function destroy(User $user)
    {
        // protect self delete
        if (auth()->id() === $user->id) {
            return response()->json([
                'ok' => false,
                'message' => "You cannot delete your own account.",
            ], 403);
        }

        $user->delete();

        return response()->json([
            'ok' => true,
            'message' => "User deleted successfully.",
        ]);
    }
}
