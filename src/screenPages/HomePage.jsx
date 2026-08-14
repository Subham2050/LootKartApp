import React, { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Spinner, Alert, Form, Card, Button } from "react-bootstrap";
import Product from "../components/Product";
import HeroBanner from "../components/HeroBanner";
import axios from "axios";
import { formatINR } from "../utils/formatCurrency";

function HomePage({ searchTerm = "", onToast }) {
  const URL = "https://fakestoreapi.com/products";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  // Advanced Filters State
  const [maxPrice, setMaxPrice] = useState(1000); // USD max limit
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(URL);
        if (isMounted) {
          setProducts(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to fetch products");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    { id: "all", label: "All Items" },
    { id: "electronics", label: "Electronics" },
    { id: "jewelery", label: "Jewelery" },
    { id: "men's clothing", label: "Men's Wear" },
    { id: "women's clothing", label: "Women's Wear" },
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory =
          selectedCategory === "all" ||
          product.category?.toLowerCase() === selectedCategory.toLowerCase();
        const matchesSearch =
          searchTerm.trim() === "" ||
          (product.title || product.name || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesPrice = (product.price || 0) <= maxPrice;
        const ratingVal = typeof product.rating === "object" ? product.rating?.rate : product.rating;
        const matchesRating = (ratingVal || 0) >= minRating;

        return matchesCategory && matchesSearch && matchesPrice && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === "low-high") return a.price - b.price;
        if (sortBy === "high-low") return b.price - a.price;
        if (sortBy === "rating") {
          const rateA = typeof a.rating === "object" ? a.rating?.rate : a.rating;
          const rateB = typeof b.rating === "object" ? b.rating?.rate : b.rating;
          return (rateB || 0) - (rateA || 0);
        }
        return a.id - b.id; // default featured
      });
  }, [products, selectedCategory, searchTerm, maxPrice, minRating, sortBy]);

  const resetAllFilters = () => {
    setSelectedCategory("all");
    setMaxPrice(1000);
    setMinRating(0);
    setSortBy("featured");
  };

  const scrollToProducts = () => {
    const el = document.getElementById("product-catalog-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      {/* Hero Promotional Banner */}
      <HeroBanner onShopNowClick={scrollToProducts} />

      <Container id="product-catalog-section" className="my-4">
        {/* Category Pills & Sorting Bar */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4 p-3 bg-white rounded-3 shadow-sm border">
          {/* Category Filter Pills */}
          <div className="d-flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`category-pill ${selectedCategory === cat.id ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sorting Control */}
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small fw-semibold">Sort By:</span>
            <Form.Select
              size="sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-pill border-secondary"
            >
              <option value="featured">Featured</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </Form.Select>
          </div>
        </div>

        <Row className="g-4">
          {/* Sidebar Advanced Filters */}
          <Col lg={3}>
            <Card className="shadow-sm border rounded-4 p-3 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                <h5 className="fw-bold m-0">
                  <i className="fas fa-sliders text-primary me-2"></i>Filters
                </h5>
                <Button variant="link" size="sm" className="p-0 text-decoration-none fw-semibold" onClick={resetAllFilters}>
                  Reset All
                </Button>
              </div>

              {/* Price Range Slider */}
              <div className="mb-4">
                <Form.Label className="fw-semibold small d-flex justify-content-between">
                  <span>Max Price:</span>
                  <span className="text-primary fw-bold">{formatINR(maxPrice)}</span>
                </Form.Label>
                <Form.Range
                  min={10}
                  max={1000}
                  step={10}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
              </div>

              {/* Rating Filter */}
              <div className="mb-3">
                <Form.Label className="fw-semibold small mb-2">Customer Rating</Form.Label>
                <Form.Check
                  type="radio"
                  id="rating-all"
                  name="ratingFilter"
                  label="All Ratings"
                  checked={minRating === 0}
                  onChange={() => setMinRating(0)}
                  className="small mb-1"
                />
                <Form.Check
                  type="radio"
                  id="rating-4"
                  name="ratingFilter"
                  label="4★ & above"
                  checked={minRating === 4}
                  onChange={() => setMinRating(4)}
                  className="small mb-1"
                />
                <Form.Check
                  type="radio"
                  id="rating-3"
                  name="ratingFilter"
                  label="3★ & above"
                  checked={minRating === 3}
                  onChange={() => setMinRating(3)}
                  className="small mb-1"
                />
              </div>
            </Card>
          </Col>

          {/* Main Product Grid Column */}
          <Col lg={9}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 className="fw-extrabold text-dark m-0">
                {selectedCategory === "all" ? "Trending Catalog" : categories.find(c => c.id === selectedCategory)?.label}
              </h3>
              <span className="text-muted font-weight-bold">
                Showing <strong>{filteredProducts.length}</strong> items
              </span>
            </div>

            {loading ? (
              <div className="text-center my-5 py-5">
                <Spinner animation="border" variant="primary" role="status">
                  <span className="visually-hidden">Loading catalog...</span>
                </Spinner>
                <p className="mt-3 text-muted fw-semibold">Fetching LootKart deals...</p>
              </div>
            ) : error ? (
              <Alert variant="danger" className="my-4 shadow-sm">
                <Alert.Heading>Error loading products</Alert.Heading>
                <p>{error}</p>
              </Alert>
            ) : filteredProducts.length === 0 ? (
              <Alert variant="warning" className="text-center p-4 my-4 shadow-sm rounded-4">
                <i className="fas fa-search fs-1 mb-3 text-warning"></i>
                <h4>No products found</h4>
                <p className="text-muted">No items matched your active filters or search query.</p>
                <Button variant="outline-primary" className="rounded-pill px-4 fw-bold mt-2" onClick={resetAllFilters}>
                  Reset Filters
                </Button>
              </Alert>
            ) : (
              <Row>
                {filteredProducts.map((product) => (
                  <Col
                    key={product.id}
                    sm={12}
                    md={6}
                    xl={4}
                    className="d-flex align-items-stretch mb-4"
                  >
                    <Product product={product} onToast={onToast} />
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default HomePage;
