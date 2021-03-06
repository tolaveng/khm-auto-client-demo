import React, { InputHTMLAttributes } from 'react';
import ReactDatePicker from 'react-datepicker';
import { FieldRenderProps } from 'react-final-form';
import { Form, FormFieldProps, Icon, Input } from 'semantic-ui-react';

interface DatePickerInputProps extends FieldRenderProps<any, HTMLElement>, FormFieldProps {
    label: string;
    disabled?: boolean;
    readOnly?: boolean;
}

const CustomInput = ({ value, onClick }: any) => (
    <Input value={value} onClick={onClick} icon='calendar alternate outline'/>
  );

const DatePickerInput: React.FC<DatePickerInputProps> = (props) => {
    const { input, meta, label, style, readOnly, disabled } = props;
    const isError = meta.touched && !!meta.error;

    return (
        <Form.Field error={isError} style={{ ...style }}>
            <label>{label}</label>
            <Form.Group>
                <ReactDatePicker
                    dateFormat='dd/MM/yyyy'
                    selected={input.value || new Date()}
                    onChange={(date) => {
                        input.onChange(date);
                    }}
                    readOnly={readOnly}
                    disabled={disabled}
                    closeOnScroll={true}
                    
                />
            </Form.Group>
            {isError && <label style={{ color: 'red', fontSize: 'small' }}>{meta.error}</label>}
        </Form.Field>
    );
};

export default DatePickerInput;
