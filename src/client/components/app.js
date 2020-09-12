import React, {useState, useEffect} from 'react';

function App() {
    const [order, setOrder] = useState();
    console.log(order)

    useEffect(function retrieveOrderFromServer() {
        if(window.__data__) {
            setOrder(window.__data__);
            delete window.__data__;
            document.getElementById('data').remove();
        }
    }, [])

    return (
        <div>
            {order && 
                <h1>Orden cargada</h1>
            }
            
            {!order && 
                <h1>La orden no se ha cargado correctamente</h1>
            }
        </div>
    );
};

export default App;
