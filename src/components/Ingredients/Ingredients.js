import React, { useMemo, useEffect, useCallback, useReducer } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there!');    
  }
}
  

const Ingredients = () => {
  const [userIngedients, dispatch] = useReducer(ingredientReducer, []);
  const {isLoading, error, data, sendRequest, reqExtra, reqIdentifier } = useHttp();
  
  useEffect(() => { 
    if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
        dispatch({type: 'DELETE', id: reqExtra });
    } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT' ){
      dispatch({
        type: 'ADD',
        ingredients: {id: data.name, ...reqExtra }
      });

    }
  }, [data, reqExtra, reqIdentifier, isLoading, error]);

  const filteredIngreHandler = useCallback(filteredIngredients => {
   dispatch({type: 'SET', ingredients: filteredIngredients});
  }, []); 
  
  const addIngredientHandler = useCallback(ingredient => {
    sendRequest(
      'https://react-hooks-f4580-default-rtdb.firebaseio.com/ingredients.json', 
      'POST', 
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    );
 
 }, []);

    
  const removeIngredientHandler = useCallback(
    ingredientId => {
    sendRequest(`https://react-hooks-f4580-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      'DELETE',
      null,
      ingredientId,
      'REMOVE_INGREDIENT'
      )
    
  }, [sendRequest]);

  const clearError = useCallback(() => {
    // dispatchHttp({type:'CLEAR'});

  }, [])


  const ingredientList = useMemo(() => {
    return(
      <IngredientList 
      onRemoveItem={removeIngredientHandler}
      ingredients={userIngedients}/>
    )
  }, [userIngedients, removeIngredientHandler])

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError} >{error}</ErrorModal>}
      <IngredientForm 
        onAdd={addIngredientHandler}
        loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngreHandler}/>
        {ingredientList}
      
      </section>
    </div>
  );
};

export default Ingredients;
