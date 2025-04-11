import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', address: '' });
  const [editingField, setEditingField] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [editReviewModal, setEditReviewModal] = useState(false);
  const [addReviewModal, setAddReviewModal] = useState(false);
  const [currentReview, setCurrentReview] = useState<any>(null);
  const [newReviewImage, setNewReviewImage] = useState<File | null>(null);
  const [newReview, setNewReview] = useState({ name: '', review: '' });
  const [bannerModalId, setBannerModalId] = useState<number | null>(null);
  const [banners, setBanners] = useState<any[]>([]);
  const [isCreatingBanner, setIsCreatingBanner] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    fetchProfileAndReviews();
    fetchBanners();
  }, []);

  const fetchProfileAndReviews = async () => {
    try {
      const profileRes = await axios.get('http://localhost:8080/api/profile');
      const reviewsRes = await axios.get('http://localhost:8080/api/reviews');
      setProfile(profileRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error('Error fetching profile or reviews:', error);
    }
  };

  const fetchBanners = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/banners');
      if (!response.ok) {
        throw new Error('Failed to fetch banners');
      }
      const data = await response.json();
      console.log('Fetched banners:', data);
      const formattedBanners = data.map(banner => ({
        ...banner,
        image: banner.image.startsWith('/uploads/') ? banner.image : `/uploads/${banner.image}`
      }));
      setBanners(formattedBanners);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = async (field: string) => {
    try {
      await axios.put('http://localhost:8080/api/profile', profile);
      setEditingField(null);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const openEditModal = (review: any) => {
    setCurrentReview(review);
    setEditReviewModal(true);
    setNewReviewImage(null);
  };

  const handleReviewUpdate = async () => {
    const formData = new FormData();
    formData.append('id', currentReview.id);
    formData.append('name', currentReview.name);
    formData.append('review', currentReview.review);
    if (newReviewImage) {
      formData.append('image', newReviewImage);
    }

    try {
      await axios.put(`http://localhost:8080/api/reviews/${currentReview.id}`, formData);
      await fetchProfileAndReviews();
      setEditReviewModal(false);
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleAddReview = async () => {
    const formData = new FormData();
    formData.append('name', newReview.name);
    formData.append('review', newReview.review);
    if (newReviewImage) {
      formData.append('image', newReviewImage);
    }

    try {
      await axios.post('http://localhost:8080/api/reviews', formData);
      await fetchProfileAndReviews();
      setAddReviewModal(false);
      setNewReview({ name: '', review: '' });
      setNewReviewImage(null);
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/reviews');
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      alert('Failed to fetch reviews. Please check if the server is running.');
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/reviews/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server response:', errorText);
          throw new Error('Failed to delete review. Server returned an error.');
        }
        
        // Update the reviews state
        setReviews(prevReviews => prevReviews.filter(review => review.id !== id));
        alert('Review deleted successfully');
      } catch (error) {
        console.error('Error deleting review:', error);
        alert(error instanceof Error ? error.message : 'Failed to delete review. Please try again.');
      }
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>, bannerId: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('banner', file);

    try {
      const response = await fetch(`http://localhost:8080/api/banner/upload/${bannerId}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload banner');
      }

      const data = await response.json();
      console.log('Uploaded banner:', data);

      // Update the banners state with the new image
      setBanners(prevBanners => 
        prevBanners.map(banner => 
          banner.id === bannerId 
            ? { ...banner, image: data.image } 
            : banner
        )
      );

      // Show a success message
      alert('Banner updated successfully!');
    } catch (error) {
      console.error('Error uploading banner:', error);
      alert('Failed to upload banner. Please try again.');
    }
  };

  const handleCreateBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('banner', file);
    
    try {
      const response = await fetch('http://localhost:8080/api/banners', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to create banner');
      }
      
      setBanners([...banners, data]);
      alert(data.message || 'Banner created successfully');
    } catch (error) {
      console.error('Error creating banner:', error);
      alert(error instanceof Error ? error.message : 'Failed to create banner');
    }
  };

  return (
    <div className="dashboard">
      {/* Banner Section */}
      <div className="banner-section">
        <div className="banner-header">
          <h2>Banners</h2>
          <div className="add-banner-container">
            <input
              type="file"
              id="add-banner-input"
              accept="image/*"
              onChange={handleCreateBanner}
              style={{ display: 'none' }}
            />
            <label 
              htmlFor="add-banner-input"
              className="add-banner-button"
            >
              Add New Banner
            </label>
          </div>
        </div>
        <div className="banner-container">
          {banners.length > 0 ? (
            banners.map((banner, index) => (
              <div 
                key={banner.id} 
                className={`banner ${index === currentBanner ? 'active' : ''}`}
                style={{ 
                  backgroundImage: `url(http://localhost:8080${banner.image})`,
                  display: index === currentBanner ? 'flex' : 'none'
                }}
              >
                <div className="banner-actions">
                  <input
                    type="file"
                    id={`banner-upload-${banner.id}`}
                    accept="image/*"
                    onChange={(e) => handleBannerUpload(e, banner.id)}
                    style={{ display: 'none' }}
                  />
                  <label 
                    htmlFor={`banner-upload-${banner.id}`}
                    className="upload-button-3"
                  >
                    Change Banner {index + 1}
                  </label>
                </div>
              </div>
            ))
          ) : (
            <div className="no-banners">
              <p>No banners available. Click "Add New Banner" to create one.</p>
            </div>
          )}
          
          {/* Banner Navigation */}
          {banners.length > 0 && (
            <>
              <div className="banner-nav">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    className={`banner-dot ${index === currentBanner ? 'active' : ''}`}
                    onClick={() => setCurrentBanner(index)}
                  />
                ))}
              </div>
              
              <button 
                className="banner-arrow left"
                onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
              >
                &#8249;
              </button>
              <button 
                className="banner-arrow right"
                onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
              >
                &#8250;
              </button>
            </>
          )}
        </div>
      </div>

      {/* Create Banner Modal */}
      {isCreatingBanner && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Banner</h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleCreateBanner}
            />
            <button onClick={() => setIsCreatingBanner(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Banner Upload Modal */}
      {bannerModalId !== null && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Upload New Banner</h2>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleBannerUpload(e, bannerModalId)}
            />
            <button onClick={() => setBannerModalId(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Profile Section */}
      <div className="profile-section">
        <div className="profile-info">
          <h2>Profile Information</h2>
          <div className="info-grid">
            {['name', 'email', 'phone', 'address'].map((field) => (
              <div key={field} className="info-card">
                <h3>{field.charAt(0).toUpperCase() + field.slice(1)}</h3>
                {editingField === field ? (
                  <>
                    <input
                      type="text"
                      value={profile[field as keyof typeof profile]}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                    />
                    <button className="save-button" onClick={() => handleSave(field)}>Save</button>
                  </>
                ) : (
                  <>
                    <p>{profile[field as keyof typeof profile]}</p>
                    <button className="edit-button" onClick={() => setEditingField(field)}>Edit</button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <div className="reviews-header">
          <h2>Customer Reviews</h2>
          <button className="add-button" onClick={() => setAddReviewModal(true)}>Add Review</button>
        </div>
        <div className="reviews-grid">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              {review.image && (
                <img src={`http://localhost:8080${review.image}`} alt={review.name} className="reviewer-img" />
              )}
              <h3>{review.name}</h3>
              <p>{review.review}</p>
              <div className="review-actions-4">
                <button className="edit-button-4" onClick={() => openEditModal(review)}>Edit</button>
                <button className="delete-button-4" onClick={() => handleDeleteReview(review.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Review Modal */}
      {editReviewModal && currentReview && (
        <div className="modal-overlay">
          <div className="review-modal-container">
            <div className="review-modal-content">
              <h2>Edit Review</h2>
              <div className="review-form">
                <input
                  type="text"
                  placeholder="Name"
                  value={currentReview.name}
                  onChange={(e) => setCurrentReview({ ...currentReview, name: e.target.value })}
                  className="review-input"
                />
                <textarea
                  placeholder="Review"
                  value={currentReview.review}
                  onChange={(e) => setCurrentReview({ ...currentReview, review: e.target.value })}
                  className="review-textarea"
                />
                <div className="review-image-upload">
                  <input 
                    type="file" 
                    onChange={(e) => setNewReviewImage(e.target.files?.[0] || null)} 
                    accept="image/*"
                    className="review-file-input"
                  />
                  {newReviewImage && (
                    <img 
                      src={URL.createObjectURL(newReviewImage)} 
                      alt="Preview" 
                      className="review-image-preview"
                    />
                  )}
                </div>
                <div className="review-modal-actions">
                  <button onClick={handleReviewUpdate} className="review-save-button">Save Changes</button>
                  <button onClick={() => setEditReviewModal(false)} className="review-cancel-button">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Review Modal */}
      {addReviewModal && (
        <div className="modal-overlay">
          <div className="review-modal-container">
            <div className="review-modal-content">
              <h2>Add New Review</h2>
              <div className="review-form">
                <input
                  type="text"
                  placeholder="Name"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  className="review-input"
                />
                <textarea
                  placeholder="Review"
                  value={newReview.review}
                  onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
                  className="review-textarea"
                />
                <div className="review-image-upload">
                  <input 
                    type="file" 
                    onChange={(e) => setNewReviewImage(e.target.files?.[0] || null)} 
                    accept="image/*"
                    className="review-file-input"
                  />
                  {newReviewImage && (
                    <img 
                      src={URL.createObjectURL(newReviewImage)} 
                      alt="Preview" 
                      className="review-image-preview"
                    />
                  )}
                </div>
                <div className="review-modal-actions">
                  <button onClick={handleAddReview} className="review-save-button">Add Review</button>
                  <button onClick={() => setAddReviewModal(false)} className="review-cancel-button">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
