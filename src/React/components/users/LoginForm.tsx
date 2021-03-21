import React from 'react';
import { Field, InjectedFormProps, reduxForm } from 'redux-form';
import { Button, Form, Grid, Icon } from 'semantic-ui-react';
import TextInput from '../form/TextInput';
import { User } from './types';

interface IProps {
    isLoading?: boolean
}

export const LOGIN_FORM = 'LOGIN_FORM';

class LoginFormComp extends React.PureComponent<InjectedFormProps<User> & IProps> {

    render() {
        const { handleSubmit, pristine, submitting, isLoading, error } = this.props;

        return (
            <Form onSubmit={handleSubmit} autoComplete='none'>
                <fieldset>
                    <legend>Sign In</legend>
                    <Grid>
                        <Grid.Column width={4} style={{textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <Icon name='key' style={{fontSize: 64, color: '#bbbbbb'}} />
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
                            {!!error && <label style={{ color: 'red', fontSize: 'small' }}>{error}</label>}
                            <div style={{ textAlign: 'right' }}>
                        <Button
                            color='blue'
                            className='action-button'
                            type='submit'
                            disabled={pristine || submitting}
                            loading={isLoading}
                        >
                            Sign In
                        </Button>
                    </div>
                        </Grid.Column>
                        <Grid.Column width={2}></Grid.Column>
                    </Grid>

                </fieldset>
            </Form>
        );
    }
}

export const LoginForm = reduxForm<User, IProps>({
    form: LOGIN_FORM,
})(LoginFormComp);
