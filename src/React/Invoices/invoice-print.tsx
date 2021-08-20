import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { getCompany } from '../actions';
import { Company } from '../types/company';
import { Invoice } from '../types/invoice';
import { RootState } from '../types/root-state';
import { Service } from '../types/service';
import { pad6, RoundToTwo } from '../utils/helper';

interface PrintPageProps {
    invoice: Invoice
}

interface PrintPageStateProps {
    company: Company
}

interface PrintPageDispatchProps {
    actions:{
        getCompany: () => void;
    }
}

type IProps = PrintPageProps & PrintPageStateProps & PrintPageDispatchProps;

class InvoicePrintComp extends React.Component<IProps> {
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
        const { invoice } = this.props;

        let subTotal = 0;
        let gstTotal = 0;
        let amountTotal = 0;
        services.forEach((service) => {
            subTotal += Number(service.servicePrice) * Number(service.serviceQty);
        });
        
        subTotal = subTotal - invoice.discount;
        gstTotal = RoundToTwo(subTotal * invoice.gst/100);
        amountTotal = subTotal + gstTotal;

        return {
            subTotal, amountTotal, gstTotal
        }
    }

    renderContent() {
        const { invoice, company } = this.props;

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
                        <span className='invoice-heading'>Tax Invoice</span> <br />
                        <table>
                            <tbody>
                                <tr><td>Invoice No:</td><td>{pad6(invoice.invoiceNo)}</td></tr>
                                <tr><td>Date:</td><td>{moment(invoice.invoiceDate).format('DD/MM/yyyy')}</td></tr>
                                <tr><td>Reg No:</td><td>{invoice.car.carNo}</td></tr>
                                {!!invoice.car.odo && <tr><td>ODO:</td><td>{invoice.car.odo}</td></tr>}
                                {!!invoice.car.carMake && <tr><td>Make:</td><td>{invoice.car.carMake}</td></tr>}
                                {!!invoice.car.carModel && <tr><td>Model:</td><td>{invoice.car.carModel}</td></tr>}
                                {!!invoice.car.carYear && <tr><td>Year:</td><td>{invoice.car.carYear}</td></tr>}
                                {!!invoice.car.color && <tr><td>Color:</td><td>{invoice.car.color}</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className='print-space'></div>

                <div>
                    <div>To:{!!invoice.fullName && invoice.fullName}</div>
                    {!!invoice.company && <div>{invoice.company}</div>}
                    {!!invoice.abn && <div>ABN: {invoice.abn}</div>}
                    {!!invoice.address && <div>{invoice.address}</div>}
                    <div>
                        {!!invoice.phone && <span>{invoice.phone}</span>}
                        {invoice.phone && invoice.email && <span>, </span>}
                        {!!invoice.email && <span>{invoice.email}</span>}
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
                            invoice.services.map((ser, i) => {
                                return (
                                    <tr className='invoice-service-table-data' key={`${ser.serviceId}_${i}`}>
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
                    invoice.note && <div style={{ fontSize: '0.8rem', border: '1px solid #000000', padding: 12, maxWidth: '60%' }}>
                        <div><b>Note </b></div>
                        <p>
                        {invoice.note.split('\n').map((item, key) => {
                            return <span key={key}>{item}<br /></span>
                        })}
                        </p>
                    </div>
                }
            </div>
        );
    }


    renderFooter() {
        const { invoice, company } = this.props;
        const calTotal = this.calculateTotal(invoice.services);

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
                                (invoice.discount && Number(invoice.discount)) > 0 &&
                                <tr>
                                    <td style={{ textAlign: 'right' }}>Discount</td>
                                    <td style={{ textAlign: 'right' }}>{Number(invoice.discount).toFixed(2)}</td>
                                </tr>
                            }
                            <tr>
                                <td style={{ textAlign: 'right' }}>GST</td>
                                <td style={{ textAlign: 'right' }}>{calTotal.gstTotal.toFixed(2)}</td>
                            </tr>
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
        company : state.company
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): PrintPageDispatchProps => {
    return {actions : {
        getCompany: bindActionCreators(getCompany, dispatch)
    }}
};

export const InvoicePrint = connect(mapStateToProps, mapDispatchToProps, null, {forwardRef: true})(InvoicePrintComp);