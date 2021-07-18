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

// https://reactdatepicker.com/
const DatePickerInput: React.FC<DatePickerInputProps> = (props) => {
    const { form, field, placeholder, label, readOnly, disabled, defaultDate} = props;
    const isError = form.errors[field.name] && form.touched[field.name]


    const setChange = (date: Date) => {
        if (!date) return '';
        const dateString = moment(date).format("DD/MM/YYYY");
        form.setFieldValue(field.name, dateString);
    }

    let selectedDate = defaultDate;
    const parseDate = field.value ? moment(field.value, "DD/MM/YYYY") : null;
    const parseISODate = field.value ? moment(field.value, "YYYY-MM-DD") : null;

    if (parseDate && parseDate.isValid())
    {
        selectedDate = parseDate.toDate();
    }
    else if (parseISODate && parseISODate.isValid())
    {
        selectedDate = parseISODate.toDate();
    }

    useEffect(() =>{
          // set init date
        if (selectedDate) {
            setChange(selectedDate);
        }
    }, [])
    
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
                    placeholderText={placeholder}
                />
                <i className="calendar alternate outline icon"></i>
                </div>
            </Form.Group>
            <label style={{ color: 'red', fontSize: 'x-small' }}>
                {isError ? form.errors[field.name] : <span>&nbsp;</span>}
            </label>
        </Form.Field>
    );
};

export default DatePickerInput;
