import * as types from './types'
import * as forms from '../jsonScripts' 

function fetchForm1() {
    return function(dispatch){
        dispatch({
            type: types.form1,
            payload: forms.test1,
            name: "form1",
            description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Donec lacinia leo sapien, quis scelerisque diam aliquet at. Integer quis tellus odio.
             Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
             Aenean mauris tortor, feugiat id sodales sed, rhoncus non sem.
              Donec eros erat, varius vitae sem id, efficitur volutpat quam.
               Aliquam pellentesque massa id nisl hendrerit consectetur. 
               Cras sit amet fermentum ex, et vulputate ex. 
               Aliquam non leo et felis semper porta quis id libero. Mauris sit amet orci at orci sollicitudin imperdiet.
               Quisque eu leo commodo, maximus odio fringilla, tristique metus. In at est sed nisl aliquam venenatis a nec sem.
                Nunc venenatis ipsum a tortor ultrices tincidunt. Donec sit amet libero eget nisi fermentum convallis. 
                Quisque ut lacus posuere, tempor magna id, convallis risus. Aenean in facilisis justo, et eleifend nisi.
                 Sed eros ante, laoreet vehicula nibh eu, vestibulum semper metus. 
                 Interdum et malesuada fames ac ante ipsum primis in faucibus. 
                 Praesent tincidunt varius lectus, sit amet pharetra nibh rhoncus ornare.
                  Maecenas interdum tortor dolor, in pharetra ante ultricies et. 
                  Maecenas feugiat turpis a posuere hendrerit. 
                  Quisque laoreet nulla erat, sed ultricies mi eleifend ut. 
                  Aliquam erat volutpat. Nam in ligula id diam mattis iaculis. 
                  Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.`
        })
    }
}

function fetchForm2() {
    return function(dispatch){
        dispatch({
            type: types.form2,
            payload: forms.test2,
            name: "the second form",
            description: "this is the description, and its kinda useless. Although it works"
        })
    }
}

function fetchForm3() {
    return function(dispatch){
        dispatch({
            type:types.form3,
            payload:forms.test3,
            name: "form333"
        })
    }
}

function fetchForm4() {
    return function(dispatch){
        dispatch({
            type:types.form4,
            payload:forms.test4,
            name: "form4",
            description: "this is the description, and its kinda useless. Although it works"
        })
    }
}

function fetchForm5() {
    return function(dispatch){
        dispatch({
            type:types.form5,
            payload:forms.test5,
            name: "form5",
            description: "this is the description, and its kinda useless. Although it works"
        })
    }
}

export default [
    fetchForm1,
    fetchForm2,
    fetchForm3,
    fetchForm4,
    fetchForm5
]

