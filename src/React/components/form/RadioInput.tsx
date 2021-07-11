import React from 'react';
import { Form, FormFieldProps } from 'semantic-ui-react';

interface RadioInputProps extends FormFieldProps {
    label: string;
    htmlFor: string;
    defaultChecked?: boolean
}

const RadioInput: React.FC<RadioInputProps> = (props) => {
    const { form, field, label, htmlFor, ...rest } = props;
    const isError = form.errors[field.name] && form.touched[field.name]

    return (
        <Form.Field error={isError} inline>
            <input type='radio' id={htmlFor} style={{margin: 8}} {...field} {...rest}/>
            <label htmlFor={htmlFor}>{label}</label>
            <label style={{ color: 'red', fontSize: 'x-small' }}>
                {isError ? form.errors[field.name] : <span>&nbsp;</span>}
            </label>
        </Form.Field>
    );
};

export default RadioInput;
