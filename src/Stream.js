import * as filters from './Filters'

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
        this.pipe = pipe;
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
            this.pipe.execute(args == null ? this.input : args).then(this.onPipeExecuted.bind(this)).then((i)=>{
                this.busy = false;
                res(i);
            });
        });

        return streamPromise;
    }
}