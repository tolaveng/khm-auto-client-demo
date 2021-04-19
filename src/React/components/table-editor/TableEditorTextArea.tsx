import React, { createRef } from 'react'


interface IProps {
    name: string;
    value: string;
    autoCompleteData?: string[];
    onTextChange?: (evt: React.ChangeEvent<HTMLTextAreaElement> | undefined, value: string) => void;
    onKeyPress?: (evt:  React.KeyboardEvent<HTMLTextAreaElement>) => void;
    rows: number;
    className?: string;
    onFocus?: () => void;
}

interface IState {
    value: string;
    isShowList: boolean
}


class TableEditorTextAreaComp extends React.PureComponent<IProps, IState>
{
    private inputRef = createRef<HTMLTextAreaElement>();
    private isMounted = false;
    
    constructor(props: IProps) {
        super(props);

        this.state = {
            value: '',
            isShowList: false
        }

        this.renderInput = this.renderInput.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onInputKeyPress = this.onInputKeyPress.bind(this);
        this.onInputBlur = this.onInputBlur.bind(this);
        this.onInputFocus = this.onInputFocus.bind(this);
        this.onItemSelected = this.onItemSelected.bind(this);
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
        const {onTextChange} = this.props;
        const currentValue = evt.target.value;
        
        if (currentValue && currentValue.length > 1) {
            this.setState({...this.state, value: currentValue, isShowList: true})
        } else {
            this.setState({...this.state, value: currentValue, isShowList: false})
        }
        if (onTextChange) {
            onTextChange(evt, currentValue);
        }
    }


    onInputKeyPress(evt: React.KeyboardEvent<HTMLTextAreaElement>): void {
        const {onKeyPress} = this.props;
        if (onKeyPress) {
            onKeyPress(evt);
        }
    }

    onInputFocus() : void {
        const {onFocus} = this.props;
        if (onFocus) {
            onFocus();
        }
    }

    onInputBlur(evt: React.FocusEvent<HTMLTextAreaElement>): void {
        setTimeout(() =>{
            if (!this.isMounted) return;
            this.setState({...this.state, isShowList: false})
        }, 200); // wait the select item click
    }


    onItemSelected(value: string): void {
        const {onTextChange} = this.props;
        this.setState({...this.state, value: value, isShowList: false}, () => {
            if (this.inputRef.current) {
                this.inputRef.current.focus();
            }
        });
        if (onTextChange) {
            onTextChange(undefined, value);
        }
    }


    renderInput(): JSX.Element {
        const { rows, name } = this.props;
        const {value} = this.state;
        return (
            <textarea
                name={name}
                key={name}
                onChange={this.onInputChange}
                onKeyPress={this.onInputKeyPress}
                onBlur={this.onInputBlur}
                autoComplete='off'
                rows={rows}
                value={value}
                ref={this.inputRef}
                onFocus={this.onInputFocus}
            />
        );
    }


    renderAutoCompleteData(): JSX.Element[] | null {
        const { autoCompleteData } = this.props;
        const {value} = this.state;

        if (!autoCompleteData || autoCompleteData.length == 0) {
            return null;
        }

        const items =autoCompleteData.filter((data) => {
            if (data.startsWith(value)) {
               return data;
            }
        })

        return (
            items.map((data, i) => {
                return (
                    <li key={i} onClick={() => this.onItemSelected(data)}>
                        {data}
                    </li>
                );
            })
        );
    }


    render(): JSX.Element {
        const { isShowList } = this.state;
        return (
            <div className='table-editor-autocomplete-wrapper'>
                {this.renderInput()}
                { isShowList &&
                    <ul className='table-editor-autocomplete-data'>
                        {this.renderAutoCompleteData()}
                    </ul>
                }
            </div>
        );
    }
}


export const TableEditorTextArea = TableEditorTextAreaComp;