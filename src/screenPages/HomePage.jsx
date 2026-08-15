import React, { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Spinner, Alert, Form, Card, Button, Pagination } from "react-bootstrap";
import Product from "../components/Product";
import HeroBanner from "../components/HeroBanner";
import api from "../services/api";
import axios from "axios";
import { formatINR } from "../utils/formatCurrency";

function HomePage({ searchTerm = "", onToast }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");

  // Advanced Filters State (Prices in INR ₹)
  const [maxPrice, setMaxPrice] = useState(15000);
  const [minRating, setMinRating] = useState(0);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 24;

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        try {
          const response = await api.get("/products");
          if (isMounted) {
            setProducts(response.data);
          }
        } catch (backendErr) {
          console.warn("Backend API unavailable, falling back to FakeStore API", backendErr);
          const fallbackRes = await axios.get("https://fakestoreapi.com/products");
          if (isMounted) {
            setProducts(fallbackRes.data);
          }
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

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, maxPrice, minRating, sortBy]);

  const categoryDefinitions = [
    { id: "all", label: "All Products", icon: "fas fa-layer-group" },
    { id: "topwear", label: "Topwear", icon: "fas fa-tshirt" },
    { id: "bottomwear", label: "Bottomwear", icon: "fas fa-user-ninja" },
    { id: "winter wear", label: "Winter Wear", icon: "fas fa-snowflake" },
    { id: "footwear", label: "Footwear", icon: "fas fa-shoe-prints" },
    { id: "ethnic wear", label: "Ethnic Wear", icon: "fas fa-vest" },
    { id: "innerwear & socks", label: "Innerwear & Socks", icon: "fas fa-socks" },
    { id: "accessories", label: "Accessories", icon: "fas fa-hat-cowboy" },
    { id: "bags & belts", label: "Bags & Belts", icon: "fas fa-briefcase" },
  ];

  // Calculate product counts per category
  const categoryCounts = useMemo(() => {
    const counts = { all: products.length };
    products.forEach((p) => {
      const catKey = p.category?.toLowerCase() || "other";
      counts[catKey] = (counts[catKey] || 0) + 1;
    });
    return counts;
  }, [products]);

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
        const ratingVal = typeof product.rating === "object" ? product.rating?.rate : (product.rating_rate || product.rating);
        const matchesRating = (ratingVal || 0) >= minRating;

        return matchesCategory && matchesSearch && matchesPrice && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === "low-high") return a.price - b.price;
        if (sortBy === "high-low") return b.price - a.price;
        if (sortBy === "rating") {
          const rateA = typeof a.rating === "object" ? a.rating?.rate : (a.rating_rate || a.rating);
          const rateB = typeof b.rating === "object" ? b.rating?.rate : (b.rating_rate || b.rating);
          return (rateB || 0) - (rateA || 0);
        }
        return a.id - b.id;
      });
  }, [products, selectedCategory, searchTerm, maxPrice, minRating, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const startItemNum = filteredProducts.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0;
  const endItemNum = Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length);

  const resetAllFilters = () => {
    setSelectedCategory("all");
    setMaxPrice(15000);
    setMinRating(0);
    setSortBy("featured");
    setCurrentPage(1);
  };

  const scrollToProducts = () => {
    const el = document.getElementById("product-catalog-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      {/* Hero Promotional Banner */}
      <HeroBanner onExplore={scrollToProducts} />

      <Container className="my-5" id="product-catalog-section">
        <Row className="g-4">
          {/* Left-Side Advanced Filter Sidebar with Category Filter */}
          <Col lg={3}>
            <Card className="filter-sidebar shadow-sm border-0 rounded-4 p-4 sticky-top" style={{ top: "90px" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-extrabold text-dark mb-0">
                  <i className="fas fa-sliders-h me-2 text-primary"></i>Filters
                </h5>
                <Button
                  variant="link"
                  size="sm"
                  className="text-decoration-none text-muted p-0"
                  onClick={resetAllFilters}
                >
                  Reset
                </Button>
              </div>

              {/* 🏷️ CATEGORIES SECTION ON THE LEFT SIDEBAR */}
              <div className="mb-4">
                <label className="fw-bold small mb-2 text-muted text-uppercase tracking-wider">
                  <i className="fas fa-th-large me-2 text-primary"></i>Categories
                </label>
                <div className="d-flex flex-column gap-1">
                  {categoryDefinitions.map((cat) => {
                    const count = categoryCounts[cat.id] || 0;
                    const isActive = selectedCategory === cat.id;

                    return (
                      <button
                        key={cat.id}
                        className={`sidebar-category-btn ${isActive ? "active" : ""}`}
                        onClick={() => setSelectedCategory(cat.id)}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <i className={`${cat.icon} cat-icon`}></i>
                          <span>{cat.label}</span>
                        </div>
                        {count > 0 && (
                          <span className="count-badge">
                            {count > 999 ? `${(count / 1000).toFixed(1)}k` : count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <hr className="my-3 text-muted opacity-25" />

              {/* Price Filter (INR ₹) */}
              <Form.Group className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Form.Label className="fw-bold small mb-0 text-muted text-uppercase">Max Price</Form.Label>
                  <span className="fw-bold text-primary small">{formatINR(maxPrice)}</span>
                </div>
                <Form.Range
                  min={100}
                  max={25000}
                  step={200}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
              </Form.Group>

              {/* Rating Filter */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold small mb-2 text-muted text-uppercase">Minimum Rating</Form.Label>
                <Form.Select
                  size="sm"
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="rounded-3"
                >
                  <option value={0}>All Ratings</option>
                  <option value={4.5}>4.5★ & Above</option>
                  <option value={4.0}>4.0★ & Above</option>
                  <option value={3.5}>3.5★ & Above</option>
                  <option value={3.0}>3.0★ & Above</option>
                </Form.Select>
              </Form.Group>

              {/* Sort By Filter */}
              <Form.Group>
                <Form.Label className="fw-bold small mb-2 text-muted text-uppercase">Sort By</Form.Label>
                <Form.Select
                  size="sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-3"
                >
                  <option value="featured">Featured / Default</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </Form.Select>
              </Form.Group>
            </Card>
          </Col>

          {/* Product Cards Grid */}
          <Col lg={9}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted fw-semibold">
                Showing <span className="text-primary fw-bold">{startItemNum}-{endItemNum}</span> of <span className="fw-bold text-dark">{filteredProducts.length.toLocaleString()}</span> products {selectedCategory !== "all" ? `in "${selectedCategory}"` : ""}
              </span>
              {filteredProducts.length > 0 && (
                <span className="badge bg-light text-dark border px-3 py-2 rounded-pill fw-semibold">
                  Page {currentPage} of {totalPages}
                </span>
              )}
            </div>

            {loading ? (
              <div className="text-center my-5 py-5">
                <Spinner animation="border" variant="primary" role="status">
                  <span className="visually-hidden">Loading catalog...</span>
                </Spinner>
              </div>
            ) : error ? (
              <Alert variant="danger" className="shadow-sm">
                <Alert.Heading>Error loading catalog</Alert.Heading>
                <p>{error}</p>
              </Alert>
            ) : filteredProducts.length === 0 ? (
              <Card className="text-center p-5 border-0 shadow-sm rounded-4">
                <div className="display-1 text-muted mb-3">
                  <i className="fas fa-search-minus"></i>
                </div>
                <h4 className="fw-bold">No Products Found</h4>
                <p className="text-muted">Try adjusting your filters or search keyword.</p>
                <div>
                  <Button variant="primary" className="rounded-pill px-4" onClick={resetAllFilters}>
                    Clear Filters
                  </Button>
                </div>
              </Card>
            ) : (
              <>
                <Row xs={1} sm={2} md={3} className="g-4">
                  {currentItems.map((product) => (
                    <Col key={product.id}>
                      <Product product={product} onToast={onToast} />
                    </Col>
                  ))}
                </Row>

                {/* Premium Floating Pagination Controls */}
                {totalPages > 1 && (
                  <div className="d-flex flex-column align-items-center justify-content-center mt-5 gap-3">
                    <div className="pagination-wrapper">
                      <Pagination className="pagination-custom mb-0">
                        <Pagination.First
                          disabled={currentPage === 1}
                          onClick={() => {
                            setCurrentPage(1);
                            scrollToProducts();
                          }}
                        />
                        <Pagination.Prev
                          disabled={currentPage === 1}
                          onClick={() => {
                            setCurrentPage((prev) => Math.max(prev - 1, 1));
                            scrollToProducts();
                          }}
                        />

                        {[...Array(totalPages).keys()]
                          .filter((page) => {
                            const pageNum = page + 1;
                            return (
                              pageNum === 1 ||
                              pageNum === totalPages ||
                              Math.abs(pageNum - currentPage) <= 2
                            );
                          })
                          .map((page, index, array) => {
                            const pageNum = page + 1;
                            const showEllipsis =
                              index > 0 && pageNum - (array[index - 1] + 1) > 0;

                            return (
                              <React.Fragment key={pageNum}>
                                {showEllipsis && <Pagination.Ellipsis disabled />}
                                <Pagination.Item
                                  active={pageNum === currentPage}
                                  onClick={() => {
                                    setCurrentPage(pageNum);
                                    scrollToProducts();
                                  }}
                                >
                                  {pageNum}
                                </Pagination.Item>
                              </React.Fragment>
                            );
                          })}

                        <Pagination.Next
                          disabled={currentPage === totalPages}
                          onClick={() => {
                            setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                            scrollToProducts();
                          }}
                        />
                        <Pagination.Last
                          disabled={currentPage === totalPages}
                          onClick={() => {
                            setCurrentPage(totalPages);
                            scrollToProducts();
                          }}
                        />
                      </Pagination>
                    </div>
                    <div className="text-muted small fw-semibold">
                      Showing items {startItemNum} to {endItemNum} of {filteredProducts.length.toLocaleString()} total items
                    </div>
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default HomePage;
