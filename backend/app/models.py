# file for database schema 

from datetime import datetime
from app import db

class RecommendationLog(db.Model):
    __tablename__ = 'recommendation_logs'

    id = db.Column(db.Integer, primary_key=True)
    # user_id = db.Column(db.String(255), nullable=True)     # Stores Supabase User ID (UUID)
    user_email = db.Column(db.String(255), nullable=True)  
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    soil_type = db.Column(db.String(50), nullable=False)
    past_crop = db.Column(db.String(100), nullable=False)
    recommended_crop = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_email': self.user_email,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'soil_type': self.soil_type,
            'past_crop': self.past_crop,
            'recommended_crop': self.recommended_crop,
            'created_at': self.created_at.isoformat()
        }