import {TransformLibrary} from './TransformLibrary'
import {FunctionFilter} from './Filters'
import {TransformConfig} from './TransformConfig'

export class TransformNode
{
    ancestors = [];
    filter = null;
    name = 'unnamed TransformNode';

    constructor(name,filter)
    {
        this.name = name;
        this.filter = filter;
    }

    addInput(ancestor)
    {
        this.ancestors.push(ancestor);
    }

    execute(inputObject,args) {
        if(TransformConfig.enableDebugMessages) console.log('Executing ' + this.filter.name);

        return this.filter.execute.apply(this.filter,[inputObject].concat(args));
    }
}