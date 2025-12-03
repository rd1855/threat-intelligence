# backend/main.py - FIXED VERSION
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime
import requests
import os
import re
import hashlib
import time

# Load environment variables
load_dotenv()

# Get environment variables
MONGO_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/threat_intelligence")
VT_API_KEY = os.getenv("VT_API_KEY", "")
OTX_KEY = os.getenv("OTX_KEY", "")

app = FastAPI(title="Threat Intelligence API", version="1.0.0")

# Enable CORS
# In your main.py, update the CORS middleware:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Global variables
client = None
collection = None
rate_limit_cache = {}

@app.on_event("startup")
async def startup_event():
    global client, collection
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        db = client["threat_intelligence"]
        collection = db["reports"]
        print("✅ MongoDB connected successfully")
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    if client:
        client.close()

def check_rate_limit(ip: str, endpoint: str) -> bool:
    """Simple rate limiting"""
    key = f"{ip}:{endpoint}"
    current_time = time.time()
    
    # Clean old entries (older than 60 seconds)
    for k in list(rate_limit_cache.keys()):
        if current_time - rate_limit_cache[k] > 60:
            del rate_limit_cache[k]
    
    if key in rate_limit_cache:
        last_time = rate_limit_cache[key]
        if current_time - last_time < 60:  # 1 minute
            return False
    
    rate_limit_cache[key] = current_time
    return True

def validate_domain(domain: str) -> str:
    """Validate domain input"""
    if not domain:
        raise ValueError("Domain cannot be empty")
    
    domain = domain.strip().lower()
    
    if len(domain) > 253:
        raise ValueError("Domain too long (max 253 characters)")
    
    # Basic domain validation
    if not re.match(r'^[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,})+$', domain):
        raise ValueError("Invalid domain format. Use example.com")
    
    # Block common dangerous patterns
    dangerous_patterns = [
        r'javascript:', r'data:', r'vbscript:', r'on\w+=',
        r'<script', r'</script>', r'alert\(', r'prompt\(', r'confirm\(',
        r'union.*select', r'insert.*into', r'delete.*from', r'drop.*table'
    ]
    
    for pattern in dangerous_patterns:
        if re.search(pattern, domain, re.IGNORECASE):
            raise ValueError("Domain contains potentially malicious content")
    
    return domain

def sanitize_input(text: str) -> str:
    """Simple input sanitization"""
    if not text or not isinstance(text, str):
        return ""
    
    # Remove potentially dangerous characters
    sanitized = re.sub(r'[<>"\';&|`$\\]', '', text)
    
    # Limit length
    return sanitized[:1000].strip()

def scan_otx_mock(domain: str):
    """Mock OTX scan function"""
    return {
        "domain": domain,
        "otx_pulse_count": 0,
        "related_pulses": [],
        "reputation": "N/A",
        "data_source": "Mock Data"
    }

@app.get("/")
def home():
    return {
        "message": "🚀 Backend running successfully!",
        "status": "online",
        "database": "connected" if client else "disconnected",
        "virustotal": "configured" if VT_API_KEY else "not configured",
        "alienvault": "configured" if OTX_KEY else "not configured",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
def health():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/scan")
async def scan_domain(domain: str = Query(..., description="Enter domain to scan")):
    """
    Scan a domain for threats
    """
    try:
        print(f"🔍 Scanning domain: {domain}")
        
        # Validate domain
        validated_domain = validate_domain(domain)
        print(f"✅ Domain validated: {validated_domain}")
        
        # Simple rate limiting (mock IP for now - in production, get real IP)
        ip = "127.0.0.1"
        if not check_rate_limit(ip, "/scan"):
            raise HTTPException(
                status_code=429,
                detail="Too many requests. Please wait 1 minute."
            )
        
        # Create mock response
        result = {
            "domain": validated_domain,
            "timestamp": datetime.now().isoformat(),
            "reputation": 85,
            "last_analysis_stats": {
                "harmless": 72,
                "malicious": 1,
                "suspicious": 2,
                "undetected": 5
            },
            "categories": {
                "forcepoint_security_labs": "clean",
                "alphaMountain.ai": "clean",
                "phishing": "clean",
                "malware": "clean"
            },
            "whois": sanitize_input(f"""Domain: {validated_domain}
Registrar: Example Registrar, Inc.
Creation Date: 1997-09-15T04:00:00Z
Updated Date: 2023-09-14T07:36:12Z
Registrant Country: US
Name Servers: ns1.google.com, ns2.google.com
Status: clientTransferProhibited"""),
            "alienvault_otx": scan_otx_mock(validated_domain),
            "scan_id": hashlib.sha256(f"{validated_domain}{datetime.now().timestamp()}".encode()).hexdigest()[:16]
        }
        
        print(f"📊 Created result for {validated_domain}")
        
        # Save to MongoDB if available
        if collection:
            try:
                # Remove ObjectId before inserting (it will be added by MongoDB)
                result_copy = result.copy()
                insert_result = collection.insert_one(result_copy)
                result["_id"] = str(insert_result.inserted_id)
                result["saved_to_db"] = True
                print(f"💾 Saved to MongoDB with ID: {result['_id']}")
            except Exception as e:
                print(f"❌ Failed to save to MongoDB: {e}")
                result["saved_to_db"] = False
                result["db_error"] = str(e)
        
        print(f"✅ Successfully processed scan for {validated_domain}")
        return result
        
    except ValueError as e:
        print(f"❌ Validation error for {domain}: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        print(f"❌ HTTP Exception for {domain}")
        raise
    except Exception as e:
        print(f"❌ Unexpected error scanning {domain}: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/test/{domain}")
def test_scan(domain: str):
    """Test endpoint without validation"""
    return {
        "domain": domain,
        "message": "Test successful",
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)