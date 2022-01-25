import React, {useReducer, useEffect, useCallback } from 'react';

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
      return currentIngredients.filter(ing => ing.id !== action.id)
      default:
        throw new Error(' Should not go there');
  }
}

const httpReducer = (curhttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null};
    case 'RESPONSE':
      return {...curhttpState, loading: false};
    case 'ERROR':
      return {loading: false, error: action.errorMessage};
    case 'CLEAR':
      return {...curhttpState, error: null};  
    default:
      throw new Error('Error')  
  }
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: true, error: null})
  

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients)
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback((filteredIngredient) => {
    dispatch({type: 'SET', ingredients: filteredIngredient});
  }, [])
      
  const addIngredientHandler = ingredient => {
    dispatchHttp({type: 'SEND'})
  
    fetch( `https://react-hooks-f4580-default-rtdb.firebaseio.com/ingredients.json`,{
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => { 
      dispatchHttp({type: 'RESPONSE'})
      // this fetches the response from firebase that has a unique id
      return response.json();
    }).then(responseData => {
      // the unique id is passed to our userIngredients
       dispatch({ type: 'ADD', ingredient: { id: responseData.name, ...ingredient}})
    })
  }

  const removeIngredientHandler = ingredientId => {
    dispatchHttp({type: 'SEND'});
    fetch( `https://react-hooks-f4580-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,{
      method: 'DELETE'
    }).then( response => {
      dispatchHttp({type: 'RESPONSE'})
      dispatch({type: 'DELETE', id: ingredientId})
    }).catch(error => {
      dispatchHttp({type: 'ERROR', errorMessage: error.message})

    })
  }

  const clearError = () => {
    dispatchHttp({type: 'CLEAR'});
  }

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}> { httpState.error } </ErrorModal>}
      <IngredientForm 
        onAddIngredient={addIngredientHandler}
        loading={httpState.loading}
         />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList onRemoveItem={removeIngredientHandler} ingredients={userIngredients}/>
      </section>
    </div>
  );
}

export default Ingredients;
