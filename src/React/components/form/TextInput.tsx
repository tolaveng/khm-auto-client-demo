import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { Form, FormFieldProps, Input, Label } from 'semantic-ui-react';

interface TextInputProps extends FieldRenderProps<any, HTMLElement>, FormFieldProps {
    label: string;
    icon?: string;
    inline?: boolean;
    onIconClick?: () => void;
}

const TextInput: React.FC<TextInputProps> = (props) => {
    const { input, meta, type, label, placeholder, width, inline, icon, onIconClick } = props;
    const isError = meta.touched && !!meta.error;

    const inputIcon = icon ? { name: icon, circular: true, link: true, onClick: onIconClick } : undefined;

    return (
        <Form.Field error={isError} type={type} width={width} inline={inline}>
            <label>{label}</label>
            <Input type={type} placeholder={placeholder} {...input} icon={inputIcon} />
            {isError && <label style={{ color: 'red', fontSize: 'small' }}>{meta.error}</label>}
        </Form.Field>
    );
};

export default TextInput;
