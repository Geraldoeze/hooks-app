import React, {useState, useEffect} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {


  const [ userIngredients, setUserIngredients] = useState([]);

  useEffect(()=>{
    fetch( `https://react-hooks-f4580-default-rtdb.firebaseio.com/ingredients.json`).then(
      response => response.json()
    ).then(responseData => {
      const loadedIngredients = [];
      for (const key in responseData) {
        loadedIngredients.push({
          id: key,
          title: responseData[key].title,
          amount: responseData[key].amount
        });
      }
      setUserIngredients(loadedIngredients);
    })
  }, []);
      
  const addIngredientHandler = ingredient => {

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

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList onRemoveItem={()=>{}} ingredients={userIngredients}/>
      </section>
    </div>
  );
}

export default Ingredients;
