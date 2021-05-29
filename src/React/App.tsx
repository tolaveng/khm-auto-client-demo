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

                <AuthRoute exact path='/invoice/edit/:id' component={InvoiceEditPage} />
                <AuthRoute exact path='/invoice/fromquote/:quoteId' component={InvoiceEditPage} />
                <AuthRoute path='/invoice/new' component={InvoiceEditPage} />
                <AuthRoute path={'/invoice'} component={InvoicePage} />
                <AuthRoute path={'/invoices'} component={InvoicePage} />

                <AuthRoute exact path='/quote/edit/:id' component={QuoteEditPage} />
                <AuthRoute path='/quote/new' component={QuoteEditPage} />
                <AuthRoute exact path={'/quote'} component={QuotePage} />
                <AuthRoute exact path={'/quotes'} component={QuotePage} />

                <AuthRoute path={'/car'} component={CarPage} />
                <AuthRoute path={'/report'} component={ReportPage} />

                <AuthRoute path={'/backup'} component={BackupPage} />

                <AuthRoute path='/' component={InvoicePage} />
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
