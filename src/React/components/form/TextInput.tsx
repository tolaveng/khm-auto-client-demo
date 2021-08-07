import { FormikProps } from 'formik';
import React, { ChangeEvent, CSSProperties } from 'react';
import { Form, FormFieldProps, Input, InputOnChangeData } from 'semantic-ui-react';

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
    onTextChange?: (value: string) => void;
    //onChange: React.ChangeEvent<HTMLInputElement> | undefined
}


type Props = TextInputProps;

const TextInput: React.FC<Props> = (props) => {
    const { field, form, label, type, placeholder, error, inline, readOnly, icon, onIconClick, fluid, onTextChange, styles, ...rest } = props;

    const isError = form.errors[field.name] && form.touched[field.name]

    const inputIcon = icon ? {
        name: icon, circular: true, link: true, inverted:false, color:'blue', onClick: () => {
            if (onIconClick) onIconClick(field.value)
        }
    } : undefined;

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
        form.setFieldValue(field.name, event.target.value)
        if (onTextChange) onTextChange(event.target.value)
    }

    return (
        <Form.Field error={isError} inline={inline}>
            <label>{label}</label>
            {!!inputIcon &&
                <Input type={type} placeholder={placeholder} icon={inputIcon}
                    {...field}
                    //value={field.value}
                    //onBlur={field.handleBlur}
                    onChange={onChangeHandler}
                    readOnly={readOnly} style={styles}
                    {...rest}
                />
            }

            {!inputIcon &&
                <input type={type} placeholder={placeholder}
                    {...field}
                    onChange={onChangeHandler}
                    readOnly={readOnly} style={styles}
                    {...rest}
                />
            }
            <label style={{ color: 'red', fontSize: 'x-small' }}>
                {isError ? form.errors[field.name] : <span>&nbsp;</span>}
            </label>
        </Form.Field>
    );
};


export default TextInput;
