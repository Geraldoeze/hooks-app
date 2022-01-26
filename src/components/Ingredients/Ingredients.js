import React, {useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal'
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD' :
      return [...currentIngredients,
          action.ingredients
        ];
    case 'DELETE' :
      return currentIngredients.filter(ing => ing.id !== action.id)
      default:
        throw new Error(' Should not go there');
  }
}



const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const { 
    isLoading, 
    error, 
    data, 
    sendRequest, 
    reqExtra, 
    reqIdentifier,
    clear,
    spin } = useHttp();

  useEffect(() => {
    if (!isLoading && !error && reqIdentifier ==='REMOVE_INGREDIENT') {
      dispatch({type: 'DELETE', id: reqExtra})
    } 
    else if (!isLoading && !error && reqIdentifier ==='ADD_INGREDIENT') {
      dispatch({ type: 'ADD', ingredients: 
      // something else must be added to this to update the DOM
        { id: data.name, ...reqExtra}})
    }
    console.log(data)
  }, [data, reqExtra, reqIdentifier, isLoading, error ]);

  const filteredIngredientsHandler = useCallback((filteredIngredient) => {
    dispatch({type: 'SET',
       ingredients: filteredIngredient});
      //  clears the spinner
    spin()
  }, [spin])
      
  
  const addIngredientHandler = useCallback(ingredient => {
    sendRequest(`https://react-hooks-f4580-default-rtdb.firebaseio.com/ingredients.son`, 
    'POST',
    JSON.stringify(ingredient),
    ingredient,
    'ADD_INGREDIENT'); 
    console.log(ingredient)
  }, [sendRequest]);

  const removeIngredientHandler = useCallback(ingredientId => {
    sendRequest(`https://react-hooks-f4580-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      'DELETE',
      null,
      ingredientId,
      'REMOVE_INGREDIENT'
      );
    console.log(ingredientId)
  }, [sendRequest]);


  const ingredientList = useMemo(() => {
    return(
      <IngredientList 
        onRemoveItem={removeIngredientHandler} 
        ingredients={userIngredients}/>
    )
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}> { error } </ErrorModal>}
      <IngredientForm 
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
         />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
