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
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    with app.app_context():
        try:
            db.session.execute(db.text('SELECT 1'))
            print(" Connected to PostgreSQL database successfully!")
        except Exception as e:
            print(f" PostgreSQL Connection Failed: {e}")

        # Deferred route imports to prevent circular references
        from . import routes
    
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'fallback-secret-key')

    from app.routes import app as routes_bp
    app.register_blueprint(routes_bp)

    
    return app