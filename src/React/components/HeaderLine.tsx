import React from 'react';
import { Icon, SemanticICONS } from 'semantic-ui-react';

interface HeaderLineProps {
    label: string
    icon?: SemanticICONS
}

export const HeaderLine: React.FunctionComponent<HeaderLineProps> = props => 
    <header style={{marginBottom: 24}}>
        {!!props.icon && <Icon name={props.icon} style={{fontSize: 20}} /> }
        <span style={{marginRight: 24, fontSize: 24, fontWeight: 'bold', verticalAlign: 'middle'}}>{props.label}</span>
        {props.children}
        <hr />
    </header>
;

