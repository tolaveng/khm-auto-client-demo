import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { Form, FormFieldProps, Input} from 'semantic-ui-react';

interface TextInputProps extends FieldRenderProps<any, HTMLElement>, FormFieldProps {
    label: string;
    icon?: string;
    inline?: boolean;
    readOnly?: boolean;
    onIconClick?: () => void;
}

const TextInput: React.FC<TextInputProps> = (props) => {
    const { input, meta, type, label, placeholder, width, inline, style, readOnly, icon, onIconClick } = props;
    const isError = meta.touched && !!meta.error;

    const inputIcon = icon ? { name: icon, circular: true, link: true, onClick: onIconClick } : undefined;

    return (
        <Form.Field error={isError} type={type} width={width} inline={inline} style={{...style}}>
            <label>{label}</label>
            {!!inputIcon && <Input type={type} placeholder={placeholder} icon={inputIcon}  {...input} style={{...style}} readOnly={readOnly} />}
            {!inputIcon && <input type={type} placeholder={placeholder} {...input} style={{...style}} readOnly={readOnly} />}
            {isError && <label style={{ color: 'red', fontSize: 'small' }}>{meta.error}</label>}
        </Form.Field>
    );
};

export default TextInput;
