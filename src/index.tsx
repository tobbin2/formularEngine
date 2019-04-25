
import * as React from "react";
import * as ReactDOM from "react-dom";
import { IconButton, CompoundButton } from 'office-ui-fabric-react/lib/Button';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { initializeIcons } from '@uifabric/icons';
initializeIcons()

import thunk from 'redux-thunk'

import { FormBuilder } from "./components/FormBuilder";
import { createStore ,applyMiddleware} from 'redux';

import * as forms from "./actions/myActions.js"
import result from "./reducers/index"

const store = createStore(result, applyMiddleware(thunk))

const initiateForm = (formular:any):void => {
    
    ReactDOM.render(
        <FormBuilder formDef={formular} key="mainForm" compiler="TypeScript" framework="React"/>,
        document.getElementById("wrapper")
    );
}

const buttonElements:JSX.Element[] = []
const colors:string[][] = [
    ['#f79d00','#64f38c'],
    ['#cb2d3e','#ef473a'],
    ['#56ab2f','#a8e063'],
    ['#000428','#004e92'],
    ['#42275a','#734b6d'],
    ['#141E30','#243B55'],
    ['#2C3E50','#FD746C'],
    ['#0B486B','#F56217'],
    ['#1D4350','#A43931'],
    ['#304352','#d7d2cc'],
    ['#BA8B02','#181818']]

for(const form of forms.default){
    store.dispatch<any>(form())
    const formular = store.getState()
    let colorIndex:string[] = colors[Math.floor(Math.random() * colors.length)] 
    buttonElements.push(
            <CompoundButton
                onClick={() => initiateForm(formular.formPayload.payload.payload)}
                key={formular.formPayload.payload.type}
                style={{minHeight:100,minWidth:300,color:'white',fontWeight:500,backgroundImage:"linear-gradient(to right," + colorIndex[0] + "," + colorIndex[1] +")"}}
                iconProps={{iconName:'TextDocument'}}
                width={300}
                height={100}
                secondaryText={formular.formPayload.payload.description != undefined ? formular.formPayload.payload.description.substr(0,100):""}
            >
                {formular.formPayload.payload.name}
            </CompoundButton>
    )
}

ReactDOM.render(
    <Stack key={"formButtonsStack"} horizontal wrap gap={30} horizontalAlign={'center'} styles={{root:{marginTop:15,marginBottom:15}}}> 
        {buttonElements}
    </Stack>,
    document.getElementById("placeForFormButtons")
)



