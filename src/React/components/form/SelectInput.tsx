import React from 'react';
import { Form, FormFieldProps, Select } from 'semantic-ui-react';

interface SelectInputProps extends FormFieldProps {
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
            {isError ? <label style={{ color: 'red', fontSize: 'x-small' }}>{meta.error}</label> : <label style={{fontSize: 'x-small'}}>&nbsp;</label>}
        </Form.Field>
    );
};

export default SelectInput;
