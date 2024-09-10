import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [formData, setFormData] = useState({
    name: "", image: "", time: "", rating: 0, category: "",
    url: "", review: "", author: "", description: "", ingredients: "", method: ""
  });

  useEffect(() => {
    axios.get('https://test.taproit.com/recipes')
      .then(res => {
        console.log(res.data); // For debugging
        setRecipes(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleIngredientsOrMethodChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const addRecipe = () => {
    const ingredientsArray = typeof formData.ingredients === 'string' 
      ? formData.ingredients.split(',').map(item => item.trim()) 
      : formData.ingredients;
    const methodArray = typeof formData.method === 'string'
      ? formData.method.split(',').map(item => item.trim()) 
      : formData.method;

    axios.post('https://test.taproit.com/recipes', { 
      ...formData, 
      ingredients: ingredientsArray, 
      method: methodArray 
    })
    .then(res => {
      setRecipes([...recipes, res.data]); // Use response data
      setFormData({
        name: "", image: "", time: "", rating: 0, category: "",
        url: "", review: "", author: "", description: "", ingredients: "", method: ""
      });
    })
    .catch(err => console.log(err));
  };

  const updateRecipe = (id) => {
    const ingredientsArray = typeof formData.ingredients === 'string' 
      ? formData.ingredients.split(',').map(item => item.trim()) 
      : formData.ingredients;
    const methodArray = typeof formData.method === 'string'
      ? formData.method.split(',').map(item => item.trim()) 
      : formData.method;

    axios.put(`https://test.taproit.com/recipes/${id}`, { 
      ...formData, 
      ingredients: ingredientsArray, 
      method: methodArray 
    })
    .then(res => {
      setRecipes(recipes.map(recipe => recipe.id === id ? res.data : recipe)); // Use response data
      setSelectedRecipe(null);
      setFormData({
        name: "", image: "", time: "", rating: 0, category: "",
        url: "", review: "", author: "", description: "", ingredients: "", method: ""
      });
    })
    .catch(err => console.log(err));
  };

  const deleteRecipe = (id) => {
    axios.delete(`https://test.taproit.com/recipes/${id}`)
      .then(res => setRecipes(recipes.filter(recipe => recipe.id !== id)))
      .catch(err => console.log(err));
  };

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe.id);
    setFormData({
      name: recipe.name,
      image: recipe.image,
      time: recipe.time,
      rating: recipe.rating,
      category: recipe.category,
      url: recipe.url,
      review: recipe.review,
      author: recipe.author,
      description: recipe.description,
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : '',
      method: Array.isArray(recipe.method) ? recipe.method.join(', ') : ''
    });
  };

  return (
    <Container>
      <Typography variant="h3" gutterBottom>Food Recipes</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>{selectedRecipe ? "Edit Recipe" : "Add Recipe"}</Typography>
              <TextField label="Name" name="name" value={formData.name} onChange={handleInputChange} fullWidth margin="normal" />
              <TextField label="Image URL" name="image" value={formData.image} onChange={handleInputChange} fullWidth margin="normal" />
              <TextField label="Time" name="time" value={formData.time} onChange={handleInputChange} fullWidth margin="normal" />
              <TextField label="Rating" type="number" name="rating" value={formData.rating} onChange={handleInputChange} fullWidth margin="normal" />
              <TextField label="Category" name="category" value={formData.category} onChange={handleInputChange} fullWidth margin="normal" />
              <TextField label="Recipe URL" name="url" value={formData.url} onChange={handleInputChange} fullWidth margin="normal" />
              <TextField label="Review" name="review" value={formData.review} onChange={handleInputChange} fullWidth margin="normal" />
              <TextField label="Author" name="author" value={formData.author} onChange={handleInputChange} fullWidth margin="normal" />
              <TextField 
                label="Description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                fullWidth margin="normal" 
              />
              <TextField 
                label="Ingredients (comma-separated)" 
                name="ingredients" 
                value={formData.ingredients} 
                onChange={(e) => handleIngredientsOrMethodChange('ingredients', e.target.value)} 
                fullWidth margin="normal" 
              />
              <TextField 
                label="Method (comma-separated)" 
                name="method" 
                value={formData.method} 
                onChange={(e) => handleIngredientsOrMethodChange('method', e.target.value)} 
                fullWidth margin="normal" 
              />
              <Button variant="contained" color="primary" onClick={selectedRecipe ? () => updateRecipe(selectedRecipe) : addRecipe}>
                {selectedRecipe ? "Update Recipe" : "Add Recipe"}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" gutterBottom>Recipes List</Typography>
          {recipes.map(recipe => (
            <Card key={recipe.id} style={{ marginBottom: '16px' }}>
              <CardMedia
                component="img"
                height="140"
                image={recipe.image}
                alt={recipe.name}
              />
              <CardContent>
                <Typography variant="h6">{recipe.name}</Typography>
                <Typography variant="body2" color="textSecondary">Time: {recipe.time}</Typography>
                <Typography variant="body2" color="textSecondary">Rating: {recipe.rating}</Typography>
                <Typography variant="body2" color="textSecondary">Category: {recipe.category}</Typography>
                <Typography variant="body2" color="textSecondary">Description: {recipe.description}</Typography>
                <Typography variant="body2" color="textSecondary">Ingredients: {Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : 'N/A'}</Typography>
                <Typography variant="body2" color="textSecondary">Method: {Array.isArray(recipe.method) ? recipe.method.join(', ') : 'N/A'}</Typography>
                <Button startIcon={<EditIcon />} onClick={() => handleSelectRecipe(recipe)}>Edit</Button>
                <Button startIcon={<DeleteIcon />} color="secondary" onClick={() => deleteRecipe(recipe.id)}>Delete</Button>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
