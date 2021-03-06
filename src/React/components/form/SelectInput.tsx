import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { Form, FormFieldProps, Select } from 'semantic-ui-react';

interface SelectInputProps extends FieldRenderProps<any, HTMLElement>, FormFieldProps {
    label: string;
    inline?: boolean;
    readOnly?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = (props) => {
    const { input, meta, placeholder, options, style } = props;
    const isError = meta.touched && !!meta.error;

    return (
        <Form.Field error={isError} style={{ ...style }}>
            <Select
                value={input.value}
                onChange={(e, val) => input.onChange(val.value)}
                placeholder={placeholder}
                options={options}
            />
            {isError && <label style={{ color: 'red', fontSize: 'small' }}>{meta.error}</label>}
        </Form.Field>
    );
};

export default SelectInput;
