# PowerShell script to create simple placeholder icons for the weather extension
# This creates basic colored squares as placeholder icons for testing

Add-Type -AssemblyName System.Drawing

function Create-Icon {
    param(
        [int]$Size,
        [string]$FilePath
    )
    
    # Create bitmap
    $bitmap = New-Object System.Drawing.Bitmap($Size, $Size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Create gradient background (blue to light blue)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        [System.Drawing.Point]::new(0, 0),
        [System.Drawing.Point]::new($Size, $Size),
        [System.Drawing.Color]::FromArgb(70, 130, 180),  # Steel Blue
        [System.Drawing.Color]::FromArgb(135, 206, 235)  # Sky Blue
    )
    
    # Fill background
    $graphics.FillRectangle($brush, 0, 0, $Size, $Size)
    
    # Add weather icon (sun symbol)
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 255, 255), [math]::Max(1, $Size / 16))
    $sunSize = $Size * 0.4
    $sunX = ($Size - $sunSize) / 2
    $sunY = ($Size - $sunSize) / 2
    
    # Draw sun circle
    $graphics.DrawEllipse($pen, $sunX, $sunY, $sunSize, $sunSize)
    
    # Draw sun rays
    $rayLength = $Size * 0.15
    $centerX = $Size / 2
    $centerY = $Size / 2
    $innerRadius = $sunSize / 2
    
    for ($i = 0; $i -lt 8; $i++) {
        $angle = $i * 45 * [Math]::PI / 180
        $startX = $centerX + $innerRadius * [Math]::Cos($angle)
        $startY = $centerY + $innerRadius * [Math]::Sin($angle)
        $endX = $centerX + ($innerRadius + $rayLength) * [Math]::Cos($angle)
        $endY = $centerY + ($innerRadius + $rayLength) * [Math]::Sin($angle)
        
        $graphics.DrawLine($pen, $startX, $startY, $endX, $endY)
    }
    
    # Save the image
    $bitmap.Save($FilePath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Cleanup
    $graphics.Dispose()
    $bitmap.Dispose()
    $brush.Dispose()
    $pen.Dispose()
}

# Create icons directory if it doesn't exist
$iconsDir = "D:\weather loctaion\weather\icons"
if (!(Test-Path $iconsDir)) {
    New-Item -ItemType Directory -Path $iconsDir -Force
}

# Create different sized icons
Write-Host "Creating placeholder icons..."

try {
    Create-Icon -Size 16 -FilePath "$iconsDir\icon16.png"
    Write-Host "Created icon16.png"
    
    Create-Icon -Size 32 -FilePath "$iconsDir\icon32.png"
    Write-Host "Created icon32.png"
    
    Create-Icon -Size 48 -FilePath "$iconsDir\icon48.png"
    Write-Host "Created icon48.png"
    
    Create-Icon -Size 128 -FilePath "$iconsDir\icon128.png"
    Write-Host "Created icon128.png"
    
    Write-Host "All icons created successfully!" -ForegroundColor Green
    Write-Host "Icons saved in: $iconsDir" -ForegroundColor Yellow
}
catch {
    Write-Host "Error creating icons: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "You can manually create PNG files with these names and sizes in the icons folder:" -ForegroundColor Yellow
    Write-Host "- icon16.png (16x16 pixels)"
    Write-Host "- icon32.png (32x32 pixels)"
    Write-Host "- icon48.png (48x48 pixels)"
    Write-Host "- icon128.png (128x128 pixels)"
}
