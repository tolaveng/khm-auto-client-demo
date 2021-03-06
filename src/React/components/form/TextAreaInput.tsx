import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { Form, FormFieldProps } from 'semantic-ui-react';

interface TextAreaInputProps extends FieldRenderProps<any, HTMLElement>, FormFieldProps {
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
            {isError && <label style={{ color: 'red', fontSize: 'small' }}>{meta.error}</label>}
        </Form.Field>
    );
};

export default TextAreaInput;
