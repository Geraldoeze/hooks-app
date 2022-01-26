import { useReducer, useCallback  } from "react";


const initialState = {
    loading: true,
    error: null,
    data: null,
    extra: null,
    identifier:  null
 }
const httpReducer = (curhttpState, action) => {
    switch (action.type) {
      case 'SEND':
        return { loading: true, error: null, data: null, extra: null, identifier: action.identifier};
      case 'RESPONSE':
        return {...curhttpState, loading: false, data: action.responseData, extra: action.reqExtra};
      case 'ERROR':
        return {loading: false, error: action.errorMessage};
      case 'CLEAR':
        return initialState
      case 'SPIN':
          return { ...curhttpState, loading: false};  
      default:
        throw new Error('Error')  
    }
  }

const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, initialState)

    const clear = useCallback(() => dispatchHttp({type: 'CLEAR'}), [] );

    const spinner = useCallback(() => dispatchHttp({type: 'SPIN'}),[])

    const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifier) => {
        console.log(reqExtra)
        dispatchHttp({type: 'SEND', identifier: reqIdentifier });
        fetch( 
            url, 
            {method: method,
             body: body,
             headers: {
                 'Content-Type': 'application/json'
             }   
        }).then( response => {
        return response.json();
        }).then(responseData => {
            console.log(responseData)

            dispatchHttp({type: 'RESPONSE', responseData: responseData, reqExtra: reqExtra})
        })
        .catch(error => {
        dispatchHttp({type: 'ERROR', errorMessage: error.message})
 
        })
    }, [])

    return {
        isLoading: httpState.loading,
        data: httpState.data,
        error: httpState.error,
        sendRequest: sendRequest,
        reqExtra: httpState.extra,
        reqIdentifier: httpState.identifier,
        clear: clear,
        spin: spinner
    } 
};

export default useHttp;