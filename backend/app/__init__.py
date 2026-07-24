# flask engine initialisation file

import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy

load_dotenv()

db=SQLAlchemy()

load_dotenv()

def create_app():
    """Application factory function to initialize and configure the Flask web server."""
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}}) 

    # DATABASE
    db_url = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    with app.app_context():
        from app.models import RecommendationLog  
        try:
            db.create_all() 
            print(" SUCCESS: Connected to PostgreSQL & Synced Tables!", flush=True)
        except Exception as e:
            print(f"\n PostgreSQL Connection Error: {e}\n", flush=True)


        # from . import routes
    
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'fallback-secret-key')

    from app.routes import app as routes_bp
    app.register_blueprint(routes_bp)

    
    return app