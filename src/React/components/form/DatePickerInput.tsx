import moment from 'moment';
import React, { useEffect } from 'react';
import ReactDatePicker from 'react-datepicker';
import { Form, FormFieldProps} from 'semantic-ui-react';

interface DatePickerInputProps extends FormFieldProps {
    label: string;
    disabled?: boolean;
    readOnly?: boolean;
    defaultDate?: Date;
}


const DatePickerInput: React.FC<DatePickerInputProps> = (props) => {
    const { input, placeholder, meta, label, style, readOnly, disabled, defaultDate } = props;
    const isError = meta.touched && !!meta.error;


    const setChange = (date: Date) => {
        if (!date) return '';
        // update state, avoid warning, delay 100ms
        setTimeout(() => {
            input.onChange(moment(date).format("DD/MM/YYYY"))
        }, 100);        
    }

    let selectedDate = defaultDate;
    const parseDate = input.value ? moment(input.value, "DD/MM/YYYY") : null;
    const parseISODate = input.value ? moment(input.value, "YYYY-MM-DD") : null;

    if (parseDate && parseDate.isValid())
    {
        selectedDate = parseDate.toDate();
    }
    else if (parseISODate && parseISODate.isValid())
    {
        selectedDate = parseISODate.toDate();
    }
    else if (selectedDate){
        setChange(selectedDate);
    }
    
    return (
        <Form.Field error={isError}>
            <label>{label}</label>
            <Form.Group>
            <div className="ui icon input">
                <ReactDatePicker
                    dateFormat='dd/MM/yyyy'
                    selected={selectedDate}
                    onChange={setChange}
                    readOnly={readOnly}
                    disabled={disabled}
                    closeOnScroll={true}
                    onBlur={input.onBlur}
                    placeholderText={placeholder}
                />
                <i className="calendar alternate outline icon"></i>
                </div>
            </Form.Group>
            {isError ? <label style={{ color: 'red', fontSize: 'x-small' }}>{meta.error}</label> : <label style={{fontSize: 'x-small'}}>&nbsp;</label>}
        </Form.Field>
    );
};

export default DatePickerInput;
