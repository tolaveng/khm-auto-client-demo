import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { getCompany } from '../actions';
import { Company } from '../types/company';
import { Quote } from '../types/quote';
import { RootState } from '../types/root-state';
import { Service } from '../types/service';
import { pad6 } from '../utils/helper';

interface QuotePageProps {
    quote: Quote
}

interface PrintPageStateProps {
    company: Company
}

interface PrintPageDispatchProps {
    actions:{
        getCompany: () => void;
    }
}

type IProps = QuotePageProps & PrintPageStateProps & PrintPageDispatchProps;

class QuotePrintComp extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props);

        this.calculateTotal = this.calculateTotal.bind(this);
        this.renderContent = this.renderContent.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
    }

    componentDidMount() {
        this.props.actions.getCompany();
    }

    calculateTotal(services: Service[]) {
        const { quote } = this.props;

        let subTotal = 0;
        let amountTotal = 0;
        services.forEach((service) => {
            subTotal += Number(service.servicePrice) * Number(service.serviceQty);
        });
        amountTotal = subTotal - quote.discount;

        return {
            subTotal, amountTotal
        }
    }

    renderContent() {
        const { quote, company } = this.props;

        return (
            <div className='invoice-content'>
                <div className='invoice-content-header'>
                    <div className='print-col-left'>
                        <p>
                            <span className='invoice-heading'>KHM Motor Sports</span> <br />
                            ABN: {company.abn} <br />
                            {company.address} <br />
                            Phone: {company.phone}
                        </p>
                    </div>
                    <div className='print-col-right'>
                        <span className='invoice-heading'>Quote</span> <br />
                        <table>
                            <tbody>
                                <tr><td>Quote No:</td><td>{pad6(quote.quoteId)}</td></tr>
                                <tr><td>Date:</td><td>{moment(quote.quoteDate).format('DD/MM/yyyy')}</td></tr>
                                <tr><td>Reg No:</td><td>{quote.car.carNo}</td></tr>
                                {!!quote.car.odo && <tr><td>ODO:</td><td>{quote.car.odo}</td></tr>}
                                {!!quote.car.carMake && <tr><td>Make:</td><td>{quote.car.carMake}</td></tr>}
                                {!!quote.car.carModel && <tr><td>Model:</td><td>{quote.car.carModel}</td></tr>}
                                {!!quote.car.carYear && <tr><td>Year:</td><td>{quote.car.carYear}</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className='print-space'></div>

                <div>
                    <div>To:{!!quote.fullName && quote.fullName}</div>
                    {!!quote.company && <div>{quote.company}</div>}
                    {!!quote.abn && <div>ABN: {quote.abn}</div>}
                    {!!quote.address && <div>{quote.address}</div>}
                    <div>
                        {!!quote.phone && <span>{quote.phone}</span>}
                        {quote.phone && quote.email && <span>, </span>}
                        {!!quote.email && <span>{quote.email}</span>}
                    </div>
                </div>

                <div className='print-space'></div>

                <table className='invoice-service-table' style={{ width: '100%' }}>
                    <thead>
                        <tr className='invoice-service-table-header'>
                            <th style={{ textAlign: 'left' }}>Services</th>
                            <th style={{ width: '12%' }}>Price</th>
                            <th style={{ width: '12%' }}>Qty</th>
                            <th style={{ width: '15%' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            quote.services.map((ser) => {
                                return (
                                    <tr className='invoice-service-table-data' key={ser.serviceId}>
                                        <td style={{ textAlign: 'left' }}>
                                            {ser.serviceName.split('\n').map((item, key) => {
                                                return <span key={key}>{item}<br /></span>
                                            })}
                                        </td>
                                        <td>{ser.servicePrice}</td>
                                        <td>{ser.serviceQty}</td>
                                        <td>{(ser.servicePrice * ser.serviceQty).toFixed(2)}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>

                <div className='print-space'></div>
                {
                    quote.note && <div style={{ fontSize: '0.8rem', border: '1px solid #000000', padding: 12, maxWidth: '60%' }}>
                        <div><b>Note </b></div>
                        <p>
                            {quote.note.split('\n').map((item, key) => {
                                return <span key={key}>{item}<br /></span>
                            })}
                        </p>
                    </div>
                }
            </div>
        );
    }


    renderFooter() {
        const { quote, company } = this.props;
        const calTotal = this.calculateTotal(quote.services);

        return (
            <div className='invoice-footer'>
                <div className='invoice-footer-total'>
                    <table>
                        <tbody>
                            <tr>
                                <td style={{ textAlign: 'right' }}>Subtotal</td>
                                <td style={{ textAlign: 'right' }}>{calTotal.subTotal.toFixed(2)}</td>
                            </tr>
                            {
                                (quote.discount && Number(quote.discount)) > 0 &&
                                <tr>
                                    <td style={{ textAlign: 'right' }}>Discount</td>
                                    <td style={{ textAlign: 'right' }}>{Number(quote.discount).toFixed(2)}</td>
                                </tr>
                            }
                            <tr style={{ backgroundColor: '#cccccc' }}>
                                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>Balance due</td>
                                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{calTotal.amountTotal.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{ clear: 'both' }}></div>
                </div>


                <div className='print-space'></div>

                <p style={{ fontSize: '0.8rem' }}>
                    Direct deposit to: {company.bankName} <br />
                    Account Name: {company.bankAccountName} <br />
                    BSB: {company.bankBsb} <br />
                    Account No: {company.bankAccountNumber} <br />
                </p>
            </div>
        );
    }


    render() {
        return (
            <div className='print-container'>
                <table width='100%' style={{ width: '100%' }}>
                    <thead>
                        <tr><td>
                            <div className='invoice-header'></div>
                        </td></tr>
                    </thead>

                    <tbody>
                        <tr><td>
                            {this.renderContent()}
                        </td></tr>
                    </tbody>

                    <tfoot>
                        <tr><td>
                            {this.renderFooter()}
                        </td></tr>
                    </tfoot>
                </table>
            </div>
        );
    }

}

const mapStateToProps = (state: RootState): PrintPageStateProps => {
    return {
        company: state.company
    }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): PrintPageDispatchProps => {
    return {
        actions: {
            getCompany : bindActionCreators(getCompany, dispatch)
        }
    }
}

export const QuotePrint = connect(mapStateToProps, mapDispatchToProps, null, {forwardRef: true})(QuotePrintComp);