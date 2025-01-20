import React from 'react';
import { Link } from 'react-router-dom';

function FeatureCard({ title, description, link }) {
    return (
        <div className="feature-card">
            <div className="card-content">
                <h3 className="card-title">{title}</h3>
                <p className="card-description">{description}</p>
                <Link to={link} className="card-link">
                    了解更多 / Learn More
                </Link>
            </div>
        </div>
    );
}

export default FeatureCard; 