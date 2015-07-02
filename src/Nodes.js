import {TransformLibrary} from './TransformLibrary'
import {FunctionFilter} from './Filters'
import {TransformConfig} from './TransformConfig'

export class TransformNode
{
    ancestors = [];
    pipe = null;
    name = 'unnamed TransformNode';

    constructor(name,filter)
    {
        this.name = name;
        this.pipe = filter;
    }

    addInput(ancestor)
    {
        this.ancestors.push(ancestor);
    }

    execute(inputObject,args) {
        //if(TransformConfig.enableDebugMessages) console.log('Executing node ' + this.pipe.name);

        return this.pipe.execute.apply(this.pipe,[inputObject].concat(args));
    }

    buildInputSpec(parentSpec)
    {
        if(TransformConfig.enableDebugMessages) console.log('Building InputSpec for Node of ' + this.pipe.name);
        return this.pipe.buildInputSpec(parentSpec);
    }
}