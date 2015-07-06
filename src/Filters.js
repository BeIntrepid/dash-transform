import {InputSpec} from './InputSpec'
import {TransformConfig} from './TransformConfig'

export class Filter
{
    inputObject = null;

    inputSpec = [];

    getInputSpec()
    {
        return this.inputSpec;
    }

    constructor(name,inputSpec)
    {
        this.name = name;
        this.inputSpec = inputSpec;
    }

    execute(inputObject,args)
    {
        return Promise.resolve(true);
    }

    buildInputSpec() {
        if(TransformConfig.enableDebugMessages) console.log('Building InputSpec for ' + this.name);

        return new InputSpec(this.name,this.inputSpec,null);
    }


}

export class FunctionFilter extends Filter
{
    constructor(name,toExecute,inputSpec)
    {
        super(name,inputSpec);
        this.toExecute = toExecute;
    }

    execute(inputObject,args)
    {
        return Promise.resolve(this.toExecute.apply(null,arguments));
    }
}