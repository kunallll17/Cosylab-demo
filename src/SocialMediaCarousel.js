import React, { useState, useEffect, useRef } from 'react';
import './SocialMediaCarousel.css';

function SocialMediaCarousel() {
  const [posts, setPosts] = useState([
    { id: 1, url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { id: 2, url: 'https://www.youtube.com/embed/aqz-KE-bpKQ' },
    { id: 3, url: 'https://www.youtube.com/embed/e-ORhEE9VVg' },
    { id: 4, url: 'https://www.youtube.com/embed/L_jWHffIx5E' },
    { id: 5, url: 'https://www.youtube.com/embed/M3B5U2IL6Z8' },
    { id: 6, url: 'https://www.youtube.com/embed/l9PxOanFjxQ' },
    { id: 7, url: 'https://www.youtube.com/embed/djV11Xbc914' },
    { id: 8, url: 'https://www.youtube.com/embed/2Vv-BfVoq4g' },
    { id: 9, url: 'https://www.youtube.com/embed/o1tj2zJ2Wvg' },
    { id: 10, url: 'https://www.youtube.com/embed/3JZ_D3ELwOQ' },
    { id: 11, url: 'https://www.youtube.com/embed/HQmmM_qwG4k' },
    { id: 12, url: 'https://www.youtube.com/embed/ZXVhOPiM4mk' },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null);
  const startX = useRef(0);

  useEffect(() => {
    const carousel = carouselRef.current;

    const handleWheel = (event) => {
      if (event.deltaY === 0) return;

      if (event.deltaY > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    };

    const handleTouchStart = (event) => {
      startX.current = event.touches[0].clientX;
    };

    const handleTouchMove = (event) => {
      const diffX = event.touches[0].clientX - startX.current;

      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          goToPrev();
        } else {
          goToNext();
        }
        startX.current = event.touches[0].clientX;
      }
    };

    carousel.addEventListener('wheel', handleWheel);
    carousel.addEventListener('touchstart', handleTouchStart);
    carousel.addEventListener('touchmove', handleTouchMove);

    return () => {
      carousel.removeEventListener('wheel', handleWheel);
      carousel.removeEventListener('touchstart', handleTouchStart);
      carousel.removeEventListener('touchmove', handleTouchMove);
    };
  }, [currentIndex, posts.length]);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        goToNext();
      }, 3000); // Auto-scroll every 3 seconds

      return () => clearInterval(interval);
    }
  }, [isPaused, posts.length]);

  const handleAddPost = () => {
    if (posts.length >= 12) return; // Prevent adding more than 12 posts

    let newPostUrl = prompt("Enter your new post URL:");
    if (newPostUrl) {
      if (newPostUrl.includes("youtube.com/watch?v=")) {
        newPostUrl = newPostUrl.replace("watch?v=", "embed/");
      }

      if (newPostUrl.includes("twitter.com") || newPostUrl.includes("x.com")) {
        newPostUrl = "https://via.placeholder.com/300x200.png?text=Twitter+Embed+Not+Supported";
      }

      setPosts([...posts, { id: posts.length + 1, url: newPostUrl }]);
    }
  };

  const handleEditPost = (id) => {
    const newUrl = prompt("Edit the post URL:", posts.find(post => post.id === id).url);
    if (newUrl) {
      setPosts(posts.map(post => post.id === id ? { ...post, url: newUrl } : post));
    }
  };

  const handleRemovePost = (id) => {
    setPosts((prevPosts) => {
      const updatedPosts = prevPosts.filter(post => post.id !== id);
      if (currentIndex >= updatedPosts.length) {
        setCurrentIndex(0);
      }
      return updatedPosts;
    });
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + posts.length) % posts.length);
  };

  return (
    <div className="carousel-container" ref={carouselRef}>
      <button className="arrow animated-button left-arrow" onClick={goToPrev}>
        <svg xmlns="http://www.w3.org/2000/svg" className="arr-2" viewBox="0 0 24 24">
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
        </svg>
        <span className="text">‹</span>
        <span className="circle"></span>
        <svg xmlns="http://www.w3.org/2000/svg" className="arr-1" viewBox="0 0 24 24">
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
        </svg>
      </button>
      <div 
        className="carousel" 
        style={{ transform: `translateX(-${currentIndex * 33.33}%)` }} 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {posts.map(post => (
          <div key={post.id} className="post">
            <iframe src={post.url} title={`post-${post.id}`} frameBorder="0" allowFullScreen></iframe>
            <div className="edit-controls">
              <button className="animated-button edit-btn" onClick={() => handleEditPost(post.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="arr-2" viewBox="0 0 24 24">
                  <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                </svg>
                <span className="text">Edit</span>
                <span className="circle"></span>
                <svg xmlns="http://www.w3.org/2000/svg" className="arr-1" viewBox="0 0 24 24">
                  <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                </svg>
              </button>
              <button className="animated-button remove-btn" onClick={() => handleRemovePost(post.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="arr-2" viewBox="0 0 24 24">
                  <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                </svg>
                <span className="text">Remove</span>
                <span className="circle"></span>
                <svg xmlns="http://www.w3.org/2000/svg" className="arr-1" viewBox="0 0 24 24">
                  <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="arrow animated-button right-arrow" onClick={goToNext}>
        <svg xmlns="http://www.w3.org/2000/svg" className="arr-2" viewBox="0 0 24 24">
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
        </svg>
        <span className="text">›</span>
        <span className="circle"></span>
        <svg xmlns="http://www.w3.org/2000/svg" className="arr-1" viewBox="0 0 24 24">
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
        </svg>
      </button>
      <button className="animated-button add-post-btn" onClick={handleAddPost}>
        <svg xmlns="http://www.w3.org/2000/svg" className="arr-2" viewBox="0 0 24 24">
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
        </svg>
        <span className="text">Add Post</span>
        <span className="circle"></span>
        <svg xmlns="http://www.w3.org/2000/svg" className="arr-1" viewBox="0 0 24 24">
          <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
        </svg>
      </button>
    </div>
  );
}

export default SocialMediaCarousel;
