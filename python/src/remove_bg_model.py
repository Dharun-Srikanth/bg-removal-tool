import os
import torch
from torchvision import transforms
from PIL import Image
import numpy as np
from model import U2NET

#loading U^2-Net Model
def load_model(model_path):
    model = U2NET(3, 1) # U^2-Net takes 3-channel input (RGB) and outputs 1-Channel (mask)
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    model.eval()
    return model

# Background removal function
def remove_bg(image_path, output_path, model):
    # Preprocess the input image
    transform = transforms.Compose([
        transforms.Resize((320, 320)), # Resize to match U^2-Net input size
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]) # Normalization
    ])
    image = Image.open(image_path).convert("RGB")
    image_tensor = transform(image).unsqueeze(0) # Add batch dimension

    # Perform inference
    with torch.no_grad():
        output = model(image_tensor)[0]
    mask = output.squeeze().cpu().numpy() # Convert to numpy array
    mask = (mask - mask.min()) / (mask.max() - mask.min()) # Normalize to 0-1

    # Create transparent background
    mask = Image.fromarray((mask * 255).astype('uint8')).resize(image.size)
    image = np.array(image)
    mask = np.array(mask) / 255
    transparent_image = np.dstack((image, (mask * 255).astype('uint8')))

    # Save the output image
    result = Image.fromarray(transparent_image, 'RGBA')
    result.save(output_path)

# Main Function
if __name__ == "__main__":
    model_path = r"server\asset\model\u2net.pth"
    image_path = r"server\asset\img\image4.png"
    output_path = r"server\out\output.png"


    if not os.path.exists(model_path):
        print(f"Model file not found: {model_path}")
        exit(1)
    if not os.path.exists(image_path):
        print(f"Input image not found: {image_path}")
        exit(1)

    # Load the model
    print("Loading model...")
    model = load_model(model_path)
    print("Model loaded successfully.")

    # Remove background
    print("Processing image...")
    remove_bg(image_path, output_path, model)
    print(f"Background removed successfully! Output saved in {output_path}")