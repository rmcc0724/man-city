import React, { Component } from 'react';
import Fade from 'react-reveal/Fade';
import FormField from '../../ui/formFields';
import { validate } from '../../ui/misc';
 
import { firebasePromotions } from '../../../firebase';

class Enroll extends Component {

    state = {
        formError:false,
        formSuccess:'',
        formdata:{
            email:{
                element:'input',
                value:'',
                config:{
                    name:'email_input',
                    type: 'email',
                    placeholder: 'Enter your email'
                },
                validation:{
                    required: true,
                    email: true
                },
                valid: false,
                validationMessage:''
            }
        }

    }

    /*This method runs as the user updates the input field in the form*/
    updateForm(element){

        /*Stores and updates newFormdata as the user types, the object is changed */
        const newFormdata = {...this.state.formdata}
        console.log(newFormdata);

        ///Get the id of the element which is {'email'} line 126 and store that data as an object, now were only dealing with the email props
        const newElement = { ...newFormdata[element.id]} 
        console.log(newElement);

        //Get the value of the input and store that into our copy of the email object
        newElement.value = element.event.target.value;
        console.log(newElement.value);

        //Run the input through the validation method and chek if there's an error
        let validData = validate(newElement)
        newElement.valid = validData[0];
        newElement.validationMessage = validData[1]
        
        //Update the var prop below to the updated newElement object as the user types
        newFormdata[element.id] = newElement;
        
       //Change the state of the 2 props below to the updated data
        this.setState({
            formError: false,
            formdata: newFormdata
        })
    }
    
    //This method resets the state and props of the form data
    resetFormSuccess(type){
        const newFormdata = {...this.state.formdata}

        for(let key in newFormdata){
            newFormdata[key].value = '';
            newFormdata[key].valid = false;
            newFormdata[key].validationMessage = '';
        }

        this.setState({
            formError:false,
            formdata: newFormdata,
            formSuccess: type ? 'Congratulations' : 'Already on the database'
        });
        this.successMessage();
    }

    //This displays success message once the form is submitted
    successMessage(){
        setTimeout(()=>{
            this.setState({
                formSuccess:''
            })
        },2000)
    }


    submitForm(event){
        event.preventDefault();
        
        let dataToSubmit = {};
        let formIsValid = true;

        for(let key in this.state.formdata){
            dataToSubmit[key] = this.state.formdata[key].value;
            formIsValid = this.state.formdata[key].valid && formIsValid;
        }

        if(formIsValid){
            firebasePromotions.orderByChild('email').equalTo(dataToSubmit.email).once("value")
            .then((snapshot)=>{
                if(snapshot.val() === null){
                    firebasePromotions.push(dataToSubmit);
                    this.resetFormSuccess(true);
                }else{
                    this.resetFormSuccess(false);
                }
            })
            //this.resetFormSuccess()
        } else {
            this.setState({
                formError: true
            })
        }
    }


    render() {
        return (
            <Fade>
                <div className="enroll_wrapper">
                
                {/*This code executes when the form is submitted */}
                    <form onSubmit={ (event)=> this.submitForm(event)}>
                        <div className="enroll_title">
                            Enter your email
                        </div>
                        <div className="enroll_input">
                            <FormField

                         /*ID of the form*/
                                id={'email'}

                         /*formdata variable gets the data in state.formdata.email*/
                                formdata={this.state.formdata.email}
                          
                         /*On change update the form with the current input*/
                                change={(element)=> this.updateForm(element)}
                            />
                         {/*If theres and error display the something wrong element, if not don't display anything*/}
                            { this.state.formError ? 
                                <div className="error_label">Something is wrong, try again.</div>
                                :null
                            }
                            <div className="success_label">{this.state.formSuccess}</div>
                            <button onClick={(event)=> this.submitForm(event)}>Enroll</button>
                            <div className="enroll_discl">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </div>
                        </div>
                    </form>
                </div>
            </Fade>
        );
    }
}

export default Enroll;
