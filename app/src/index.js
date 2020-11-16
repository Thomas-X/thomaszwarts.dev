import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Loader} from "@react-three/drei";

ReactDOM.render(
    <React.StrictMode>
        <Suspense fallback={null}>
            <App/>
        </Suspense>
        <Loader />
    </React.StrictMode>,
    document.getElementById('root')
);
