import { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductManagement.css';

interface Product {
  id: number;
  name: string;
  mainTitle: string;
  subTitle: string;
  price: number;
  mrp: number;
  image: string | null;
  rating: number;
  reviews: number;
  weight: string;
  category: string;
}

const ProductManagement: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    mainTitle: '',
    subTitle: '',
    price: '',
    mrp: '',
    image: null as File | null,
    rating: '',
    reviews: '',
    weight: '',
    category: ''
  });

  const [productsByCategory, setProductsByCategory] = useState<Record<string, Product[]>>({
    'vegetable-powder': [],
    'fruit-powder': [],
    'pickles': [],
    'papad': [],
  });

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editCategory, setEditCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/products');
      const products = response.data;
      const categorizedProducts = {
        'vegetable-powder': products.filter((product: Product) => product.category === 'vegetable-powder'),
        'fruit-powder': products.filter((product: Product) => product.category === 'fruit-powder'),
        'pickles': products.filter((product: Product) => product.category === 'pickles'),
        'papad': products.filter((product: Product) => product.category === 'papad'),
      };
      setProductsByCategory(categorizedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prevState => ({ ...prevState, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData.name || !formData.category || !formData.price || (!formData.image && editIndex === null)) {
      alert('Please fill out all required fields.');
      return;
    }
  
    const form = new FormData();
    form.append('name', formData.name);
    form.append('mainTitle', formData.mainTitle);
    form.append('subTitle', formData.subTitle);
    form.append('price', formData.price);
    form.append('mrp', formData.mrp);
    form.append('rating', formData.rating);
    form.append('reviews', formData.reviews);
    form.append('weight', formData.weight);
    form.append('category', formData.category);
    if (formData.image) {
      form.append('image', formData.image);
    }
  
    try {
      const response = await axios.post('http://localhost:8080/api/products', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const newProduct = response.data;
  
      if (editIndex !== null && editCategory) {
        const updatedCategoryProducts = [...productsByCategory[editCategory]];
        updatedCategoryProducts[editIndex] = newProduct;
        setProductsByCategory({
          ...productsByCategory,
          [editCategory]: updatedCategoryProducts,
        });
        setEditIndex(null);
        setEditCategory(null);
      } else {
        const updatedCategoryProducts = [...productsByCategory[formData.category], newProduct];
        setProductsByCategory({
          ...productsByCategory,
          [formData.category]: updatedCategoryProducts,
        });
      }
  
      resetForm();
      fetchProducts(); // Refresh the products list
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      mainTitle: '',
      subTitle: '',
      price: '',
      mrp: '',
      image: null,
      rating: '',
      reviews: '',
      weight: '',
      category: ''
    });
  };

  const handleEdit = (category: string, index: number) => {
    const product = productsByCategory[category][index];
    setFormData({
      name: product.name,
      mainTitle: product.mainTitle,
      subTitle: product.subTitle,
      price: product.price.toString(),
      mrp: product.mrp.toString(),
      image: null,
      rating: product.rating.toString(),
      reviews: product.reviews.toString(),
      weight: product.weight,
      category: product.category
    });
    setEditIndex(index);
    setEditCategory(category);
  };

  const handleDelete = async (category: string, index: number) => {
    const productToDelete = productsByCategory[category][index];

    try {
      await axios.delete(`http://localhost:8080/api/products/${productToDelete.id}`);
      const updatedCategoryProducts = productsByCategory[category].filter((_, i) => i !== index);
      setProductsByCategory({
        ...productsByCategory,
        [category]: updatedCategoryProducts,
      });
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="admin-panel">
      <div className="container py-4">
        <div className="row">
          <div className="col-md-8 mx-auto">
            <h2 className="panel-header">Add and manage Products</h2>

            <div className="form-section">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Name *"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="category-select"
                      required
                    >
                      <option value="">Select Category *</option>
                      <option value="vegetable-powder">Vegetable Powder</option>
                      <option value="fruit-powder">Fruit Powder</option>
                      <option value="pickles">Pickles</option>
                      <option value="papad">Papad</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      name="mainTitle"
                      value={formData.mainTitle}
                      onChange={handleInputChange}
                      placeholder="Main Title"
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      name="subTitle"
                      value={formData.subTitle}
                      onChange={handleInputChange}
                      placeholder="Sub Title"
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Price *"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="number"
                      name="mrp"
                      value={formData.mrp}
                      onChange={handleInputChange}
                      placeholder="MRP"
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="file"
                      name="image"
                      onChange={handleImageUpload}
                      className="file-input"
                      required={editIndex === null}
                      accept="image/*"
                    />
                    {formData.image && <span>File: {(formData.image as File).name}</span>}
                  </div>

                  <div className="form-group">
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      placeholder="Rating"
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="number"
                      name="reviews"
                      value={formData.reviews}
                      onChange={handleInputChange}
                      placeholder="Reviews"
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="Weight"
                    />
                  </div>
                </div>

                <button type="submit" className="submit-button">
                  {editIndex !== null ? 'Update Product' : 'Add Product'}
                </button>
              </form>
            </div>

            <div className="products-section">
              <h3>Existing Products</h3>

              {['vegetable-powder', 'fruit-powder', 'pickles', 'papad'].map(category => (
                <div key={category}>
                  <h4>{category.replace('-', ' ').toUpperCase()}</h4>
                  <div className="products-list">
                    {productsByCategory[category].map((product, index) => (
                      <div key={index} className="product-item">
                        <div className="product-info">
                          {product.image && (
                            <img 
                              src={`http://localhost:8080/uploads/${product.image}`} 
                              alt={product.name}
                              className="product-thumbnail"
                              onError={(e) => {
                                console.error('Image failed to load:', product.image);
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          )}
                          <div className="product-details">
                            <h5>{product.name}</h5>
                            <span className="product-category">{category}</span>
                            <div className="product-price">
                              <span>Price: ₹{product.price}</span>
                              {product.mrp && <span className="mrp">MRP: ₹{product.mrp}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="action-buttons">
                          <button className="edit-button" onClick={() => handleEdit(category, index)}>Edit</button>
                          <button className="delete-button" onClick={() => handleDelete(category, index)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
