import * as React from "react";

import { DefaultButton, IconButton } from 'office-ui-fabric-react/lib/Button';
import { Callout } from 'office-ui-fabric-react/lib/Callout';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Text } from 'office-ui-fabric-react/lib/Text';
import { Dropdown, IDropdownOption ,} from 'office-ui-fabric-react/lib/Dropdown';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { ChoiceGroup,IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { IComboBoxOption, ComboBox, SelectableOptionMenuItemType,IComboBox } from 'office-ui-fabric-react/lib/ComboBox';
import { DatePicker } from 'office-ui-fabric-react/lib/DatePicker';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { initializeIcons } from '@uifabric/icons';
import { NormalPeoplePicker } from 'office-ui-fabric-react/lib/Pickers';
import { IPersonaProps } from 'office-ui-fabric-react/lib/Persona';
import { Rating, RatingSize } from 'office-ui-fabric-react/lib/Rating';
import { SpinButton } from 'office-ui-fabric-react/lib/SpinButton';
import { Slider } from 'office-ui-fabric-react/lib/Slider';

initializeIcons()

export interface props { formDef: any; compiler: string; framework: string;}

interface value{
    value:any,
    required:boolean,
    error:boolean,
    viewInfo:boolean
}

interface IState{
    values: {[id:string] : value;}
}

//for objects
interface formJson {
    id:string,
    type: string,
    title: string,
    description: string,
    required: boolean,
    information: string,
    icon: string,
    values: any[],
    multi: boolean,
    max: number
}

interface personaProps {

}

export class FormBuilder extends React.Component<props, IState> {
    
    public data:any = null;
    public components:any
    public timer:number = 0

    //initiate json script
    constructor(a:any,b:IState) {
        //clear everything
        super(a,b);
        this.data = {...this.props.formDef};
    
        this.state = { 
            values: {}
        } as IState

        for(const object of this.data.forms){
            if(object.type != "section"){
                if(!this.validateIfTaken(object.id)){
                    this.state.values[object.id] = {value:"",required:object.required,error:false,viewInfo:true}
                }
            }
        }

        this.refreshWeb()
        

        /*let newState = {...this.state}
        newState.values = this.props.formDef.forms.reduce((map:any,obj:formJson) => {
            console.log(obj)
            if(obj.type != "section")
                map[obj.id] = {value:"",required:obj.required,error:false,viewInfo:true}
            return
        })
        console.log(this.state)
        this.setState(newState)*/
        /*this.props.formDef.forms.reduce((object) => {
            newState.values[object.id] = {value:"",required:object.required,error:false,viewInfo:true}
        })*/
        /*let array = this.props.formDef.reduce((obj,item) => {
            obj[item.id] = item
            return obj
        }, {})
        console.log(array)*/
      

        //gör om rad 62-67 till en reduce
          
    }

    create = (object:any):JSX.Element => {
        if(object.type == "section")
            return this.createSection(object.title)

        return this.createInput(object)
     
    }

    /***********************************
     *                                 *
     *          create inputs          * 
     *                                 *
     ***********************************/

    //creates text input
    createInput = (object:formJson):JSX.Element => {

        let element = <div></div>
        switch(object.type){
            case "textField":
                element = this.createTextInput(object)
                break;
            case "dropDown":
                element = this.createDropDownInput(object)
                break;
            case "checkBox":
                element = this.createCheckBoxInputs(object)
                break;
            case "comboBox":
                element = this.createComboBoxInput(object)
                break;
            case "radioButtons":
                element = this.createRadioButtonInput(object)
                break;
            case "datePicker":
                element = this.createDatePickerInput(object)
                break;
            case "peoplePicker":
                element = this.createPeoplePickerInput(object)
                break;
            case "rating":
                element = this.createRatingInput(object)
                break;
            case "numberField":
                element = this.createNumberTextFieldInput(object)
                break;
            case "spinButton":
                element = this.createSpinnerInput(object)
                break;
            case "slider":
                element = this.createSliderInput(object)
                break;
            default:
                return (<div><p>error</p></div>)
        }
        
        //create form
        let finishedElement = (
            <Stack wrap={true} key={"stackForForm" + object.id} horizontal horizontalAlign={'center'} styles={{root:{marginLeft:50,marginRight:50,marginTop:20}}}>
                <Stack.Item styles={{root:{width:500}}}>
                    {element}
                </Stack.Item>
                <Stack.Item>
                    <IconButton
                        onClick={() => this.viewInfoHandler(object.id)}
                        iconProps={{ iconName: 'Info' }}
                        styles={{root:{marginTop:28}}}
                        id={"information"+ object.id}
                        key={"information"+ object.id}
                        hidden={object.information != undefined ? false:true}
                    />
                </Stack.Item>
                <Stack.Item>
                    <Callout
                        role="alertdialog"
                        target={"#information"+ object.id}
                        id={"informationCallout" + object.id}
                        key={"informationCallout" + object.id}
                        hidden={this.state.values[object.id].viewInfo}

                    >
                        <Stack verticalAlign="space-around" padding={20} maxWidth={300} wrap={true}>
                                <Text styles={{root:{fontWeight:700,color:'gray'}}} key={"titleOfCallout"+object.id}>{object.title}</Text>
                            {object.information}
                            <DefaultButton
                                key={"buttonOfCallout" + object.id}
                                text="close"
                                onClick={() => this.viewInfoHandler(object.id)}
                                styles={{root:{width:100,marginTop:20}}}
                            />
                        </Stack>
                    </Callout>
                </Stack.Item>
            </Stack>
        )

        return finishedElement
    }

    //creates text input
    createTextInput = (object:formJson):JSX.Element => {
        
        return( 
            <TextField
                label={object.title}
                required={object.required}
                description= {object.description}
                onChange={this.onChangeTextFieldHandler.bind(this)}
                onKeyDown={this.onTimeStart}
                multiline={object.multi}
                autoAdjustHeight={object.multi}
                iconProps={{iconName: object.icon}}
                id={object.id} 
                key={object.id}
                value={this.state.values[object.id].value}
                errorMessage = {this.state.values[object.id].error ? 'you need to fill this field!':undefined}
            /> 
        )
    }

    //creates dropdowninput
    createDropDownInput = (object:formJson):JSX.Element => {

        let keyCounter:number = -1;
        const options: IDropdownOption[] = object.values.map((optionObject) => {
            keyCounter++;
            return({id:optionObject+keyCounter,key:optionObject+keyCounter,text:optionObject})
        })
    
        //create form
        return (
            <Dropdown
                label={object.title} 
                required={object.required} 
                options={options}
                onChange={this.onChangeDropDownHandler.bind(this,object.multi)}
                onSelect={this.onTimeStart}
                multiSelect={object.multi}
                id={object.id}
                key={object.id}
                selectedKey={this.state.values[object.id].value.key}
                errorMessage = {this.state.values[object.id].error ? 'you need to fill this field!':undefined}
            />
        )
    }

    //creates checkBoxInput
    createCheckBoxInputs = (object:formJson):JSX.Element => {
        let keyCounter = -1
        let checkBoxElements:JSX.Element[] = object.values.map((checkBoxObject) => {
            keyCounter++
            return (
                <Checkbox 
                    label={checkBoxObject}
                    key={object.id + keyCounter.toString()}
                    onSelect={this.onTimeStart}
                    id={object.id + keyCounter.toString()}
                    onChange={this.onChangeCheckBoxHandler.bind(this,object.id,checkBoxObject)}
                />
            )
        })
        return(
            <div>
                <Label key={"label"+object.id} id={"label"+object.id}>
                    {object.title}
                </Label>
                {checkBoxElements}
            </div>
        )
    }

    //creates comboBox
    createComboBoxInput = (object:formJson):JSX.Element => {
        let keyCounter = -1
        const options:IComboBoxOption[] = object.values.map((optionObject) => {
            keyCounter++
            let inputType:any = null
            switch(optionObject.itemType){
                case "header":
                    inputType = SelectableOptionMenuItemType.Header
                    break;
                case "divider":
                    inputType = SelectableOptionMenuItemType.Divider
                    break;
                default:
                    inputType = undefined
                    break;
            }
            return({key:optionObject.text + keyCounter,text:optionObject.text,itemType:inputType})
        })

        return (
            <ComboBox
                label={object.title}
                autoComplete="on"
                options={options}
                onSelect={this.onTimeStart}
                selectedKey={this.state.values[object.id].value.key}
                onItemClick={this.onChangeComboBoxHandler.bind(this,object.id)}
                required={object.required}
                id={object.id}
                key={object.id}
                errorMessage = {this.state.values[object.id].error ? 'you need to fill this field!':undefined}
            />

        )
    }

    //creates radio picker
    createRadioButtonInput = (object:formJson):JSX.Element => {

        let keyCounter = 0;
        const options = object.values.map((object:any) =>  {
            let option = {key:object + keyCounter,text:object}
            keyCounter++;
            return option
        }) 

        return(
            <div>
                <Label required={object.required} id={"label"+object.id} key={"label"+object.id}>
                    {object.title}
                </Label>
                <ChoiceGroup
                    id={object.id}
                    key={object.id}
                    selectedKey={this.state.values[object.id].value.key}
                    onSelect={this.onTimeStart}
                    onChange={this.onChangeRadioHandler.bind(this,object.id)}
                    required={object.required && this.state.values[object.id].error}
                    options={options} 
                />
            </div>
        )
    }

    //creates date picker
    createDatePickerInput = (object:formJson):JSX.Element => {

        return (
            <DatePicker 
                label={object.title}
                id={object.id}
                value={this.state.values[object.id].value}
                ariaLabel="Select a date" 
                isRequired={object.required && this.state.values[object.id].error}
                onSelectDate={this.onChangeDateHandler.bind(this,object.id)}      
                onSelect={this.onTimeStart}

            />
        )
    }

    //creates number input
    createNumberTextFieldInput = (object:formJson):JSX.Element => {        
        return(   
            <TextField
                label={object.title}
                id={object.id}
                key={object.id}
                required={object.required} 
                errorMessage = {this.state.values[object.id].error ? 'you need to fill this field!':undefined}
                iconProps={{iconName: object.icon}}
                max={object.max}
                value={this.state.values[object.id].value}
                onKeyDown={this.onTimeStart}
                onChange={this.onChangeNumberField.bind(this)}
            />
        )
    }

    //creates spinner input
    createSpinnerInput = (object:formJson):JSX.Element => {
        if(!object.max)
            object.max = 100
        
        return (
            <div>
                <Label key={"label" + object.id} required={object.required}>
                    {object.title}
                </Label>
                <SpinButton
                    key={object.id}
                    iconProps={{ iconName: object.icon }}
                    min={0}
                    max={object.max}
                    step={object.max/10}
                    value={this.state.values[object.id].value}
                    onIncrement={this.onChangeSpinnerHandler.bind(this,object.id,true,10)}
                    onDecrement={this.onChangeSpinnerHandler.bind(this,object.id,false,10)}
                    onValidate={(value) => {
                        let newState = {...this.state}
                        newState.values[object.id].value = value
                        this.setState(newState)
                    }}
                />
            </div>
        )
    }

    //creates slider input
    createSliderInput = (object:formJson):JSX.Element => {

        if(!object.max)
            object.max = 100

        return (
            <div>
                <Label key={"label" +object.id} id={"label"+object.id}>
                    {object.title}
                </Label>
                <Slider
                    min={1}
                    max={object.max}
                    step={1}
                    value={this.state.values[object.id].value || object.max/2}
                    showValue={true}
                    onChange={this.onChangeSliderHandler.bind(this,object.id)}
                    onChanged={this.onTimeStart}
                    key={object.id}
                />
            </div>
        )
    }
    
    //creates people picker
    createPeoplePickerInput = (object:formJson):JSX.Element => {
        let keyCounter = -1;
        let arrayOfPersona:IPersonaProps[] = object.values.map((personaObject:any) => {
            keyCounter++;
            let personaImageInitials = personaObject.name.split(" ")
            let finishedPersonaImageInitials:string = ""
            
            for(const nameOfCurrent of personaImageInitials){
                finishedPersonaImageInitials += nameOfCurrent[0].toUpperCase()
            }
            
            return ({
                key: "personaPerson"+keyCounter,
                imageInitials: finishedPersonaImageInitials,
                text: personaObject.name,
                secondaryText: personaObject.email
            })
        })
        
        return (
            <div>
                <Label key={"label"+object.id}>
                    {object.title}
                </Label>
                <NormalPeoplePicker
                    onResolveSuggestions={this.onFilterChangedText.bind(this,arrayOfPersona)}
                    onEmptyInputFocus={() => {return arrayOfPersona}}
                    key={"normalPeoplePicker"+object.id}
                    itemLimit={1}
                    onChange={this.onChangePeoplePickerHandler.bind(this,object.id)}
                    onFocus={this.onTimeStart}
                    selectedItems={this.state.values[object.id].value}
                />
            </div>
        )
    }

    //connected to people picker, filter from text
    private onFilterChangedText = (peopleList:IPersonaProps[],filterText: string,selectedItems:IPersonaProps[]): IPersonaProps[] | Promise<IPersonaProps[]> => {
        if(filterText){
            let filteredPersonas: IPersonaProps[] = this._filterPersonasByText(peopleList,filterText)
            console.log(selectedItems)
            return filteredPersonas;
        }else   
            return []
    }

    private onFilterChanged = (peopleList:IPersonaProps[],selectedItems:IPersonaProps[]) =>{

    }

    //connected to people picker
    private _filterPersonasByText(peopleList:IPersonaProps[],filterText: string): IPersonaProps[] {
        return peopleList.filter(item => this._doesTextStartWith(item.text as string, filterText));
    } 

    //connected to people picker
    private _doesTextStartWith(text: string, filterText: string): boolean {
        return text.toLowerCase().indexOf(filterText.toLowerCase()) === 0;
    }

    //creates rating input
    createRatingInput = (object:formJson):JSX.Element => {
        this.state.values[object.id].value = 1
        return (
            <div key={"div"+ object.id}>
                <Label key={"label"+object.id}>
                    {object.title}
                </Label>
                <Rating 
                    min={1}
                    max={object.max}
                    size={ RatingSize.Large }
                    onChange={this.onRatingChangeHandler.bind(this,object.id)}
                    id={object.id}
                    rating={this.state.values[object.id].value}
                    onSelect={this.onTimeStart}
                    key={object.id}
                    required={object.required && this.state.values[object.id].error}
                />
            </div>
        )
    }

    //creates section
    createSection = (title:string):JSX.Element => {
        let element = (
            <Stack styles={{root:{marginBottom:15,marginTop:40}}} key={"stackForFormSection" + title} horizontalAlign={'center'}>
                <Text variant="large" styles={{root:{fontWeight:700}}} key={"titleForSection" + title}  >
                    {title}
                </Text>
            </Stack>
        )
        
        return element
    }
    
    /***********************************
     *                                 *
     *          input handlers         * 
     *                                 *
     ***********************************/
    //handles slow performance of textinput, react refresh every change on textfield. This with handleTimer() wait 1 sec after user has typed to refresh
    onTimeStart = ():void => {
        if(this.timer){
            clearTimeout(this.timer)
            this.timer = setTimeout(null,1000)
        }else{
            this.timer = setTimeout(null,1000)
        }
    }

    //swap hidden, visible of callout
    viewInfoHandler = (id:string):void => {
        let newState = {...this.state}
        newState.values[id].viewInfo = !this.state.values[id].viewInfo
        this.setState(newState)
        this.refreshWeb()
    }

    //checks if title is already taken
    validateIfTaken = (idToBeCreated: string):boolean => {
        let newState = {...this.state}
        if(newState.values[idToBeCreated] != null)
            return true
        else
            return false
    }

    onChangeTextFieldHandler = (event: React.ChangeEvent<HTMLSelectElement>):void => {
        let newState = {...this.state}
        newState.values[event.target.id].value = event.target.value
        this.setState(newState)     
    }

    onChangeDropDownHandler = (multi:boolean,event: React.ChangeEvent<HTMLDivElement>,item:IDropdownOption):void => {
        let newState = {...this.state}

        if(multi){
            if(!Array.isArray(newState.values[event.target.id].value))
                newState.values[event.target.id].value = []

            //check if value was selected or deselected
            if(item.selected){
                newState.values[event.target.id].value.push(item.text)
            }else{
                let index = 0
                for(const value of newState.values[event.target.id].value){
                    if(value == item.text){
                        newState.values[event.target.id].value.splice(index,1)
                    }
                    index++
                }
            }

        }else{
            newState.values[event.target.id].value = item.text
        }

        this.setState(newState)
    }

    onChangeCheckBoxHandler = (id:string,label:string,event:any,checked:boolean) => {
        let newState = {...this.state}

        if(!Array.isArray(newState.values[id].value))
            newState.values[id].value = []

        if(!checked){
            let index = 0;
            for(const value of newState.values[id].value){
                if(value == label){
                    newState.values[id].value.splice(index,1)
                }
                index++
            }
        }else{
            newState.values[id].value.push(label)
        }
        this.setState(newState)
        
    }

    onChangeComboBoxHandler = (id:string,event: React.FormEvent<IComboBox>,option?:IComboBoxOption):void => {
        let newState = {...this.state}
        newState.values[id].value = {key: option.key,text:option.text}
        this.setState(newState)
    }

    onChangeRadioHandler = (id:string,event: any,option:IChoiceGroupOption):void =>{
        let newState = {...this.state}
        newState.values[id].value = {text:option.text,key:option.key}
        this.setState(newState)
    }
    
    onChangeDateHandler = (id:string,date:Date):void => {
        let newState = {...this.state}
        newState.values[id].value = date
        this.setState(newState)
  
        /*let datePicked = date.toString().split(" ")
        let month = null
        switch(datePicked[1]){
            case "Jan":
                month = "01";
                break;
            case "Feb":
                month = "02";
                break;
            case "Mar":
                month = "03";
                break;
            case "Apr":
                month = "04";
                break;
            case "May":
                month = "05";
                break;
            case "Jun":
                month = "06";
                break;
            case "Jul":
                month = "07";
                break;
            case "Aug":
                month = "08";
                break;
            case "Sep":
                month = "09";
                break;
            case "Oct":
                month = "10";
                break;
            case "Nov":
                month = "11";
                break;
            case "Dec":
                month = "12";
                break;
        }
        let dateConverted = datePicked[2] + "/" + month + "/" + datePicked[3]
        */
    }

    onRatingChangeHandler = (id:string,event:React.ChangeEvent<HTMLDivElement>, rating:number):void => {
        let newState = {...this.state}
        newState.values[id].value = rating
        this.setState(newState)
    }

    onChangeNumberField = (event: React.ChangeEvent<HTMLSelectElement>):void => {

        let newState = {...this.state}
        if(!isNaN(Number(event.target.value))){
            newState.values[event.target.id].value = event.target.value
        }
        this.setState(newState)

    }
    
    onChangeSpinnerHandler = (id:string,incremented:boolean,valueToBeIncremented:number,value:string):void => {
        let newState = {...this.state}

        if(!isNaN(Number(newState.values[id].value)))
            newState.values[id].value = 0

        let newValue = Number(value)

        if(incremented){
            if(Number(value) + valueToBeIncremented <= valueToBeIncremented*10){
                newValue += valueToBeIncremented
            }
        }else{
            if(Number(value) - valueToBeIncremented >= 0){
                newValue -= valueToBeIncremented
            }
        }

        newState.values[id].value = newValue
        this.setState(newState)

        this.refreshWeb()
    }

    onChangeSliderHandler = (id:string,value:number):void => {
        let newState = {...this.state}
        newState.values[id].value = value
        this.setState(newState)
    }

    onChangePeoplePickerHandler = (id:string,selectedItem:IPersonaProps[]):void => {
        let newState = {...this.state}
        newState.values[id].value = selectedItem
        this.setState(newState)
    }

    cancelButtonClicked = ():void => {
        
    }

    saveButtonClicked = ():void => {
        if(!this.validateIfRequiredFieldAreFilled()){
            this.refreshWeb()
            return
        }
        this.ingoreKeyInputs()
         
        console.log("validated!!!!")
        console.log(this.state.values)
    }

    //validates if fields are filled
    validateIfRequiredFieldAreFilled = ():boolean => {
        let validatedOrNot = true
        let newState = {...this.state}
        for(const key in newState.values){
            const object = newState.values[key]
            if(object.required){
                if(object.value == ""){
                    console.log(object)
                    validatedOrNot = false
                    object.error = true
                }else
                    object.error = false
            }

        }
        this.setState(newState)
        return validatedOrNot
    }
    
    //ignores keys from dropdown, combobox etc (that needs keys to store selected index)
    ingoreKeyInputs = ():void => {
        let newState = {...this.state}
        for(const key in newState.values){
            const object = newState.values[key]
            if(object.value.text)
                object.value = object.value.text
        }
    }

    refreshWeb = ():void => {
        console.log("refreshing")
        this.components = this.data.forms.map((object:any) =>  {
            return this.create(object)
        })        
        
    }
    
    render() {
        var t0 = performance.now();

        if(this.timer > 0)
            this.timer = setTimeout(this.refreshWeb,1000)

        let result = (
            <div>  
                {this.components}
                <Stack horizontal horizontalAlign={'center'} gap={20} styles={{root:{marginTop:30,marginBottom:30}}}>
                    <DefaultButton 
                        text="cancel"
                        key="cancelButton"
                        onClick={this.cancelButtonClicked}
                        styles={{root:{color:"white",backgroundColor:"#ff1a47"}}}

                    />
                    <DefaultButton 
                        text="save"
                        key="saveButton"
                        onClick={this.saveButtonClicked}
                        styles={{root:{color:"white",backgroundColor:"#00d1b2"}}}
                    />
                </Stack>
            </div>
        );
        var t1 = performance.now();
        console.log("Render took " + (t1 - t0) + " milliseconds.")

        return result;
    }
}