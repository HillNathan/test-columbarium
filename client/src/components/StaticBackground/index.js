import React from 'react'
import './style.css'

function StaticBackground() {
    return (
        <div className="static-background">
            <img 
                className="background-image"
                src='./site-images/pexels-pixabay-158780.jpg'
                alt='blurred garden background'
            />
        </div>
    )
}

export default StaticBackground