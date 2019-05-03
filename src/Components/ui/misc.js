import React from 'react';
import { Link } from 'react-router-dom';

export const Tag = (props) => {
    const template = <div
    stlye={{
        background: props.bck,
        fontSize:props.size,
        color: props.color,
        padding: '5px 10px',
        display: 'inline-block',
        fontFamily: 'Righteous'
    }}
    >tag</div>

    if(props.link) {
        return (
            <Link to={props.linkto}>
            {template}
            </Link>
        )
    } else {
        return template
    }
}