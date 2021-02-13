import React from 'react';

interface HeaderLineProps {
    label: string
}

export const HeaderLine: React.FunctionComponent<HeaderLineProps> = props => 
    <div style={{marginBottom: 24}}>
        <span style={{marginRight: 24, fontSize: 24, fontWeight: 'bold', verticalAlign: 'middle'}}>{props.label}</span>
        {props.children}
        <hr />
    </div>
;

