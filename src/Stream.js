import * as filters from './Filters'
import {Pipe} from './Pipes'
import {TransformNode} from './Nodes'

export class Stream
{
    busy = false;
    pipe = null;
    input = {};
    output = {};
    status = 'stopped';
    subscriptions = [];
    bindedInputChanged = this.inputChanged.bind(this);
    subscriptionTimeout = null;

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
        this.setInput(this.input);
    }

    setInput(newInput)
    {
        this.setObservable(newInput,this.input);
        this.input = newInput;
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

    execute(args)
    {
        this.busy = true;
        var streamPromise = new Promise((res,rej)=>{
            var executePromise = this.pipe.execute(args == null ? this.input : args);
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
    }
}