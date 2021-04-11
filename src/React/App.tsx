import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { InvoicePage } from './invoices/invoice-page';
import { InvoiceEditPage } from './invoices/invoice-edit';
import { connect } from 'react-redux';
import { LoaderSpinner } from './components/LoaderSpinner';
import { LoginPage } from './components/users/LoginPage';
import { RootState } from './types/root-state';
import { AuthRoute } from './AuthRoute';
import { ToastContainer } from 'react-toastify';
import ScrollToTop from './components/ScrollToTop';
import { CarPage } from './components/cars/car-page';


interface AppProps {
    isAppLoading: boolean;
}


const App: React.FC<AppProps> = (props) => {

    return (
        <BrowserRouter>
            <ScrollToTop />
            <Switch>
                <Route path='/login' component={LoginPage} />

                <AuthRoute exact path='/invoice/edit/:id' component={InvoiceEditPage} />
                <AuthRoute path='/invoice/new' component={InvoiceEditPage} />
                <AuthRoute path={'/invoice'} component={InvoicePage} />

                <AuthRoute path={'/car'} component={CarPage} />

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
        </BrowserRouter>
    );
};

const mapStateToProps = (state: RootState): AppProps => ({
    isAppLoading: state.app.isAppLoading ?? false,
});


export default connect(mapStateToProps)(App);
