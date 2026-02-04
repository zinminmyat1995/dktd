<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use App\Models\ContactMessage;
use App\Mail\AdminContactReply;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render('Contact/List');
    }

    public function data(Request $request)
    {
        $q = $request->input('q');
        $status = $request->input('status');
        $perPage = $request->input('per_page', 10);
        $sortDir = $request->input('sort_dir', 'desc');
        $sortBy = $request->input('sort_by', 'created_at');

        $query = Contact::query();

        if ($q) {
            $query->where(function($query) use ($q) {
                $query->where('full_name', 'like', "%{$q}%")
                      ->orWhere('email', 'like', "%{$q}%");
            });
        }

        if ($status !== null && $status !== '') {
            $query->where('status', $status);
        }

        $contacts = $query->orderBy($sortBy, $sortDir)
            ->paginate($perPage);

        return response()->json($contacts);
    }

    public function messages(Contact $contact)
    {
        $messages = $contact->messages()
            ->with('admin:id,name')
            ->orderBy('created_at', 'asc')
            ->get();
            
        return response()->json([
            'data' => $messages
        ]);
    }

    public function reply(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            // 1. Send Email
            Mail::to($contact->email)->send(new AdminContactReply($validated['message']));

            // 2. Update Contact Status
            $contact->update([
                'status' => Contact::STATUS_REPLIED,
            ]);

            // 3. Log Message
            ContactMessage::create([
                'contact_id' => $contact->id,
                'status' => ContactMessage::FROM_ADMIN,
                'message' => $validated['message'],
                'admin_id' => auth()->id(),
            ]);

            DB::commit();

            return response()->json([
                'ok' => true,
                'message' => __('messages.admin_reply_success_message'),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Admin reply error: ' . $e->getMessage());
            return response()->json([
                'ok' => false,
                'message' => 'Failed to send reply. ' . $e->getMessage(),
            ], 500);
        }
    }
}