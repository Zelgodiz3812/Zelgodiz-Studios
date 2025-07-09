from PIL import Image, ImageDraw

# Create a 256x256 image with a simple design
img = Image.new('RGBA', (256, 256), (30, 144, 255, 255))  # Dodger blue background
draw = ImageDraw.Draw(img)
draw.ellipse((56, 56, 200, 200), fill=(255, 255, 255, 255))  # White circle
img.save('icon.ico', format='ICO', sizes=[(256, 256), (128, 128), (64, 64), (32, 32), (16, 16)])
print('icon.ico generated successfully.')
