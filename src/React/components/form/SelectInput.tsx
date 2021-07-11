import React from 'react';
import { Form, FormFieldProps, Select } from 'semantic-ui-react';

interface SelectInputProps extends FormFieldProps {
    label: string;
    inline?: boolean;
    readOnly?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = (props) => {
    const { form, field, placeholder, options, style } = props;
    const isError = form.errors[field.name] && form.touched[field.name]

    return (
        <Form.Field error={isError} style={{ ...style }}>
            <Select
                value={field.value}
                onChange={(e, val) => field.onChange(val.value)}
                onBlur={(e, val) => field.onBlur(val.value)}
                placeholder={placeholder}
                options={options}
            />
            <label style={{ color: 'red', fontSize: 'x-small' }}>
                {isError ? form.errors[field.name] : <span>&nbsp;</span>}
            </label>
        </Form.Field>
    );
};

export default SelectInput;
