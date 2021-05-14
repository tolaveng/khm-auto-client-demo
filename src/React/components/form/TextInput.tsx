import React, { CSSProperties } from 'react';
import { Form, FormFieldProps, Input} from 'semantic-ui-react';

interface TextInputProps extends FormFieldProps {
    label: string;
    icon?: string;
    inline?: boolean;
    readOnly?: boolean;
    onIconClick?: (value: string) => void;    
    placeholder?: string;
    type?: string;
    styles?: CSSProperties;
    fluid?: boolean;
    onChange?: React.FormEvent<HTMLInputElement>
}


type Props = TextInputProps;

const TextInput: React.FC<Props> = (props) => {
    const { input, meta, label, type, placeholder, inline, readOnly, icon, onIconClick, fluid, styles, ...rest } = props;
    const isError = meta.touched && !!meta.error;

    const inputIcon = icon ? { name: icon, circular: true, link: true, onClick: () => {
        if (onIconClick) onIconClick(input.value)
     }} : undefined;

    return (
        <Form.Field error={isError} inline={inline}>
            <label>{label}</label>
            {!!inputIcon && <Input type={type} placeholder={placeholder} icon={inputIcon}  {...input} readOnly={readOnly} style={styles} {...rest}/>}
            {!inputIcon && <input type={type} placeholder={placeholder} {...input} readOnly={readOnly} style={styles} {...rest}/>}
            {isError ? <div><label style={{ color: 'red', fontSize: 'x-small' }}>{meta.error}</label></div> : <div><label style={{fontSize: 'x-small'}}>&nbsp;</label></div>}
        </Form.Field>
    );
};

export default TextInput;
