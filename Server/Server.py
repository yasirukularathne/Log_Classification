import sys
import os
import pandas as pd
from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import uuid
from typing import List, Optional
from pydantic import BaseModel

# Add parent directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Import classification functionality
from processor.classify import classify

# Create output directory if it doesn't exist
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "Sources")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Create FastAPI app
app = FastAPI(
    title="Log Classification API",
    description="API for classifying log messages from various sources",
    version="1.0.0"
)

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Response models
class ClassificationResult(BaseModel):
    job_id: str
    message: str
    file_url: str
    row_count: int

class LogEntry(BaseModel):
    source: str
    log_message: str

class ClassificationResponse(BaseModel):
    classification: str

@app.get("/")
async def root():
    """API root endpoint with basic information"""
    return {
        "message": "Log Classification API",
        "version": "1.0.0",
        "endpoints": {
            "POST /classify": "Upload CSV file for classification",
            "POST /classify/single": "Classify a single log entry",
            "GET /docs": "API documentation"
        }
    }

@app.post("/classify/", response_model=ClassificationResult)
async def classify_logs(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    """
    Upload a CSV file for log classification
    
    The CSV must contain 'source' and 'log_message' columns.
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV.")
    
    try:
        # Read the uploaded CSV
        df = pd.read_csv(file.file)
        if "source" not in df.columns or "log_message" not in df.columns:
            raise HTTPException(status_code=400, detail="CSV must contain 'source' and 'log_message' columns.")

        # Generate unique ID for this job
        job_id = str(uuid.uuid4())
        output_file = os.path.join(UPLOAD_DIR, f"classified_{job_id}.csv")
        
        # Perform classification
        df["target_label"] = classify(list(zip(df["source"], df["log_message"])))
        
        # Save the modified file
        df.to_csv(output_file, index=False)
        
        # Generate response with download URL
        download_url = f"/download/{os.path.basename(output_file)}"
        
        return ClassificationResult(
            job_id=job_id,
            message="Classification completed successfully",
            file_url=download_url,
            row_count=len(df)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        file.file.close()

@app.post("/classify/single", response_model=ClassificationResponse)
async def classify_single_log(log_entry: LogEntry):
    """
    Classify a single log entry
    """
    try:
        # Use the same classification logic from our module
        result = classify([(log_entry.source, log_entry.log_message)])[0]
        return ClassificationResponse(classification=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/download/{filename}")
async def download_file(filename: str):
    """
    Download a classified CSV file
    """
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
        
    return FileResponse(
        path=file_path, 
        filename=filename,
        media_type="text/csv"
    )

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    # Run the server
    uvicorn.run("Server:app", host="0.0.0.0", port=8000, reload=True)