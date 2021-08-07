import React, { createRef, CSSProperties } from 'react'
import { isSchema } from 'yup';


interface IProps {
    name: string;
    value: string;
    autoCompleteData?: string[];
    onTextChange?: (evt: React.ChangeEvent<HTMLTextAreaElement> | undefined, value: string) => void;
    onKeyPress?: (evt: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    rows: number;
    className?: string;
    onFocus?: () => void;
}

interface IState {
    value: string;
    isShowList: boolean,
    options: string[],
    selectedIndex: number
}


class TableEditorTextAreaComp extends React.PureComponent<IProps, IState>
{
    private inputRef = createRef<HTMLTextAreaElement>();
    private itemRefs : HTMLLIElement[]  = [];
    private selectRef = createRef<HTMLUListElement>();
    private isMounted = false;

    constructor(props: IProps) {
        super(props);

        this.state = {
            value: '',
            isShowList: false,
            options: [],
            selectedIndex: -1,
        }

        this.renderInput = this.renderInput.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onInputKeyPress = this.onInputKeyPress.bind(this);
        this.onInputBlur = this.onInputBlur.bind(this);
        this.onInputFocus = this.onInputFocus.bind(this);
        this.onItemSelected = this.onItemSelected.bind(this);
        this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
        this.renderAutoCompleteData = this.renderAutoCompleteData.bind(this);
    }

    static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
        if (nextProps.value != prevState.value) {
            return {
                value: nextProps.value
            }
        }
        return null;
    }

    componentDidMount() {
        const { value } = this.props;
        this.isMounted = true;

        this.setState({
            value,
            isShowList: false
        })
    }

    componentWillUnmount() {
        this.isMounted = false;
    }


    onInputChange(evt: React.ChangeEvent<HTMLTextAreaElement>): void {
        const { onTextChange, autoCompleteData } = this.props;
        const currentValue = evt.currentTarget.value;

        let options: string[] = [];
        if (autoCompleteData && autoCompleteData.length > 0 && currentValue.length > 1) {
            options = autoCompleteData.filter((data) => {
                if (data.toLocaleLowerCase().startsWith(currentValue.toLocaleLowerCase())) {
                    return data;
                }
            })
        }
        
        if (options.length > 0) {
            this.setState({ ...this.state, value: currentValue, isShowList: true, options: options, selectedIndex: -1 })
        } else {
            this.setState({ ...this.state, value: currentValue, isShowList: false, selectedIndex: -1 })
        }
        if (onTextChange) {
            onTextChange(evt, currentValue);
        }
    }


    onInputKeyPress(evt: React.KeyboardEvent<HTMLTextAreaElement>): void {
        const { onKeyPress } = this.props;
        if (onKeyPress) {
            onKeyPress(evt);
        }
    }

    onInputFocus(): void {
        const { onFocus } = this.props;
        if (onFocus) {
            onFocus();
        }
    }

    onInputBlur(evt: React.FocusEvent<HTMLTextAreaElement>): void {
        setTimeout(() => {
            if (!this.isMounted) return;
            this.setState({ ...this.state, isShowList: false })
        }, 200); // wait the select item click
    }


    onItemSelected(value: string): void {
        const { onTextChange } = this.props;
        this.setState({ ...this.state, value: value, isShowList: false }, () => {
            if (this.inputRef.current) {
                this.inputRef.current.focus();
            }
        });
        if (onTextChange) {
            onTextChange(undefined, value);
        }
    }

    onKeyDownHandler = (evt: React.KeyboardEvent<HTMLTextAreaElement>) : void => {
        const {options, isShowList, selectedIndex} = this.state;
        const {onTextChange} = this.props;

        switch (evt.key) {
            case 'ArrowUp': {
                if (!isShowList) return;
                evt.preventDefault();
                const newSelectedIndex = selectedIndex > 0 ? selectedIndex - 1 : 0;
                this.setState({ ...this.state, selectedIndex: newSelectedIndex }, () => {
                    this.itemRefs[newSelectedIndex].scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'start'});
                });
            }
                break;

            case 'ArrowDown': {
                if (!isShowList) return;
                evt.preventDefault();
                const newSelectedIndex = selectedIndex < options.length - 1 ? selectedIndex + 1 : options.length - 1;
                this.setState({ ...this.state, selectedIndex: newSelectedIndex }, () => {
                    this.itemRefs[newSelectedIndex].scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'start'});
                });
            }
                break;

            case 'Enter': {
                if (!isShowList) return;
                if (options.length > 0 && selectedIndex > -1) {
                    const value = options[selectedIndex];
                    this.setState({ ...this.state, isShowList: false, value: value }, () => {
                        if (this.inputRef.current) {
                            this.inputRef.current.focus();
                        }
                        if (onTextChange) {
                            onTextChange(undefined, value);
                        }
                    });
                }
            }
                break;

            case 'Escape':
                this.setState({ ...this.state, isShowList: false});
                break;
            default:
        }

    }


    renderInput(): JSX.Element {
        const { rows, name, className } = this.props;
        const { value } = this.state;
        return (
            <textarea
                name={name}
                key={name}
                onChange={this.onInputChange}
                onKeyPress={this.onInputKeyPress}
                onKeyDown={this.onKeyDownHandler}
                onBlur={this.onInputBlur}
                autoComplete='off'
                rows={rows}
                value={value}
                ref={this.inputRef}
                onFocus={this.onInputFocus}
                className={className}
            />
        );
    }


    renderAutoCompleteData() {
        const { options, selectedIndex } = this.state;
        if (options.length == 0) {
            return null;
        }

        return (
            <ul ref={this.selectRef} className='table-editor-autocomplete-data'>
                {
                    options.map((data, i) => {
                        const selected = selectedIndex === i ? 'selected' : '';
                        return (
                            <li key={i} style={selectOptionStyles} className={selected} onClick={() => this.onItemSelected(data)}
                            ref={el => {if (el) this.itemRefs[i] = el}} >
                                {data}
                            </li>
                        );
                    })
                }
            </ul>
        );
    }


    render(): JSX.Element {
        const { isShowList } = this.state;
        return (
            <div className='table-editor-autocomplete-wrapper'>
                {this.renderInput()}
                { isShowList && this.renderAutoCompleteData()}
            </div>
        );
    }
}

const selectOptionStyles: CSSProperties = {
    background: 'transparent',
    margin: 0,
    padding: '8px',
    borderBottom: '1px solid #cccccc',
    cursor: 'pointer',
}

export const TableEditorTextArea = TableEditorTextAreaComp;