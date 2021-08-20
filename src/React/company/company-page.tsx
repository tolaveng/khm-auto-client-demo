import React, { ChangeEvent, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Container, Form, Grid, Icon, Pagination, PaginationProps, Segment, Table } from 'semantic-ui-react';
import { HeaderLine } from '../components/HeaderLine';
import { RootState } from 'src/React/types/root-state';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { Link } from 'react-router-dom';
import { Company } from '../types/company';
import { getCompany, updateCompany } from '../actions';
import { Field, Formik } from 'formik';
import TextInput from '../components/form/TextInput';
import TextAreaInput from '../components/form/TextAreaInput';
import { toast } from 'react-toastify';


interface IStateProps {
    company: Company,
    isLoading: boolean,
}

interface IDispatchProps {
    actions: {
        getCompany: () => void,
        updateCompany: (company: Company, callback: (success: boolean) => void) => void
    };
}

const CompanyPageComp: React.FC<IStateProps & IDispatchProps> = (props) => {
    const { isLoading, company, actions } = props;

    useEffect(() => {
        actions.getCompany();
    }, [])

    const handleSubmit = (values: Company, action: any) => {
        actions.updateCompany(values, function(success){
            if (success){
                toast.success("Saved successfully");
            }else{
                toast.error("Cannot save. Please try again.");
            }
            action.setSubmitting(false);
        });
    }

    const renderForm = () => {
        return (
            <Formik key={company.companyId} initialValues={company} onSubmit={handleSubmit}>
                {
                    formik => (
                        <Form autoComplete='off' onSubmit={formik.handleSubmit}>
                            <Form.Group widths='equal'>
                                <Field
                                    label='Name'
                                    name='name'
                                    component={TextInput}
                                    type='text'
                                    fluid={true}
                                    autoComplete='off'
                                />

                                <Field
                                    label='Abn'
                                    name='abn'
                                    component={TextInput}
                                    type='text'
                                    fluid={true}
                                    autoComplete='off'
                                />
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Field
                                    label='Address'
                                    name='address'
                                    component={TextAreaInput}
                                    rows={2}
                                    type='text'
                                    fluid={true}
                                    autoComplete='off'
                                />
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Field
                                    label='Phone'
                                    name='phone'
                                    component={TextInput}
                                    type='text'
                                    fluid={true}
                                    autoComplete='off'
                                />

                                <Field
                                    label='Email'
                                    name='email'
                                    component={TextInput}
                                    type='text'
                                    fluid={true}
                                    autoComplete='off'
                                />
                            </Form.Group>
                            
                            <Form.Group widths='equal'>
                                <Field
                                    label='Bank Name'
                                    name='bankName'
                                    component={TextInput}
                                    type='text'
                                    fluid={true}
                                    autoComplete='off'
                                />

                                <Field
                                    label='Bank BSB'
                                    name='bankBsb'
                                    component={TextInput}
                                    type='text'
                                    fluid={true}
                                    autoComplete='off'
                                />
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Field
                                    label='Bank Account Name'
                                    name='bankAccountName'
                                    component={TextInput}
                                    type='text'
                                    fluid={true}
                                    autoComplete='off'
                                />

                                <Field
                                    label='Bank Account Number'
                                    name='bankAccountNumber'
                                    component={TextInput}
                                    type='text'
                                    fluid={true}
                                    autoComplete='off'
                                />
                            </Form.Group>
                            <div style={{ textAlign: 'right', float: 'right' }}>
                            <Button primary color='blue' className='action-button' type='submit'
                                disabled={formik.isSubmitting || isLoading} loading={formik.isSubmitting} icon labelPosition='left'
                            >
                                <Icon name='save' />
                                <span>Save</span>
                            </Button>
                            <Button basic color='blue' className='action-button' type='button' as={Link} to='/invoice' icon labelPosition='left'>
                                <Icon name='cancel' />
                                <span>Close</span>
                            </Button>
                            </div>
                        </Form>
                    )
                }
            </Formik>
        )
    };

    return (
        <Container fluid>
            <HeaderLine label='Company' />
            <Grid>
                <Grid.Column width={2}></Grid.Column>
                <Grid.Column width={10}>
                    {company.companyId && renderForm()}
                </Grid.Column>
                <Grid.Column width={4}></Grid.Column>
            </Grid>
        </Container>
    )
}


const mapStateToProps = (state: RootState): IStateProps => {
    return {
        company: state.company,
        isLoading: state.app.isAppLoading ? state.app.isAppLoading : false
    };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): IDispatchProps => ({
    actions: {
        getCompany: bindActionCreators(getCompany, dispatch),
        updateCompany: bindActionCreators(updateCompany, dispatch)
    }
});

export const CompanyPage = connect(mapStateToProps, mapDispatchToProps)(CompanyPageComp);