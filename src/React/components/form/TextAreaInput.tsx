import React from 'react';
import { Form, FormFieldProps } from 'semantic-ui-react';

interface TextAreaInputProps extends FormFieldProps {
    label: string;
    rows?: number;
}

const TextAreaInput: React.FC<TextAreaInputProps> = (props) => {
    const { input, meta, label, placeholder, rows, style} = props;
    const isError = meta.touched && !!meta.error;

    return (
        <Form.Field error={isError} style={{...style}}>
            <label>{label}</label>
            <textarea placeholder={placeholder} rows={rows} {...input} style={{...style}}/>
            {isError ? <label style={{ color: 'red', fontSize: 'x-small' }}>{meta.error}</label> : <label style={{fontSize: 'x-small'}}>&nbsp;</label>}
        </Form.Field>
    );
};

export default TextAreaInput;
