#!/bin/bash

# Create placeholder icons for all required sizes
sizes=(72 96 128 144 152 192 384 512)

for size in "${sizes[@]}"; do
    cat > "icons/icon-${size}x${size}.png" << EOF
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="${size}" height="${size}" rx="8" fill="#1e40af"/>
<path d="M${size/2} ${size/4}L${size*3/4} ${size/2}H${size*5/8}V${size*3/4}H${size*3/8}V${size/2}H${size/4}L${size/2} ${size/4}Z" fill="white"/>
<path d="M${size/4} ${size*2/3}H${size*3/4}V${size*5/6}H${size/4}V${size*2/3}Z" fill="white"/>
</svg>
EOF
done

echo "Created placeholder icons for sizes: ${sizes[*]}"
