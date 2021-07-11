import React, { CSSProperties, useEffect, useState } from 'react';
import { Form, FormFieldProps } from 'semantic-ui-react';

interface DropdownInputProps extends FormFieldProps {
    label: string;
    options: string[]
}

const AutoSuggestInput: React.FC<DropdownInputProps> = (props) => {
    const { form, field, label, placeholder, style, options} = props;
    const isError = form.errors[field.name] && form.touched[field.name]

    const [optionState, setOptionState] = useState({
        isShow: false,
        options: options
    });

    useEffect(() => {
        setOptionState({isShow: false, options})
    }, [options])

    const renderDropdown = () => {
        if (!optionState.isShow || optionState.options.length == 0) return null;
        return(
            <div style={dropdownStyles}>
                <ul style={dropdownULStyles}>
                    {
                        optionState.options.map((opt, i) => <li key={i} style={dropdownLIStyles} onClick={() => selectHandler(opt)}>{opt}</li>)
                    }
                </ul>
            </div>
        );
    }

    const changeHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const val = evt.target.value;
        if (val.length > 1) {
            const newOptions = options.filter((opt) => opt.toLowerCase().startsWith(val.toLowerCase()));
            setOptionState({options: newOptions, isShow: true})
        }
        form.setFieldValue(field.name, val);
    }

    const blurHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setTimeout(() => {
            setOptionState({...optionState, isShow: false})
        }, 200);
    }

    const selectHandler = (value: string) => {
        setOptionState({...optionState, isShow: false})
        form.setFieldValue(field.name, value);
    }

    return (
        <Form.Field error={isError} style={{...style}}>
            <label>{label}</label>
            <input placeholder={placeholder} style={{...style}} value={field.value} onChange={changeHandler} onBlur={blurHandler} autoComplete='off'/>
            {optionState.isShow && renderDropdown()}
            <label style={{ color: 'red', fontSize: 'x-small' }}>
                {isError ? form.errors[field.name] : <span>&nbsp;</span>}
            </label>
        </Form.Field>
    );
};

const dropdownStyles: CSSProperties = {
    margin: 0,
    position: 'relative',
    width: '100%'
}

const dropdownULStyles: CSSProperties = {
    listStyle: 'none',
    border: '1px solid #cccccc',
    borderRadius: '5px',
    background: '#eeeeee',
    margin: 0,
    padding: 0,
    position: 'absolute',
    width: '100%',
    maxHeight: '240px',
    overflow: 'auto',
    zIndex: 1000
}

const dropdownLIStyles: CSSProperties = {
    listStyle: 'none',
    margin: 0,
    padding: '6px',
    borderBottom: '1px solid #cccccc',
    cursor: 'pointer',
    width: '100%'
}

export default AutoSuggestInput;
