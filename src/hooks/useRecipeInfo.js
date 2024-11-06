import { useState, useEffect } from 'react';
import { recipeAPI } from '../services/recipe.api';

const useRecipeData = (recipeId) => {
  const [recipe, setRecipe] = useState({});
  const [ingredientData, setIngredientData] = useState([]);
  const [isRecipeLoaded, setIsRecipeLoaded] = useState(false);

  const formatIngredientData = (ingredients) => {
    return ingredients.map((item) => ({
      name: item.ingredientName,
      quantity: item.quantity,
      unit: item.unitName,
      price: Math.round(item.price * item.quantity),
      categoryId: item.category.id,
      categoryName: item.category.name,
    }));
  };

  const getRecipeById = async () => {
    try {
      const res = await recipeAPI.getRecipeById(recipeId);
      console.log(res.data);
      setRecipe(res.data);
      const formattedIngredients = formatIngredientData(res.data.ingredients);
      setIngredientData(formattedIngredients);
      setIsRecipeLoaded(true);
    } catch (error) {
      console.log('레시피를 불러올 수 없음', error);
    }
  };

  useEffect(() => {
    if (recipeId) {
      getRecipeById();
    }
  }, [recipeId]);

  return { recipe, ingredientData, isRecipeLoaded };
};

export default useRecipeData;
