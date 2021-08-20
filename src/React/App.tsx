import React from 'react';
import { BrowserRouter, Switch, Route, HashRouter } from 'react-router-dom';
import { InvoicePage } from './invoices/invoice-page';
import { InvoiceEditPage } from './invoices/invoice-edit';
import { connect } from 'react-redux';
import { LoaderSpinner } from './components/LoaderSpinner';
import { LoginPage } from './components/users/LoginPage';
import { RootState } from './types/root-state';
import { AuthRoute } from './AuthRoute';
import { ToastContainer } from 'react-toastify';
import ScrollToTop from './components/ScrollToTop';
import { CarPage } from './cars/car-page';
import { ReportPage } from './reports/report-page';
import { BackupPage } from './backup/backup-page';
import { QuotePage } from './quotes/quote-page';
import { QuoteEditPage } from './quotes/quote-edit';
import { ElectronRouter } from './ElectronRoute';
import { CompanyPage } from './company/company-page';

interface AppProps {
    isAppLoading: boolean;
}


const App: React.FC<AppProps> = (props) => {

    return (
        <HashRouter>
            <ScrollToTop />
            <ElectronRouter />
            <Switch>
                <Route path='/login' component={LoginPage} />

                <AuthRoute key={1} exact path='/invoice/edit/:id' component={InvoiceEditPage} />
                <AuthRoute key={2} exact path='/invoice/fromquote/:quoteId' component={InvoiceEditPage} />
                <AuthRoute key={3} exact path='/invoice/copy/:copyId' component={InvoiceEditPage} />
                <AuthRoute key={4} exact path='/invoice/new' component={InvoiceEditPage} />
                <AuthRoute key={5} exact path={'/invoice'} component={InvoicePage} />
                <AuthRoute key={6} path={'/invoices'} component={InvoicePage} />

                <AuthRoute key={7} exact path='/quote/edit/:id' component={QuoteEditPage} />
                <AuthRoute key={8} exact path='/quote/new' component={QuoteEditPage} />
                <AuthRoute key={9} exact path={'/quote'} component={QuotePage} />
                <AuthRoute key={10} exact path={'/quotes'} component={QuotePage} />

                <AuthRoute key={11} path={'/car'} component={CarPage} />
                <AuthRoute key={12} path={'/report'} component={ReportPage} />

                <AuthRoute key={13} path={'/backup'} component={BackupPage} />

                <AuthRoute key={13} path={'/company'} component={CompanyPage} />

                <AuthRoute key={14} path='/' component={InvoicePage} />
            </Switch>

            <ToastContainer
                position="bottom-center"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover={false}
                limit={1}
            />
            {!!props.isAppLoading && <LoaderSpinner />}
        </HashRouter>
    );
};

const mapStateToProps = (state: RootState): AppProps => ({
    isAppLoading: state.app.isAppLoading ?? false,
});


export default connect(mapStateToProps)(App);
