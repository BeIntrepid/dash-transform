import $ from 'jquery'

export class transform
{
    transform(a)
    {
        let pipe = $.Deferred();
        let prom = pipe.then(()=>{console.log('1');});
        prom = pipe.then(()=>{console.log('2');});
        pipe.resolve();

    }
}