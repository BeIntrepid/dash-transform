import * as filters from './Filters'
import {Pipe} from './Pipes'
import {TransformNode} from './Nodes'
import {InputResolver} from './InputResolver'

export class StreamModel
{
    mappings = {};
    bindedInputChanged = this.inputChanged.bind(this);


    constructor(mappedInputs)
    {
        this.mappedInputs = mappedInputs;
        this.setObservable(this);
    }

    addMapping(niceName,inputToMap)
    {
        this.mappings[niceName] = inputToMap;
        this[niceName] = inputToMap.value;
    }

    setObservable(obs)
    {
        Object.observe(obs,this.bindedInputChanged);
    }

    inputChanged(changes)
    {
        changes.forEach((change)=>{
            if(change.type == 'update') {
                this.mappings[change.name].value = this[change.name];
            }
        });

        if(this.status != 'started')
        {
            return;
        }
    }
}

export class Stream
{
    busy = false;
    pipe = null;
    mappedInputs = null;

    triggers = {};

    output = {};
    status = 'stopped';
    subscriptions = [];
    bindedInputChanged = this.inputChanged.bind(this);
    subscriptionTimeout = null;
    hasBeenBuilt = false;

    constructor(pipe)
    {
        // Make sure we're referencing the pipe directly
        let wrappedPipe = pipe;
        if(pipe instanceof TransformNode)
        {
            wrappedPipe = new Pipe('StreamGeneratedPipe',pipe)
        }
        else if(pipe instanceof filters.Filter)
        {
            wrappedPipe = new Pipe('StreamGeneratedPipe',new TransformNode('StreamGeneratedTransformNode',pipe))
        }

        this.pipe = wrappedPipe;
        this.setTriggers(this.triggers);
    }

    setTriggers(newInput)
    {
        this.setObservable(newInput,this.triggers);
        this.triggers = newInput;
    }

    setObservable(obs,oldObs)
    {
        if(oldObs != null)
        {
            Object.unobserve(oldObs,this.bindedInputChanged)
        }

        Object.observe(obs,this.bindedInputChanged);
    }

    inputChanged(changes)
    {
        if(this.status != 'started')
        {
            return;
        }

        this.execute();
    }

    start(startArgs)
    {
        this.status = 'started';

        if(startArgs != null) {
            if (startArgs.input != null) {
                this.setInput(startArgs.input);
            }

            if (startArgs.interval != null) {

                this.execute.bind(this)();

                this.subscriptionTimeout = setInterval(this.execute.bind(this), startArgs.interval);
            }
        }
    }

    stop()
    {
        this.status = 'stopped';
        if(this.subscriptionTimeout != null)
        {
            clearInterval(this.subscriptionTimeout);
        }
    }


    onPipeExecuted(i)
    {
        this.output = i;
        this.subscriptions.forEach((f)=>{
            f.call(null,i);
        });
    }

    subscribe(subscription)
    {
        this.subscriptions.push(subscription);
    }

    build()
    {
        this.cloneTree();
        this.makeNodeNamesUnique();
        var inputs = this.getMapInputs();
        this.streamModel = new StreamModel(inputs);

        this.hasBeenBuilt = true;
    }

    getMapInputs()
    {
        if(this.mappedInputs == null) {
            var spec = {};
            this.pipe.rootNode.mapInputs('', spec);
            this.mappedInputs = spec;
        }
        return this.mappedInputs;
    }

    cloneTree()
    {
        this.pipe.rootNode = this.pipe.rootNode.cloneTree();
    }

    makeNodeNamesUnique()
    {
        this.pipe.rootNode.makeNodeNamesUnique();
    }

    execute(args)
    {
        if(!this.hasBeenBuilt)
        {
            throw "Stream hasn't been built before executing";
        }

        this.busy = true;
        var streamPromise = new Promise((res,rej)=>{

            var inputObject = args == null ? {} : args;

            inputObject.__inputResolver = new InputResolver(this.mappedInputs);

            var executePromise = this.pipe.execute(inputObject);

            executePromise.then(this.onPipeExecuted.bind(this));
            executePromise.then((i)=>{
                this.busy = false;
                res(i);
            });
        });

        return streamPromise;
    }

    buildInputSpec()
    {
        var spec = {};
        this.pipe.rootNode.mapInputs('',spec );
        console.log(JSON.parse(JSON.stringify(spec)));
        return spec;
    }
}