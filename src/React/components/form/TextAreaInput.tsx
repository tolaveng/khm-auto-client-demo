import React from 'react';
import { Form, FormFieldProps } from 'semantic-ui-react';

interface TextAreaInputProps extends FormFieldProps {
    label: string;
    rows?: number;
}

const TextAreaInput: React.FC<TextAreaInputProps> = (props) => {
    const { form, field, label, placeholder, rows, style} = props;
    const isError = form.errors[field.name] && form.touched[field.name]

    return (
        <Form.Field error={isError} style={{...style}}>
            <label>{label}</label>
            <textarea placeholder={placeholder} rows={rows} {...field} style={{...style}}/>
            <label style={{ color: 'red', fontSize: 'x-small' }}>
                {isError ? form.errors[field.name] : <span>&nbsp;</span>}
            </label>
        </Form.Field>
    );
};

export default TextAreaInput;
