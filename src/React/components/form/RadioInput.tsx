import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { Form, FormFieldProps, Input, Label } from 'semantic-ui-react';

interface RadioInputProps extends FieldRenderProps<any, HTMLElement>, FormFieldProps {
    label: string;
    htmlFor: string;
}

const RadioInput: React.FC<RadioInputProps> = (props) => {
    const { input, meta, label, htmlFor } = props;
    const isError = meta.touched && !!meta.error;

    return (
        <Form.Field error={isError} inline>
            <Input type='radio' {...input} id={htmlFor} />
            <label htmlFor={htmlFor}>{label}</label>
            {isError && <label style={{ color: 'red', fontSize: 'small' }}>{meta.error}</label>}
        </Form.Field>
    );
};

export default RadioInput;
