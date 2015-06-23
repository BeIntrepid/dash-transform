import * as transform from '../src/index';

class TestConfig
{
    static dontExecute = true;
}

describe('a first test suite', () => {

    describe('Simple Pipe', () => {
        it("should run and pass", () => {

            if(TestConfig.dontExecute) return;

            var filterLib = new transform.TransformLibrary();
            new Util.registerFilters(filterLib);
            var pr = filterLib.getFilterWrapped('GetDataArray');
            var pipeline = new transform.Pipe('Print Result',pr);

            pipeline .execute({first: 'asdf', second : 2}).then((o)=>{
                console.log(Util.equals([1,2,3,4],o));
            });

        });
    });

    describe('Simple Pipe', () => {
        it("should run and pass", () => {

            if(TestConfig.dontExecute) return;

            var filterLib = new transform.TransformLibrary();
            var pr = filterLib.getFilterWrapped('GetDataArray');
            var pipeline = new transform.Pipe('Simple Pipe',pr);

            pipeline .execute('Input').then((o)=>{
                console.log(Util.equals([1,2,3,4],o));
            });
        });
    });

    describe('Test pipe.add', () => {
        it("should run and pass", () => {
            if(TestConfig.dontExecute) return;

            var pipeline = new transform.Pipe('Simple Pipe');

            pipeline.add(()=>{return 5;})
                    .add((pipeInput,i)=>{return i + 1;})
                    .add('IncrementInput');

            pipeline.execute('Input').then((o)=>{
                console.log(o);
            });

        });
    });


    describe('chained filters', () => {
        it("should run and pass", () => {
            if(TestConfig.dontExecute) return;

            var filterLib = new transform.TransformLibrary();

            var pr = filterLib.getFilterWrapped('MultiplyArray');
            pr.addInput(filterLib.getFilterWrapped('GetDataArray'));
            var pipeline = new transform.Pipe('Simple Pipe',pr);

            pipeline .execute('Input').then((o)=>{
                console.log(Util.equals([100,200,300,400],o));
            });
        });
    });

    describe('chained filters', () => {
        it("should run and pass", () => {
            if(TestConfig.dontExecute) return;

            var filterLib = new transform.TransformLibrary();

            var pr = filterLib.getFilterWrapped('GetDataArray');
            var pipeline = new transform.Pipe('Simple Pipe',pr);

            var pREs = filterLib.getFilterWrapped('Print Result');
            pREs.addInput(pipeline);

            var pipeWithPipeInput = new transform.Pipe('DependentPipe',pREs);


            pipeWithPipeInput.execute('Input').then((o)=>{
                console.log(Util.equals([1,2,3,4],o));
            });
        });
    });

    describe('pipe inside pipe', () => {
        it("should run and pass", () => {
            if(TestConfig.dontExecute) return;

            var filterLib = new transform.TransformLibrary();

            var pr = filterLib.getFilterWrapped('GetDataArray');
            var pipeline = new transform.Pipe('Simple Pipe',pr);

            var pipeWithPipeInput = new transform.Pipe('DependentPipe',pipeline);


            pipeWithPipeInput.execute('Input').then((o)=>{
                console.log(Util.equals([1,2,3,4],o));
            });
        });
    });

    describe('Input pipe', () => {
        it("should run and pass", () => {
            if(TestConfig.dontExecute) return;

            var filterLib = new transform.TransformLibrary();

            var pr = filterLib.getFilterWrapped('IncrementInput');
            var dep = filterLib.getFilterWrapped('IncrementInput');
            pr.addInput(dep);
            dep = pr;
            pr = filterLib.getFilterWrapped('IncrementInput');
            pr.addInput(dep);
            dep = pr;

            var pipeline = new transform.Pipe('Simple Pipe',dep);

            var pipeWithPipeInput = new transform.Pipe('DependentPipe',pipeline);

            pipeWithPipeInput.execute('Input',1).then((o)=>{
                console.log(o);
            });
        });
    });

    describe('2 filter input dependencies', () => {
        it("should run and pass", () => {
            if(TestConfig.dontExecute) return;

            var filterLib = new transform.TransformLibrary();

            var pr = filterLib.getFilterWrapped('MultiplyArrayByValue');
            pr.addInput(filterLib.getFilterWrapped('GetDataArray'));
            pr.addInput(filterLib.getFilterWrapped('GetFive'));
            var pipeline = new transform.Pipe('Simple Pipe',pr);

            pipeline .execute('Input').then((o)=>{
                console.log(Util.equals([5,10,15,20],o));
            });
        });
    });

    describe('2 pipe input dependencies', () => {
        it("should run and pass", () => {
            if(TestConfig.dontExecute) return;

            var filterLib = new transform.TransformLibrary();

            var pr = filterLib.getFilterWrapped('MultiplyArrayByValue');
            var pipeline = new transform.Pipe('Simple Pipe',pr);

            var pInput1 = filterLib.getFilterWrapped('GetDataArray');
            var pipelineInput1 = new transform.Pipe('Simple Pipe',pInput1);

            var pInput2 = filterLib.getFilterWrapped('GetFive');
            var pipelineInput2 = new transform.Pipe('Simple Pipe',pInput2);

            pr.addInput(pipelineInput1);
            pr.addInput(pipelineInput2);

            pipeline .execute('Input').then((o)=>{
                console.log(o + '| ' + Util.equals([5,10,15,20],o));
            });
        });
    });

    describe('Building Stream', () => {
        it("should run and pass", () => {
            //if(TestConfig.dontExecute) return;

            var pipeline = new transform.Pipe('Simple Pipe');

            pipeline.add((pipeInput)=>{return pipeInput.in;})
                    .add((pipeInput,i)=>{
                    return i + 1;
                });

            var stream = new transform.Stream(pipeline);

            stream.subscribe((o)=>{
                console.log(o);
            });

            stream.start({interval : 1000});
        });
    });
});

class Util
{
    static equals (arr1,array) {
        // if the other array is a falsy value, return
        if (!array)
            return false;

        // compare lengths - can save a lot of time
        if (arr1.length != array.length)
            return false;

        for (var i = 0, l=this.length; i < l; i++) {
            // Check if we have nested arrays
            if (arr1[i] instanceof Array && array[i] instanceof Array) {
                // recurse into the nested arrays
                if (!arr1[i].equals(array[i]))
                    return false;
            }
            else if (arr1[i] != array[i]) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }
        return true;
    }

    static registerFilters(filterLib)
    {
        filterLib.registerFilter(new transform.FunctionFilter('GetDataArray',(input,i)=>{
            return [1,2,3,4];
        }));

        filterLib.registerFilter(new transform.FunctionFilter('IncrementInput',(input,i)=>{
            return i + 1;
        }));

        filterLib.registerFilter(new transform.FunctionFilter('GetFive',(input,i)=>{
            return 5;
        }));

        filterLib.registerFilter(new transform.FunctionFilter('MultiplyArrayByValue',function(inputObject,array,value){

            for(var i = 0; i < array.length; i++)
            {
                array[i] = array[i] * value;
            }
            return array;
        }));

        filterLib.registerFilter(new transform.FunctionFilter('MultiplyArray',function(inputObject,array){

            for(var i = 0; i < array.length; i++)
            {
                array[i] = array[i] * 100;
            }
            return array;
        }));

        filterLib.registerFilter(new transform.FunctionFilter('Print Result',function(){

            var output = "";
            for(var a in arguments)
            {
                output += arguments[a] + ' : ';
            }
            console.log(output);
            if(arguments.length <= 2)
            {
                return arguments[1];
            }

            return Array.prototype.slice.call(arguments,1);
        }));
    }
}