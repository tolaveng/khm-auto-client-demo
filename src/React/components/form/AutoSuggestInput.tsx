import React, { CSSProperties, MutableRefObject, useEffect, useRef, useState } from 'react';
import { Form, FormFieldProps } from 'semantic-ui-react';

interface DropdownInputProps extends FormFieldProps {
    label: string;
    options: string[]
}

const AutoSuggestInput: React.FC<DropdownInputProps> = (props) => {
    const { form, field, label, placeholder, style, options } = props;
    const isError = form.errors[field.name] && form.touched[field.name]

    const [optionState, setOptionState] = useState({
        isShow: false,
        options: options,
        selectedIndex: -1
    });

    const selectRef = useRef() as MutableRefObject<HTMLSelectElement>;
    const inputRef = useRef() as MutableRefObject<HTMLInputElement>;

    useEffect(() => {
        setOptionState({ isShow: false, options, selectedIndex: 0 });
    }, [options])

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [])

    const handleOutsideClick = (evt: MouseEvent) => {
        const inputClick = inputRef.current.contains(evt.target);
        const selectClick = selectRef.current && selectRef.current.contains(evt.target);

        if (!selectClick && !inputClick) {
            setOptionState({ ...optionState, isShow: false });
        }
    }


    const selectHandler = (evt: React.MouseEvent<HTMLSelectElement>) => {
        const selectedIndex = evt.currentTarget.selectedIndex;
        setOptionState({ ...optionState, selectedIndex: selectedIndex, isShow: false })
        form.setFieldValue(field.name, optionState.options[selectedIndex]);
        inputRef.current.focus();
    }

    const renderDropdown = () => {
        const { options, isShow } = optionState;
        if (!isShow || options.length == 0) return null;
        let listSize = options.length > 6 ? 6 : options.length;
        listSize = listSize == 1 ? listSize + 1 : listSize; // +1 display as list, not dropdown
        return (
            <div style={dropdownStyles}>
                <select ref={selectRef} multiple={false} style={selectStyles} size={listSize} onClick={selectHandler}>
                    {
                        options.map((opt, i) => {
                            return <option key={i} style={selectOptionStyles} value={opt}>{opt}</option>
                        })
                    }
                </select>
            </div>
        );
    }

    const changeHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const val = evt.target.value;
        if (val.length > 1) {
            const newOptions = options.filter((opt) => opt.toLowerCase().startsWith(val.toLowerCase()));
            setOptionState({ options: newOptions, isShow: true, selectedIndex: -1 })
        } else {
            setOptionState({ ...optionState, isShow: false, selectedIndex: -1 })
        }
        form.setFieldValue(field.name, val);
    }

    const blurHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
        // setTimeout(() => {
        //     setOptionState({...optionState, isShow: false})
        // }, 200);
    }

    const keyPressHandler = (evt: React.KeyboardEvent<HTMLInputElement>) => {
        switch (evt.key) {
            case 'ArrowUp': {
                evt.preventDefault();
                if (!optionState.isShow) return;
                const selectedIndex = optionState.selectedIndex > 0 ? optionState.selectedIndex - 1 : 0;
                selectRef.current.selectedIndex = selectedIndex;
                setOptionState({ ...optionState, selectedIndex: selectedIndex })
                // form.setFieldValue(field.name, optionState.options[selectedIndex]);
            }
                break;

            case 'ArrowDown': {
                evt.preventDefault();
                if (!optionState.isShow) return;
                const selectedIndex = optionState.selectedIndex < optionState.options.length - 1 ? optionState.selectedIndex + 1 : optionState.options.length - 1;
                selectRef.current.selectedIndex = selectedIndex;
                setOptionState({ ...optionState, selectedIndex: selectedIndex })
                //form.setFieldValue(field.name, optionState.options[selectedIndex]);
            }
                break;

            case 'Enter': {
                evt.preventDefault();
                if (!optionState.isShow) return;
                if (optionState.isShow) {
                    setOptionState({ ...optionState, isShow: false })
                    form.setFieldValue(field.name, optionState.options[optionState.selectedIndex]);
                }
            }
                break;

            case 'Escape':
                setOptionState({ ...optionState, isShow: false })
                break;
            default:
        }

    }

    return (
        <Form.Field error={isError} style={{ ...style }}>
            <label>{label}</label>
            <input ref={inputRef} autoComplete='off' placeholder={placeholder} style={{ ...style }} value={field.value}
                onChange={changeHandler}
                onBlur={blurHandler}
                onKeyDown={keyPressHandler}
            />
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

const selectStyles: CSSProperties = {
    appearance: 'none',
    border: '1px solid #000000',
    borderRadius: '0px 0px 4px 4px',
    margin: 0,
    padding: '8px 0px',
    position: 'absolute',
    width: '100%',
    top: '-2px',
    maxHeight: '240px',
    overflowY: 'auto',
    overflowX: 'hidden',
    zIndex: 1000
}

const selectOptionStyles: CSSProperties = {
    background: 'transparent',
    margin: 0,
    padding: '8px',
    borderBottom: '1px solid #cccccc',
    cursor: 'pointer',
}

export default AutoSuggestInput;
