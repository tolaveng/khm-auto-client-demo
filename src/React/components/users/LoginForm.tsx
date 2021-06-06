import { Field, Formik, FormikProps } from 'formik';
import React from 'react';
import { Button, Form, Grid, Icon, Input } from 'semantic-ui-react';
import TextInput from '../form/TextInput';
import { User } from './types';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

interface IProps {
    isLoading?: boolean,
    onSubmit: (username: string, password: string) => Promise<void>;
}

interface IFormProps {
    username: string,
    password: string
}

export const LOGIN_FORM = 'LOGIN_FORM';

class LoginForm extends React.PureComponent<IProps> {

    initValues = {
        username: "",
        password: ""
    };

    validationSchema = Yup.object({
        username: Yup.string().required('User is required'),
        password: Yup.string().required('Password is required')
    })

    handleFormSubmit = async (formValues: IFormProps, onSubmitProp: any) : Promise<void> => {
        const {onSubmit} = this.props;
        onSubmit(formValues.username, formValues.password).catch((e) => {
            toast.error(e);
            onSubmitProp.setSubmitting(false)
        });
    };

    render() {
        const { isLoading } = this.props;

        return (
            <Formik initialValues={this.initValues} onSubmit={this.handleFormSubmit} validationSchema={this.validationSchema}>
                {(formik: FormikProps<IFormProps>) => {
                    return (
                        <Form onSubmit={formik.handleSubmit} autoComplete="off">
                            <fieldset>
                                <legend>Sign In</legend>
                                <Grid>
                                    <Grid.Column width={4} style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon name='key' style={{ fontSize: 64, color: '#bbbbbb' }} />
                                    </Grid.Column>
                                    <Grid.Column width={10}>
                                        <Field
                                            label='Username'
                                            name='username'
                                            component={TextInput}
                                            type='text'
                                            fluid={true}
                                            autoComplete='off'
                                        />
                                        <Field
                                            label='Password'
                                            name='password'
                                            component={TextInput}
                                            type='password'
                                            fluid={true}
                                            autoComplete='off'
                                        />
                                        {/* {!!formik.errors && <label style={{ color: 'red', fontSize: 'small' }}>{formik.errors}</label>} */}
                                        <div style={{ textAlign: 'right' }}>
                                            <Button
                                                color='blue'
                                                className='action-button'
                                                type='submit'
                                                disabled={!(formik.dirty && formik.isValid) || formik.isSubmitting}
                                                loading={isLoading}
                                            >
                                                <span>Sign In</span>
                                            </Button>
                                        </div>
                                    </Grid.Column>
                                    <Grid.Column width={2}></Grid.Column>
                                </Grid>

                            </fieldset>
                        </Form>
                    )
                }}
            </Formik>
        );
    }
}

export default LoginForm;
