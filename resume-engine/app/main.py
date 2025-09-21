import zipfile
import io
import traceback # Import the traceback module
from fastapi import FastAPI, HTTPException
from starlette.responses import StreamingResponse
from .models import GenerationRequest
from .generator import ResumeGenerator

app = FastAPI()
generator = ResumeGenerator()

@app.post("/generate")
async def generate_resume(request: GenerationRequest):
    try:
        generated_files = generator.generate(
            request.template_name,
            request.resume_data.dict()
        )
        
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED, False) as zip_file:
            zip_file.write(generated_files["pdf_path"], arcname="resume.pdf")
            zip_file.write(generated_files["tex_path"], arcname="resume.tex")
            zip_file.write(generated_files["json_path"], arcname="resume.json")
        
        zip_buffer.seek(0)
        
        return StreamingResponse(
            zip_buffer,
            media_type="application/x-zip-compressed",
            headers={"Content-Disposition": f"attachment; filename=resume_files.zip"}
        )
    except Exception as e:
        # This will print the full, detailed Python error to your terminal
        print("--- DETAILED PYTHON ERROR ---")
        traceback.print_exc()
        print("---------------------------")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")