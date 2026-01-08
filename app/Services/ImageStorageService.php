<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ImageStorageService
{
    /**
     * Store image under: storage/app/public/{folder}
     * Save path in DB as: /storage/{folder}/xxx.jpg
     */
    public function store(?UploadedFile $file, string $folder = 'products'): ?string
    {
        if (!$file) return null;

        // ✅ Save to: storage/app/public/{folder}
        $path = $file->store($folder, 'public'); 
        // Example: menu/abc.jpg OR daily_menu/abc.jpg

        // ✅ Save into DB: /storage/menu/abc.jpg (NO localhost)
        return '/storage/' . $path;
    }

    /**
     * ✅ Delete old image file (from DB path)
     * DB path example: /storage/menu/abc.jpg
     * public disk path: menu/abc.jpg
     */
    public function deleteOld(?string $oldPath): void
    {
        if (!$oldPath) return;

        // Only delete if it is /storage/ path (our uploaded file)
        if (!str_starts_with($oldPath, '/storage/')) return;

        // Convert /storage/menu/abc.jpg -> menu/abc.jpg
        $publicPath = ltrim(str_replace('/storage/', '', $oldPath), '/');

        if ($publicPath && Storage::disk('public')->exists($publicPath)) {
            Storage::disk('public')->delete($publicPath);
        }
    }

    /**
     * ✅ Replace old image with new one (delete old first then store new)
     */
    public function storeReplace(?UploadedFile $file, ?string $oldPath, string $folder = 'menu'): ?string
    {
        if (!$file) {
            // If no new file uploaded, keep old path
            return $oldPath;
        }

        // ✅ Delete old file first
        $this->deleteOld($oldPath);

        // ✅ Store new file
        return $this->store($file, $folder);
    }
}
