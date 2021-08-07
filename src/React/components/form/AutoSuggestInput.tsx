import React, { CSSProperties, MutableRefObject, useEffect, useRef, useState } from 'react';
import { Form, FormFieldProps } from 'semantic-ui-react';

interface DropdownInputProps extends FormFieldProps {
    label: string;
    options: string[];
    useContains?: boolean;
}

const AutoSuggestInput: React.FC<DropdownInputProps> = (props) => {
    const { form, field, label, placeholder, style, options, useContains } = props;
    const isError = form.errors[field.name] && form.touched[field.name]

    const [optionState, setOptionState] = useState({
        isShow: false,
        options: options,
        selectedIndex: -1
    });

    const selectRef = useRef<HTMLUListElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const itemRefs: HTMLLIElement[] = [];

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
        const inputClick = inputRef.current && inputRef.current.contains(evt.target as Node);
        const selectClick = selectRef.current && selectRef.current.contains(evt.target as Node);

        if (!selectClick && !inputClick) {
            setOptionState({ ...optionState, isShow: false });
        }
    }


    const selectHandler = (value: string) => {
        setOptionState({ ...optionState, isShow: false })
        form.setFieldValue(field.name, value);
        inputRef.current?.focus();
    }

    const renderDropdown = () => {
        const { options, isShow, selectedIndex } = optionState;
        if (!isShow || options.length == 0) return null;
        
        return (
            <div style={dropdownStyles}>
                <ul ref={selectRef} style={selectStyles}>
                    {
                        options.map((opt, i) => {
                            const selectedStyles = selectedIndex === i ?  selectedOptionStyles: {};
                            return <li key={i} ref={el => {if (el) itemRefs[i] = el}}
                            style={{...selectOptionStyles, ...selectedStyles}}
                             onClick={() => selectHandler(opt)}>
                                {opt}
                            </li>
                        })
                    }
                </ul>
            </div>
        );
    }

    const changeHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const val = evt.target.value;
        if (val.length > 1) {
            let newOptions = [];
            if (useContains) {
                newOptions = options.filter((opt) => opt.toLowerCase().indexOf(val.toLowerCase()) > -1);
            } else {
                newOptions = options.filter((opt) => opt.toLowerCase().startsWith(val.toLowerCase()));
            }
            setOptionState({ options: newOptions, isShow: true, selectedIndex: -1 })
        } else {
            setOptionState({ ...optionState, isShow: false, selectedIndex: -1 })
        }
        form.setFieldValue(field.name, val);
    }

    const keyDownHandler = (evt: React.KeyboardEvent<HTMLInputElement>) => {
        switch (evt.key) {
            case 'ArrowUp': {
                evt.preventDefault();
                if (!optionState.isShow) return;
                const selectedIndex = optionState.selectedIndex > 0 ? optionState.selectedIndex - 1 : 0;
                setOptionState({ ...optionState, selectedIndex: selectedIndex })
                itemRefs[selectedIndex].scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'start'});
                // form.setFieldValue(field.name, optionState.options[selectedIndex]);
            }
                break;

            case 'ArrowDown': {
                evt.preventDefault();
                if (!optionState.isShow) return;
                const selectedIndex = optionState.selectedIndex < optionState.options.length - 1 ? optionState.selectedIndex + 1 : optionState.options.length - 1;
                setOptionState({ ...optionState, selectedIndex: selectedIndex })
                itemRefs[selectedIndex].scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'start'});
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
                onKeyDown={keyDownHandler}
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
    backgroundColor: '#ededed',
    border: '1px solid #000000',
    borderRadius: '0px 0px 4px 4px',
    listStyle: 'none',
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

const selectedOptionStyles : CSSProperties = {
    background: '#0000aa',
    color: '#ffffff'
}

export default AutoSuggestInput;
