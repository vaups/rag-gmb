import React, { useState, useEffect } from "react";
import { Layout, List, Button, message, Select, Spin, Menu } from "antd";
const { Sider, Content, Footer } = Layout;
const { Option } = Select;

const App = () => {
  const [reviews, setReviews] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initial check for authentication based on local storage.
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      setIsAuthenticated(true);
    } else {
      checkAuthentication(); // If not found in local storage, check server.
    }
  }, []);
  
  const handleLogin = () => {
    fetch("https://backend.gmb.reedauto.com/authorize", {
      credentials: 'include'  // Include credentials
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.authorization_url) {
        // Redirect the user to Google's OAuth2 authorization page
        window.location.href = data.authorization_url;
      } else {
        message.error("Failed to initiate authentication. Please try again.");
      }
    });
  };
  
  useEffect(() => {
    if (!selectedLocation) return;
  
    setLoading(true);
  
    const token = localStorage.getItem("access_token");
  
    fetch(
      `https://backend.gmb.reedauto.com/fetch_reviews?location_name=${selectedLocation}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    )
    .then((response) => response.json())
    .then((data) => {
      console.log("Entire data object:", JSON.stringify(data, null, 2)); // Debug line
      if (Array.isArray(data)) {
        setReviews(data);
      } else {
        console.warn("Received data is not an array:", data);
        setReviews([]);  // Reset reviews if data is not valid
      }
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching reviews:", error);
      message.error(`Failed to fetch reviews: ${error}`);
      setLoading(false);
    });
  }, [selectedLocation]);

  const checkAuthentication = () => {
    fetch("https://backend.gmb.reedauto.com/check_auth", {
      credentials: 'include'  // Include credentials
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.isAuthenticated) {
          setIsAuthenticated(true);
        }
      });
  };

  // Constants
  const LOCATIONS = {
    "Reed Jeep Chrysler Dodge Ram of Kansas City Service Center": [
      "107525660123223074874",
      "6602925040958900944",
    ],
    "Reed Jeep of Kansas City": [
      "107525660123223074874",
      "1509419292313302599",
    ],
    "Reed Jeep Chrysler Dodge Ram of Kansas City Parts Store": [
      "107525660123223074874",
      "13301160076946238237",
    ],
    "Reed Chrysler Dodge Jeep Ram": [
      "111693813506330378362",
      "11797626926263627465",
    ],
    "Reed Jeep Ram Service Center of St. Joseph": [
      "111693813506330378362",
      "14280468831929260325",
    ],
    "Reed Jeep Ram Parts Store": [
      "111693813506330378362",
      "2418643850076402830",
    ],
    "Reed Hyundai St. Joseph": [
      "106236436844097816145",
      "11886236645408970450",
    ],
    "Reed Hyundai Service Center St. Joseph": [
      "106236436844097816145",
      "14394473597121013675",
    ],
    "Reed Hyundai of Kansas City": [
      "109745744288166151974",
      "8949845982319380160",
    ],
    "Reed Hyundai Service Center of Kansas City": [
      "109745744288166151974",
      "14191266722711425624",
    ],
    "Reed Hyundai Parts Store": [
      "109745744288166151974",
      "16832194732739486696",
    ],
    "Reed Collision Center": ["118020935772003776996", "14476819248161239911"],
    "Reed Chevrolet of St Joseph": [
      "101540168465155832676",
      "4906344306812977154",
    ],
    "Reed Chevrolet Service Center": [
      "101540168465155832676",
      "7432353734414121407",
    ],
    "Reed Chevrolet Parts": ["101540168465155832676", "13264330561216148213"],
    "Reed Buick GMC, INC.": ["109231983509135903650", "9980434767027047433"],
    "Reed Buick GMC Service Center": [
      "109231983509135903650",
      "9597638825461585665",
    ],
    "Reed Buick GMC Collision Center": [
      "109231983509135903650",
      "10315051056232587965",
    ],
  };

  return (
    <Layout>
      <Sider width={200}>
        <Menu mode="vertical" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">Reviews</Menu.Item>
          <Menu.Item key="1">Maia</Menu.Item>
          <Menu.Item key="1">Jake</Menu.Item>
        </Menu>
        {isAuthenticated ? (
          <>
            <span>Welcome!</span>
            <Select
              placeholder="Select a location"
              onChange={(value) => setSelectedLocation(value)}
            >
              {Object.keys(LOCATIONS).map((location) => (
                <Option key={location} value={location}>
                  {location}
                </Option>
              ))}
            </Select>
          </>
        ) : (
          <Button type="primary" onClick={handleLogin}>
            Login
          </Button>
        )}
      </Sider>
      <Layout>
        <Content>
          {loading ? (
            <Spin tip="Loading reviews..." />
          ) : isAuthenticated ? (
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
    </Layout>
  );
}

export default App;
