import React, { useState, useEffect } from 'react';
import { Select, Card, Avatar, Rate, Typography, Button, Spin } from 'antd';
import './App.css';

const { Option } = Select;
const { Title, Text } = Typography;

function Reviews({ reviews }) {
    return (
        <div className="reviews-container">
            {reviews.map(review => (
                <Card key={review.reviewId} style={{ marginTop: 16 }}>
                    <Card.Meta
                        avatar={<Avatar src={review.reviewer.profilePhotoUrl} />}
                        title={review.reviewer.displayName}
                        description={review.comment}
                    />
                    <Rate disabled value={parseInt(review.starRating, 10)} />
                    <Text type="secondary">{new Date(review.createTime).toLocaleDateString()}</Text>
                </Card>
            ))}
        </div>
    );
}

function App() {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [reviews, setReviews] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const API_URL = 'https://rag-gmb-73f4cd98333b.herokuapp.com';

    useEffect(() => {
        // Check if authenticated
        fetch(`${API_URL}/isAuthenticated`)
            .then(response => response.json())
            .then(data => {
                setIsAuthenticated(data.isAuthenticated);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                alert('Error checking authentication status.');
            });

        // Fetch locations from Flask app
        fetch(`${API_URL}/getLocations`)
            .then(response => response.json())
            .then(data => {
                setLocations(data.locations);
            })
            .catch(() => {
                alert('Error fetching locations.');
            });
    }, []);

    useEffect(() => {
        if (selectedLocation) {
            setLoading(true);
            fetch(`${API_URL}/getReviews/${selectedLocation}`)
                .then(response => response.json())
                .then(data => {
                    setReviews(data.reviews);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                    alert('Error fetching reviews.');
                });
        }
    }, [selectedLocation]);

    if (loading) {
        return <Spin size="large" />;
    }

    return (
        <div className="app-container">
            <Title level={1}>Reviews</Title>
            {!isAuthenticated ? (
                <Button type="primary" onClick={() => window.location.href = `${API_URL}/login`}>
                    Authenticate with Google
                </Button>
            ) : (
                <>
                    <Select 
                        style={{ width: 300 }} 
                        placeholder="Select a location" 
                        value={selectedLocation} 
                        onChange={value => setSelectedLocation(value)}
                    >
                        {locations.map(location => (
                            <Option key={location} value={location}>{location}</Option>
                        ))}
                    </Select>
                    <Reviews reviews={reviews} />
                </>
            )}
        </div>
    );
}

export default App;
