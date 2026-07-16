import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv


load_dotenv()

def create_app():
    """Application factory function to initialize and configure the Flask web server."""
    app = Flask(__name__)
    
    CORS(app, resources={r"/api/*": {"origins": "*"}}) 
    
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'fallback-secret-key')
    
    from app import routes
    
    
    return app