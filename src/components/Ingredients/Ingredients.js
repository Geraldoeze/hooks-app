import React, {useReducer, useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal'


const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD' :
      return [...currentIngredients, action.ingredient];
    case 'DELETE' :
      return currentIngredients.filter(ing.id !== action.id)
      default:
        throw new Error(' Should not go there');
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [isLoading, setIsLoading] = useState(false);
  const [ userIngredients, setUserIngredients] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients)
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback((filteredIngredient) => {
    dispatch({type: 'SET', ingredients: filteredIngredient});
  }, [])
      
  const addIngredientHandler = ingredient => {
    setIsLoading(true)
    setUserIngredients(prevIngredients => 
      [...prevIngredients,
         {id: Math.random().toString(),
        ...ingredient 
        }
      ]
    )
    fetch( `https://react-hooks-f4580-default-rtdb.firebaseio.com/ingredients.json`,{
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => { 
      setIsLoading(false);
      // this fetches the response from firebase that has a unique id
      return response.json();
    }).then(responseData => {
      // the unique id is passed to our userIngredients
        setUserIngredients(prevIngredients => 
          [...prevIngredients,
            {id: responseData.name,
            ...ingredient 
            }
          ]
        )
    })
  }

  const removeIngredientHandler = ingredientId => {
    setIsLoading(true);
    fetch( `https://react-hooks-f4580-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,{
      method: 'DELETE'
    }).then( response => {
      setIsLoading(false);
      setUserIngredients(prevIngredients => 
      prevIngredients.filter( ingredient => ingredient.id !== ingredientId))
    }).catch(error => {
      setError(error.message);   
      setIsLoading(false);

    })
  }

  const clearError = () => {
    setError(null);
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}> { error } </ErrorModal>}
      <IngredientForm 
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
         />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList onRemoveItem={removeIngredientHandler} ingredients={userIngredients}/>
      </section>
    </div>
  );
}

export default Ingredients;
