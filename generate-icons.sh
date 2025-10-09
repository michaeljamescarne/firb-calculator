#!/bin/bash

# Create placeholder PNG icons for PWA
# This script creates simple colored squares as placeholder icons

# Icon sizes required by manifest.json
sizes=(72 96 128 144 152 192 384 512)

# Create a simple colored square for each size
for size in "${sizes[@]}"; do
    # Create a simple PNG using ImageMagick (if available) or create a placeholder
    if command -v convert &> /dev/null; then
        convert -size ${size}x${size} xc:"#2563eb" -fill white -pointsize $((size/8)) -gravity center -annotate +0+0 "FIRB" icons/icon-${size}x${size}.png
    else
        # Create a simple HTML file that can be converted to PNG
        cat > icons/icon-${size}x${size}.html << EOF
<!DOCTYPE html>
<html>
<head>
    <style>
        body { margin: 0; padding: 0; }
        .icon {
            width: ${size}px;
            height: ${size}px;
            background: linear-gradient(135deg, #2563eb, #1d4ed8);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: Arial, sans-serif;
            font-size: $((size/8))px;
            font-weight: bold;
            border-radius: $((size/8))px;
        }
    </style>
</head>
<body>
    <div class="icon">FIRB</div>
</body>
</html>
EOF
        echo "Created placeholder HTML for icon-${size}x${size}.png"
    fi
done

echo "Icon generation complete!"
echo "Note: For production, replace these placeholder icons with proper PNG files."
