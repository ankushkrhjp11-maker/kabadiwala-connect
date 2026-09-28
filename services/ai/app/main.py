from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from PIL import Image
import io

app = FastAPI(
    title="Kabadiwala Connect AI Service",
    version="1.0.0",
)


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "kabadiwala-connect-ai",
        "model": "image-validation-demo",
    }


@app.post("/validate-image")
async def validate_image(
    file: UploadFile = File(...),
    selected_category: str = Form(""),
):
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a valid image file.",
        )

    # Read image
    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty.",
        )

    # Verify that the uploaded file is actually a readable image
    try:
        image = Image.open(io.BytesIO(image_bytes))
        image.verify()
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is not a valid image.",
        )

    category = (selected_category or "other").strip().lower()

    # This service currently validates the image itself.
    # Actual ML classification can be plugged in later.
    return {
        "success": True,

        "image": {
            "originalName": file.filename,
            "mimeType": file.content_type,
            "sizeBytes": len(image_bytes),
        },

        "selectedCategory": category,

        "validation": {
            "status": "IMAGE_VALID",
            "decision": "PROCEED",
            "message": "Image uploaded and validated successfully.",
            "model": "image-validation-demo",
            "confidence": None,
        },

        "safety": {
            "status": "VERIFICATION_REQUIRED",
            "message": "Hidden fault cannot be determined from image — Verification Required.",
        },

        "valuation": {
            "status": "PENDING",
            "message": "Final valuation will use category, weight and current market-price data.",
        },
    }