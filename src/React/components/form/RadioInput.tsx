import React from 'react';
import { Form, FormFieldProps } from 'semantic-ui-react';

interface RadioInputProps extends FormFieldProps {
    label: string;
    htmlFor: string;
    defaultChecked?: boolean
}

const RadioInput: React.FC<RadioInputProps> = (props) => {
    const { input, meta, label, htmlFor, ...rest } = props;
    const isError = meta.touched && !!meta.error;

    return (
        <Form.Field error={isError} inline>
            <input type='radio' id={htmlFor} style={{margin: 8}} {...input} {...rest}/>
            <label htmlFor={htmlFor}>{label}</label>
            {isError ? <label style={{ color: 'red', fontSize: 'x-small', display: 'block' }}>{meta.error}</label> : <label style={{fontSize: 'x-small', display: 'block'}}>&nbsp;</label>}
        </Form.Field>
    );
};

export default RadioInput;
