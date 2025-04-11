import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "react-feather"; // You'll need to install react-feather
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import aboutImage from '../assets/WorkImage.jpg';
import axios from 'axios';

import "./Home.css";
import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";
import logo3 from "../assets/logo3.png";
import logo4 from "../assets/logo4.jpg";
import logo5 from "../assets/logo5.jpg";
import VegetablePowders from "../categories/VegetablePowders";
import FruitPowders from "../categories/FruitPowders";
import Pickles from "../categories/Pickles";
import Papads from "../categories/Papads";

interface FAQItem {
  question: string;
  answer: string;
}

interface Banner {
  id: number;
  image: string;
  title: string;
}

interface Review {
  id: number;
  name: string;
  review: string;
  image: string;
}

const features = [
  {
    icon: "🚚",
    text: "FREE Shipping for 15,000+ Pincodes",
  },
  {
    icon: "😊",
    text: "2L+ Happy Customers",
  },
  {
    icon: "🦈",
    text: "Various Rewards and Offers",
  },
  {
    icon: "💰",
    text: "COD Available",
  },
];

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchBanners();
    fetchReviews();
    fetchProducts();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/banners');
      setBanners(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/reviews');
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const statsData = [
    {
      icon: "🤝", // You can replace these with actual icon components or images
      number: "550",
      label: "Partner Didis",
    },
    {
      icon: "✓",
      number: "308",
      label: "Didis Certified on Quality & Hygiene",
    },
    {
      icon: "📜",
      number: "372",
      label: "FSSAI Licensed",
    },
    {
      icon: "🏘️",
      number: "43",
      label: "Villages Impacted",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Regular Customer",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      text: "I've been shopping here for years and the quality never disappoints!",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Gold Member",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      text: "The variety of products and amazing deals keep me coming back!",
      rating: 5,
    },
    {
      id: 3,
      name: "Emma Wilson",
      role: "Silver Member",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      text: "Fast shipping and excellent customer service. Highly recommended!",
      rating: 5,
    },
    {
      id: 4,
      name: "David Brown",
      role: "Bronze Member",
      image: "https://randomuser.me/api/portraits/men/4.jpg",
      text: "Best shopping experience I've had in years. Will definitely return!",
      rating: 5,
    },
  ];
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqData: FAQItem[] = [
    {
      question: "What is Shrihari?",
      answer:
        "Shrihari is a tech-led food startup that empowers rural women to produce high-quality food products and earn a sustainable livelihood. We work with rural women across India, helping them become financially independent.",
    },
    {
      question: "How does Shrihari support rural women?",
      answer:
        "Shrihari provides training, resources, and market access to rural women, enabling them to produce and sell traditional food products. We also offer technical support and quality control measures to ensure high standards.",
    },
    {
      question: "How can I purchase Shrihari products?",
      answer:
        "Shrihari products are available through our website and select retail partners. Each purchase directly supports our network of rural women entrepreneurs.",
    },
    {
      question: "How can I become a Shrihari?",
      answer:
        "Rural women interested in joining Shrihari can contact us through our website or local coordinators. We provide complete training and support to help you start your journey.",
    },
    {
      question: "What types of products does Shrihari offer?",
      answer:
        "Shrihari offers a range of traditional, high-quality food products including spices, pickles, preserves, and other locally-sourced items made by our network of rural women.",
    },
    {
      question: "How does Shrihari ensure product quality?",
      answer:
        "We maintain strict quality control measures and provide regular training to our Didis. All products undergo quality checks before reaching the market.",
    },
    {
      question: "Where does Shrihari currently operate?",
      answer:
        "Shrihari currently operates in 43 villages across India, with plans for expansion to reach more rural communities.",
    },
    {
      question: "How can I support Shrihari's mission?",
      answer:
        "You can support us by purchasing Shrihari products, spreading awareness about our initiative, or partnering with us for distribution and expansion.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div>
      <section>
        <div className="banner-container">
          <div
            className="banner-wrapper"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {banners.map((banner) => (
              <div key={banner.id} className="banner-slide">
                <img src={`http://localhost:8080/uploads/${banner.image}`} alt={banner.title} />
                <div className="banner-content">
                  {/* Removed the h2 title */}
                </div>
              </div>
            ))}
          </div>

          <button className="banner-nav prev" onClick={prevSlide}>
            <ChevronLeft size={24} />
          </button>
          <button className="banner-nav next" onClick={nextSlide}>
            <ChevronRight size={24} />
          </button>

          <div className="banner-dots">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`dot ${currentSlide === index ? "active" : ""}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <section>
        <VegetablePowders products={products.filter(p => p.category === 'vegetable-powder')} />
      </section>

      <section>
        <FruitPowders products={products.filter(p => p.category === 'fruit-powder')} />
      </section>

      <section>
        <Pickles products={products.filter(p => p.category === 'pickles')} />
      </section>

      <section>
        <Papads products={products.filter(p => p.category === 'papad')} />
      </section>

      <section>
        <div className="about-section">
          <div className="about-left">
            <img
              src={aboutImage}
              alt="Rural Women Empowerment"
              style={{
                width: "100%",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            />
          </div>
          <div className="about-right">
            <h1>A Visionary Team Empowering Rural Women across India</h1>
            <p>
              "Rural women reinvest 90% of their income in their family in terms
              of better education and health outcomes of family as compared to
              35% in case of men." When Manjari learnt that she decided to
              create a business that could empower 1 million rural women. In
              2021, she started Shrihari with her husband Anukrit and her
              sister-like friend Asmita.
            </p>
            <p>
              Shrihari is a tech-led food startup aimed at helping rural women
              produce high-quality food products and earn a livelihood. Today,
              it comprises 550 Didis from rural India and has positively
              impacted 43 villages.
            </p>
            <button className="read-more-btn">Read More</button>
          </div>
        </div>
      </section>
      <section>
        <div className="stats-container">
          {statsData.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      
      <section className="testimonials-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h4 className="display-6 fw-bold mb-3">Customer Reviews</h4>
            <p className="text-muted">What our valued customers say about us</p>
          </div>

          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
            {reviews.map((review) => (
              <div key={review.id} className="col">
                <div className="testimonial-card d-flex flex-column h-100">
                  <div className="d-flex align-items-center mb-3">
                    <div className="testimonial-image-wrapper me-3">
                      <img
                        src={`http://localhost:8080/uploads/${review.image}`}
                        alt={review.name}
                        className="testimonial-image"
                      />
                    </div>
                    <div>
                      <h6 className="mb-1 fw-bold">{review.name}</h6>
                    </div>
                  </div>
                  <div className="quote-wrapper flex-grow-1">
                    <FaQuoteLeft className="quote-icon mb-2" />
                    <p className="testimonial-text">{review.review}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <section className="media-showcase">
          <h2 className="media-showcase__title">Featured In</h2>
          <div style={{ textAlign: "center" }}>
            <img
              src={logo1}
              alt="Logo 1"
              className="media-showcase__image"
              style={{ margin: "0 20px" }}
            />
            <img
              src={logo2}
              alt="Logo 2"
              className="media-showcase__image"
              style={{ margin: "0 20px" }}
            />
            <img
              src={logo3}
              alt="Logo 3"
              className="media-showcase__image"
              style={{ margin: "0 20px" }}
            />
            <img
              src={logo4}
              alt="Logo 4"
              className="media-showcase__image"
              style={{ margin: "0 20px" }}
            />
            <img
              src={logo5}
              alt="Logo 5"
              className="media-showcase__image"
              style={{ margin: "0 20px" }}
            />
          </div>
        </section>
      </section>
      <section>
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-container">
            {faqData.map((faq, index) => (
              <div key={index} className="faq-item">
                <div
                  className={`faq-question ${
                    activeIndex === index ? "active" : ""
                  }`}
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                  <span className="faq-icon">
                    {activeIndex === index ? "-" : "+"}
                  </span>
                </div>
                <div
                  className={`faq-answer ${
                    activeIndex === index ? "active" : ""
                  }`}
                >
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className="feature-section container">
          <div className="row">
            {features.map((feature, index) => (
              <div key={index} className="col-6 col-md-3 mb-3">
                <div className="feature-item">
                  <div className="feature-icon">{feature.icon}</div>
                  <p className="feature-text">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
