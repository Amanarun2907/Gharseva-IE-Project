import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Modal, Spinner } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { adminAPI } from '../../services/api';
import Navbar from '../../components/shared/Navbar';
import Footer from '../../components/shared/Footer';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'fa-wrench',
    basePrice: '',
    isActive: true
  });

  const iconOptions = [
    { value: 'fa-wrench', label: 'Wrench (Plumber)' },
    { value: 'fa-bolt', label: 'Bolt (Electrician)' },
    { value: 'fa-hammer', label: 'Hammer (Carpenter)' },
    { value: 'fa-broom', label: 'Broom (Cleaning)' },
    { value: 'fa-paint-roller', label: 'Paint Roller (Painter)' },
    { value: 'fa-fan', label: 'Fan (AC Repair)' },
    { value: 'fa-bug', label: 'Bug (Pest Control)' },
    { value: 'fa-tools', label: 'Tools (Appliance Repair)' },
    { value: 'fa-utensils', label: 'Utensils (Cook)' },
    { value: 'fa-car', label: 'Car (Driver)' }
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getCategories();
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
      setCategories(getMockCategories());
    } finally {
      setLoading(false);
    }
  };

  const getMockCategories = () => [
    { _id: '1', name: 'Plumber', description: 'Professional plumbing services', icon: 'fa-wrench', basePrice: 300, isActive: true, activeWorkerCount: 12 },
    { _id: '2', name: 'Electrician', description: 'Expert electrical repairs', icon: 'fa-bolt', basePrice: 350, isActive: true, activeWorkerCount: 15 },
    { _id: '3', name: 'Carpenter', description: 'Skilled carpentry work', icon: 'fa-hammer', basePrice: 400, isActive: true, activeWorkerCount: 10 },
    { _id: '4', name: 'House Cleaning', description: 'Complete home cleaning', icon: 'fa-broom', basePrice: 500, isActive: true, activeWorkerCount: 25 },
    { _id: '5', name: 'Painter', description: 'Professional painting services', icon: 'fa-paint-roller', basePrice: 450, isActive: true, activeWorkerCount: 8 },
    { _id: '6', name: 'AC Repair', description: 'AC installation and repair', icon: 'fa-fan', basePrice: 400, isActive: true, activeWorkerCount: 18 },
    { _id: '7', name: 'Pest Control', description: 'Complete pest control', icon: 'fa-bug', basePrice: 800, isActive: true, activeWorkerCount: 6 },
    { _id: '8', name: 'Appliance Repair', description: 'Home appliance repairs', icon: 'fa-tools', basePrice: 350, isActive: true, activeWorkerCount: 14 }
  ];

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditMode(true);
      setSelectedCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        icon: category.icon,
        basePrice: category.basePrice,
        isActive: category.isActive
      });
    } else {
      setEditMode(false);
      setSelectedCategory(null);
      setFormData({
        name: '',
        description: '',
        icon: 'fa-wrench',
        basePrice: '',
        isActive: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setSelectedCategory(null);
    setFormData({
      name: '',
      description: '',
      icon: 'fa-wrench',
      basePrice: '',
      isActive: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.basePrice) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      if (editMode) {
        await adminAPI.updateCategory(selectedCategory._id, formData);
        toast.success('Category updated successfully');
      } else {
        await adminAPI.createCategory(formData);
        toast.success('Category created successfully');
      }
      handleCloseModal();
      fetchCategories();
    } catch (error) {
      toast.error(editMode ? 'Failed to update category' : 'Failed to create category');
    }
  };

  const handleDelete = async () => {
    try {
      await adminAPI.deleteCategory(selectedCategory._id);
      toast.success('Category deleted successfully');
      setShowDeleteModal(false);
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete category');
    }
  };

  const handleToggleStatus = async (categoryId, currentStatus) => {
    try {
      await adminAPI.updateCategory(categoryId, { isActive: !currentStatus });
      toast.success('Category status updated');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to update category status');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="py-5 text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading categories...</p>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <h2 className="mb-1">Category Management</h2>
            <p className="text-muted">Manage service categories</p>
          </Col>
          <Col xs="auto">
            <Button variant="primary" onClick={() => handleOpenModal()}>
              <FaPlus className="me-2" />
              Add Category
            </Button>
          </Col>
        </Row>

        {/* Statistics */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="text-muted mb-2">Total Categories</h6>
                <h3 className="mb-0">{categories.length}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="text-muted mb-2">Active</h6>
                <h3 className="mb-0 text-success">
                  {categories.filter(c => c.isActive).length}
                </h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="text-muted mb-2">Inactive</h6>
                <h3 className="mb-0 text-secondary">
                  {categories.filter(c => !c.isActive).length}
                </h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h6 className="text-muted mb-2">Total Workers</h6>
                <h3 className="mb-0 text-info">
                  {categories.reduce((sum, c) => sum + (c.activeWorkerCount || 0), 0)}
                </h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Categories Grid */}
        <Row>
          {categories.map((category) => (
            <Col md={6} lg={4} key={category._id} className="mb-4">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary text-white rounded p-3 me-3">
                        <i className={`fas ${category.icon} fa-2x`}></i>
                      </div>
                      <div>
                        <h5 className="mb-0">{category.name}</h5>
                        <small className="text-muted">{category.activeWorkerCount || 0} workers</small>
                      </div>
                    </div>
                    <Badge bg={category.isActive ? 'success' : 'secondary'}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <p className="text-muted mb-3">{category.description}</p>
                  
                  <div className="mb-3">
                    <strong>Base Price:</strong> ₹{category.basePrice}
                  </div>

                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleOpenModal(category)}
                    >
                      <FaEdit className="me-1" />
                      Edit
                    </Button>
                    <Button
                      variant={category.isActive ? 'outline-warning' : 'outline-success'}
                      size="sm"
                      onClick={() => handleToggleStatus(category._id, category.isActive)}
                    >
                      {category.isActive ? <FaToggleOff className="me-1" /> : <FaToggleOn className="me-1" />}
                      {category.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowDeleteModal(true);
                      }}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Add/Edit Category Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Category' : 'Add New Category'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Category Name *</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Plumber"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the service"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Icon *</Form.Label>
              <Form.Select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                required
              >
                {iconOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Select>
              <div className="mt-2">
                <span className="text-muted">Preview: </span>
                <i className={`fas ${formData.icon} fa-2x text-primary`}></i>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Base Price (₹) *</Form.Label>
              <Form.Control
                type="number"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                placeholder="e.g., 300"
                min="0"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editMode ? 'Update Category' : 'Create Category'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the category <strong>{selectedCategory?.name}</strong>?
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default CategoryManagement;
