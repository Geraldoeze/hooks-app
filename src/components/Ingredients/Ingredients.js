import React, { useState, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

function Ingredients() {
  const [ userIngedients, setUserIngredients] = useState([]);

  // useEffect();


  
  const addIngredientHandler = (ingredient) => {
    fetch('https://react-hooks-f4580-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json'}
    }).then( response => {
      return response.json()
    }).then( responseData => {
        setUserIngredients(prevIngredients => 
          [...prevIngredients, 
            {id: responseData.name, ...ingredient}
          ]);
      });  
 };

  const removeIngredientHandler = ingredientId => {
    setUserIngredients(prevIngredients => 
      prevIngredients.filter(ingredient => ingredient.id !== ingredientId))
  };

  return (
    <div className="App">
      <IngredientForm onAdd={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList 
        onRemoveItem={removeIngredientHandler}
        ingredients={userIngedients}/>
      </section>
    </div>
  );
};

export default Ingredients;
