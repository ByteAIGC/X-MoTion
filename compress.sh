#!/bin/bash

# Script to compress videos - can process single file or all videos in assets_x
# Usage: 
#   ./compress.sh                    # Compress all videos in assets_x
#   ./compress.sh video.mp4          # Compress single video file

set -euo pipefail

BASE_DIR="/Users/bytedance/Desktop/xmotion/xmotion-page/public/assets_x"

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "Error: ffmpeg is not installed."
    exit 1
fi

# Function to compress a single video
compress_video() {
    local file="$1"
    
    echo "Processing: $file"
    
    # Check if file exists
    if [ ! -f "$file" ]; then
        echo "  ✗ Error: File not found: $file"
        return 1
    fi
    
    # Get original file size
    original_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
    original_size_mb=$(echo "scale=2; $original_size / 1024 / 1024" | bc)
    
    # Create temp file with .mp4 extension
    temp_file="${file%.mp4}.tmp.mp4"
    
    # Compress (explicitly specify format)
    if ffmpeg -i "$file" \
        -f mp4 \
        -c:v libx264 \
        -crf 28 \
        -preset slow \
        -movflags +faststart \
        -c:a aac \
        -b:a 128k \
        -y \
        "$temp_file" 2>&1 | grep -v "frame=" | grep -v "size=" | grep -v "time=" || true; then
        
        # Check if compression succeeded
        if [ -f "$temp_file" ]; then
            # Get compressed file size
            compressed_size=$(stat -f%z "$temp_file" 2>/dev/null || stat -c%s "$temp_file" 2>/dev/null)
            compressed_size_mb=$(echo "scale=2; $compressed_size / 1024 / 1024" | bc)
            reduction=$(echo "scale=1; (1 - $compressed_size / $original_size) * 100" | bc)
            
            # Replace original
            mv "$temp_file" "$file"
            echo "  ✓ Done: ${original_size_mb}MB → ${compressed_size_mb}MB (${reduction}% reduction)"
            return 0
        else
            echo "  ✗ Failed: Temp file not created"
            return 1
        fi
    else
        echo "  ✗ Failed: Compression error"
        rm -f "$temp_file"
        return 1
    fi
}

# If argument provided, compress single file
if [ $# -gt 0 ]; then
    file="$1"
    
    # If relative path, try to find in BASE_DIR first
    if [ ! -f "$file" ]; then
        # Try to find in assets_x
        found_file=$(find "$BASE_DIR" -name "$(basename "$file")" -type f 2>/dev/null | head -1)
        if [ -n "$found_file" ]; then
            file="$found_file"
        fi
    fi
    
    compress_video "$file"
else
    # No argument: compress all videos in BASE_DIR
    echo "Compressing all videos in $BASE_DIR..."
    echo ""
    
    total=0
    processed=0
    failed=0
    
    # Process all MP4 files using null-delimited output for safety
    while IFS= read -r -d '' file; do
        total=$((total + 1))
        if compress_video "$file"; then
            processed=$((processed + 1))
        else
            failed=$((failed + 1))
        fi
        echo ""
    done < <(find "$BASE_DIR" -type f -name "*.mp4" -print0)
    
    echo "================================"
    echo "Compression Complete!"
    echo "Total: $total | Processed: $processed | Failed: $failed"
fi