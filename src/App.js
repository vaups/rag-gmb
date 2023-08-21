import { Layout, List, Button, message } from "antd";
import { useState, useEffect } from "react";

const { Header, Content, Footer } = Layout;

function App() {
  const [reviews, setReviews] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Fetch reviews from Flask backend
    fetch("https://your-flask-app.herokuapp.com/fetch_reviews")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setReviews(data);
        setIsAuthenticated(true);
      })
      .catch((error) => {
        console.error("Error fetching reviews:", error);
        message.error("Failed to fetch reviews. Please try again later.");
      });
  }, []);

  return (
    <Layout>
      <Header>
        <div className="logo" />
        {isAuthenticated ? (
          <span>Welcome!</span>
        ) : (
          <Button type="primary" onClick={handleLogin}>
            Login
          </Button>
        )}
      </Header>
      <Content>
        {isAuthenticated ? (
          <List
            itemLayout="horizontal"
            dataSource={reviews}
            renderItem={(review) => (
              <List.Item>
                <List.Item.Meta
                  title={review.authorName}
                  description={review.text}
                />
              </List.Item>
            )}
          />
        ) : (
          <p>Please log in to view reviews.</p>
        )}
      </Content>
      <Footer>My Business Reviews ©2023</Footer>
    </Layout>
  );
}

function handleLogin() {
  // Redirect to Flask backend for authentication
  window.location.href = "https://rag-gmb-73f4cd98333b.herokuapp.com/authorize";
}

export default App;