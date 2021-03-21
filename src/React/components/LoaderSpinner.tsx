import React, { CSSProperties } from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

interface Props {
    style?: CSSProperties
}

export const LoaderSpinner: React.FC<Props> = (props) => {
    return (
        <Dimmer active page={true} inverted>
            <Loader inverted>Loading</Loader>
        </Dimmer>
    );
};
