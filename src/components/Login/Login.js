import React, { useState, useEffect, useReducer, useContext, useRef } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';
import Input from '../UI/Input/Input';

const emailReducer = (state, action) => {
     if (action.type === 'USER_INPUT') {
          return { value: action.val, isValid: action.val.includes('@') }
     }
     if (action.type === 'INPUT_BLUR') {
          return { value: state.value, isValid: state.value.includes('@') };
     }
     return { value: '', isValid: false };
}

const passwordReducer = (state, action) => {
     if (action.type === 'PASSWORD_INPUT') {
          return { value: action.val, isValid: action.val.trim().length > 6 };
     }
     if (action.type === 'INPUT_PASSWORD_BLUR') {
          return { value: state.value, isValid: state.value.trim().length > 6 };
     }
     return { value: '', isValid: false };
}

const Login = (props) => {
     const [enteredCollegeName, setEnteredCollegeName] = useState('');
     const [collegeNameIsValid, setCollegeNameIsValid] = useState();
     const [formIsValid, setFormIsValid] = useState(false);
     const [emailState, dispatchEmail] = useReducer(emailReducer, { value: '', isValid: false });
     const [passwordState, dispatchPassword] = useReducer(passwordReducer, { value: '', isValid: null });

     const authCtx = useContext(AuthContext);

     const emailInputRef = useRef();
     const passwordInputRef = useRef();
     const collegeNameInputRef = useRef();

     const emailChangeHandler = (event) => {
          dispatchEmail({ type: 'USER_INPUT', val: event.target.value });
          setFormIsValid(
               emailState.isValid && passwordState.isValid && enteredCollegeName.trim().length > 0
          );
     };

     const passwordChangeHandler = (event) => {
          dispatchPassword({ type: 'PASSWORD_INPUT', val: event.target.value });
          setFormIsValid(
               emailState.isValid && passwordState.isValid && enteredCollegeName.trim().length > 0
          );
     };

     const validateEmailHandler = () => {
          dispatchEmail({ type: 'INPUT_BLUR' })
     };

     const validatePasswordHandler = () => {
          dispatchPassword({ type: 'INPUT_PASSWORD_BLUR' });
     };

     const collegeNameChangeHandler = (event) => {
          setEnteredCollegeName(event.target.value);
          setFormIsValid(
               emailState.isValid && passwordState.isValid && enteredCollegeName.trim().length > 0
          );
     };

     const validateCollegeNameHandler = () => {
          setCollegeNameIsValid(enteredCollegeName.trim().length > 0);
     };

     const submitHandler = (event) => {
          event.preventDefault();
          if (formIsValid) {
               authCtx.onLogin(emailState.value, passwordState.value, enteredCollegeName);
          }
          else if (!emailState.isValid) {
               emailInputRef.current.focus();
          }
          else if(!passwordState.isValid){
               passwordInputRef.current.focus();
          }
          else{
               collegeNameInputRef.current.focus();
          }
     };

     return (
          <Card className={classes.login}>
               <form onSubmit={submitHandler}>
                    <Input
                         ref={emailInputRef}
                         id='email'
                         label='E-Mail'
                         type='email'
                         isValid={emailState.isValid}
                         value={emailState.value}
                         onChange={emailChangeHandler}
                         onBlur={validateEmailHandler}
                    />
                    <Input
                         ref={passwordInputRef}
                         id='password'
                         label='Password'
                         type='password'
                         isValid={passwordState.isValid}
                         value={passwordState.value}
                         onChange={passwordChangeHandler}
                         onBlur={validatePasswordHandler}
                    />
                    <Input
                         ref={collegeNameInputRef}
                         id='collegeName'
                         label='College Name'
                         type='text'
                         isValid={collegeNameIsValid}
                         value={enteredCollegeName}
                         onChange={collegeNameChangeHandler}
                         onBlur={validateCollegeNameHandler}
                    />

                    <div className={classes.actions}>
                         <Button type="submit" className={classes.btn} >
                              Login
                         </Button>
                    </div>
               </form>
          </Card>
     );
};

export default Login;
