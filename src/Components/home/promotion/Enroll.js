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

    /*This method runs as the user updates the email address in the enrollment form*/
    updateForm(element){

      /*Create a new object that copies the current state of the formdata*/
        const newFormdata = {...this.state.formdata}
        console.log(newFormdata);

      ///Get the id of the element which is {'email'} line 126 and store that data as an object, now were only dealing with the email props
        const newElement = { ...newFormdata[element.id]} 
        console.log(newElement);

      //Update the value (email) of the newElement object as the user types
        newElement.value = element.event.target.value;
        console.log(newElement.value);

      //Run the input through the validation method and check if there's an error
        let validData = validate(newElement)
        newElement.valid = validData[0];
        newElement.validationMessage = validData[1]
        
      //Update the property of newFormData[email] object as the user types
        newFormdata[element.id] = newElement;
        
     //set the state of the 2 props below to the updated newFormdata
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
     //Prevent the default behavior from happening when the submit button is pressed.
        event.preventDefault();
     
     //Create an empty object
     //Create a boolean variable
        let dataToSubmit = {};
        let formIsValid = true;
     
     //Go through all the keys in the form data
        for(let key in this.state.formdata){
         
         //Copy the current state of all the form data to the empty object
            dataToSubmit[key] = this.state.formdata[key].value;
         
         //Check to see if the data in the key of the current form state is valid
            formIsValid = this.state.formdata[key].valid && formIsValid;
        }

     //If the form is valid
        if(formIsValid){
         
         //Check to see if the email in the form is already in the database
            firebasePromotions.orderByChild('email').equalTo(dataToSubmit.email).once("value")
            .then((snapshot)=>{
                if(snapshot.val() === null){
                 
                 //If the email is not in the database add it to the database
                    firebasePromotions.push(dataToSubmit);
                 
                 //Reset form gets true passed as an arg, check the restFormSuccess function
                    this.resetFormSuccess(true);
                }else{
                 
                 //If it's already in the database
                 //Reset form gets false passed as an arg, check the restFormSuccess function
                    this.resetFormSuccess(false);
                }
            })
         //If the form is not valid set the state of fromError to true
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
