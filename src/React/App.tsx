import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import InvoicePage from './Invoices';
import { InvoiceEdit } from './Invoices/invoice-edit';

const App: React.FunctionComponent = () => {
    return (
        <Router>
            <Switch>
                {/* <Route path="/invoice-edit:{id}" component={InvoiceEdit} />
                <Route path="/invoice-edit" component={InvoiceEdit} />
                <Route path="/invoice" component={InvoicePage} />
                <Route exact path="/" component={InvoicePage} /> */}

                {/* Invoice */}
                <Route path="/invoice/invoice-edit">
                    <InvoiceEdit />
                </Route>
                <Route path="/invoice-edit">
                    <InvoiceEdit />
                </Route>
                <Route path="/invoice">
                    <InvoicePage />
                </Route>

                {/* Invoice */}
                <Route path="/">
                    <InvoicePage />
                </Route>
            </Switch>
        </Router>
    );
};

export default App;
