<!DOCTYPE html>
<html>
<head>
    <title>New Contact Inquiry</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #185C9B;">New Contact Inquiry</h2>
        <p>You have received a new message from the contact form.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> {{ $data['name'] }}</p>
            <p><strong>Email:</strong> {{ $data['email'] }}</p>
        </div>

        <h3>Message:</h3>
        <div style="background-color: #fff; border: 1px solid #ddd; padding: 15px; border-radius: 5px;">
            <p style="white-space: pre-wrap;">{{ $data['message'] }}</p>
        </div>

        <p style="margin-top: 30px; font-size: 12px; color: #888;">
            This email was sent from the DKTD Genki website contact form.
        </p>
    </div>
</body>
</html>
