import Enumerable from 'linq-es6'


export class InputResolver
{
    constructor(mappedInputs)
    {
        this.mappedInputs = mappedInputs;
    }

    getInputOverrides(node)
    {

        var matchingInput = null;

        //Terrible code. Todo : not write such bad performing code
        Object.getOwnPropertyNames(this.mappedInputs).forEach((miName)=>{
            var mi = this.mappedInputs[miName];
            if(mi.nodeRef == node) {
                matchingInput = mi;
            }
        });

        return matchingInput;
    }
}