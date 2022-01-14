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
  const {isLoading, error, data, sendRequest } = useHttp();
  // const [ userIngedients, setUserIngredients] = useState([]);
  // const [ isLoading, setIsLoading] = useState(false);
  // const [ error, setError] = useState();

  // useEffect(() => {
  //   fetch('https://react-hooks-f4580-default-rtdb.firebaseio.com/ingredients.json')
  //     .then(response => response.json())
  //     .then(responseData => {
  //       const loadedIngredients = [];
  //       for ( const key in responseData) {
  //         loadedIngredients.push({
  //           id: key,
  //           title: responseData[key].title,
  //           amount: responseData[key].amount
  //         });
  //       }
  //       dispatch({type: 'SET', ingredients: filteredIngredients});
  //     })
  // }, []);

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngedients)
  }, [userIngedients]);

  const filteredIngreHandler = useCallback(filteredIngredients => {
   dispatch({type: 'SET', ingredients: filteredIngredients});
}, []); 
  
  const addIngredientHandler = useCallback(ingredient => {
    // dispatchHttp({type : 'SEND'});
    fetch('https://react-hooks-f4580-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json'}
    }).then( response => {
        // dispatchHttp({type:'RESPONSE'});
      return response.json()
    }).then( responseData => {
        // setUserIngredients(prevIngredients => 
        //   [...prevIngredients, 
        //     {id: responseData.name, ...ingredient}
        //   ]);
            dispatch({
              type: 'ADD',
              ingredients: {id: responseData.name, ...ingredient}});

      });  
 }, []);

    
  const removeIngredientHandler = useCallback(ingredientId => {
    sendRequest(`https://react-hooks-f4580-default-rtdb.firebaseio.com/ingredients/${ingredientId}.json`,
      'DELETE')
    
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
