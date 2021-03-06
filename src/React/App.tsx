import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { InvoicePage } from './invoices/invoice-page';
import { InvoiceEditPage } from './invoices/invoice-edit';


const App: React.FC = () => {
    
    return (
        <Router>
            <Switch>
                
                {/* Invoice */}
                <Route exact path="/invoice/edit/:id" component={InvoiceEditPage} />
                <Route path="/invoice/new" component={InvoiceEditPage} />
                <Route path={"/invoice"} component={InvoicePage} />
                
                <Route path="/" component={InvoicePage} />
            </Switch>
        </Router>
    );
};

export default App;
