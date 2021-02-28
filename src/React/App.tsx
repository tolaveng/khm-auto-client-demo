import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { InvoicePage } from './invoices';
import { InvoiceEditPage } from './invoices/invoice-edit';


const App: React.FC = () => {
    
    return (
        <Router>
            <Switch>
                {/* <Route path="/invoice-edit:{id}" component={InvoiceEdit} />
                <Route path="/invoice-edit" component={InvoiceEdit} />
                <Route path="/invoice" component={InvoicePage} />
                <Route exact path="/" component={InvoicePage} /> */}

                {/* Invoice */}
                <Route path="/invoice/edit/:id">
                    <InvoiceEditPage />
                </Route>
                <Route path="/invoice/new">
                    <InvoiceEditPage />
                </Route>
                <Route path="/invoice">
                    <InvoicePage />
                </Route>

                <Route path="/">
                    <InvoicePage />
                </Route>
            </Switch>
        </Router>
    );
};

export default App;
