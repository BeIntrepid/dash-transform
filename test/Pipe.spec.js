import * as transform from '../src/index';

class TestConfig
{
    static dontExecute = true;
}

var ignore = {describe : ()=>{}};

ignore.describe('a first test suite', () => {

    describe('Simple Pipe', () => {
        it("should run and pass", () => {

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

describe('inputOverride', () => {


    ignore.describe('A single pipe with input spec should give a single value', () => {
        it("should run and pass", () => {

            var switchableInputInputSpec = [{name:"MyValue"}];
            var filterLib = new transform.TransformLibrary();
            filterLib.clearAll();

            filterLib.registerFilter(new transform.FunctionFilter('SwitchableInput',(input,i)=>{
                return [1,2,3,4];
            },switchableInputInputSpec));


            var pr = filterLib.getFilterWrapped('SwitchableInput');
            var pipe = new transform.Pipe('MySwitchableInputPipe', pr);


            var ds = new transform.Stream(pipe);

            var spec = ds.buildInputSpec();
            expect(spec.SwitchableInput_MyValue).toBe(0);
            console.dir(JSON.parse(JSON.stringify(spec)));
        });
    });

    ignore.describe('A pipe with an input step should give correct values', () => {
        it("should run and pass", () => {

            var switchableInputInputSpec = [{name:"MyValue"}];
            var filterLib = new transform.TransformLibrary();
            filterLib.clearAll();

            filterLib.registerFilter(new transform.FunctionFilter('SwitchableInput',(input,i)=>{
                return [1,2,3,4];
            },switchableInputInputSpec));

            var parentInputSpec = [{name:"i"}];
            filterLib.registerFilter(new transform.FunctionFilter('SwitchableInputParent',(input,i)=>{
                return [1,2,3,4];
            },parentInputSpec));

            var switchableInputNode = filterLib.getFilterWrapped('SwitchableInput');
            var switchableInputParentNode = filterLib.getFilterWrapped('SwitchableInputParent');

            switchableInputNode.addInput(switchableInputParentNode);
            var pipe = new transform.Pipe('MySwitchableInputPipe', switchableInputNode);
            var ds = new transform.Stream(pipe);

            var spec = ds.buildInputSpec();
            expect(spec.SwitchableInput_MyValue).toBe(0);
            expect(spec.SwitchableInput_SwitchableInputParent_i).toBe(0);
            console.dir(JSON.parse(JSON.stringify(spec)));
        });
    });

    ignore.describe('A pipe with more than one step inside returns correct values', () => {
        it("should run and pass", () => {

            var switchableInputInputSpec = [{name:"MyValue"}];
            var filterLib = new transform.TransformLibrary();
            filterLib.clearAll();

            filterLib.registerFilter(new transform.FunctionFilter('SwitchableInput',(input,i)=>{
                return [1,2,3,4];
            },switchableInputInputSpec));

            var parentInputSpec = [{name:"i"}];
            filterLib.registerFilter(new transform.FunctionFilter('SwitchableInputParent',(input,i)=>{
                return [1,2,3,4];
            },parentInputSpec));

            var parentParentInputSpec = [{name:"i"}];
            filterLib.registerFilter(new transform.FunctionFilter('SwitchableInputParentParent',(input,i)=>{
                return [1,2,3,4];
            },parentParentInputSpec));

            var switchableInputNode = filterLib.getFilterWrapped('SwitchableInput');
            var switchableInputParentNode = filterLib.getFilterWrapped('SwitchableInputParent');
            var switchableInputParentParentNode = filterLib.getFilterWrapped('SwitchableInputParentParent');

            var pipe = new transform.Pipe('MySwitchableInputPipe', switchableInputParentParentNode);
            pipe.add(switchableInputParentNode);
            pipe.add(switchableInputNode);

            var ds = new transform.Stream(pipe);

            var spec = ds.buildInputSpec();
            expect(spec.SwitchableInput_MyValue).toBe(0);
            expect(spec.SwitchableInput_SwitchableInputParent_i).toBe(0);
            console.dir(JSON.parse(JSON.stringify(spec)));
        });
    });

    ignore.describe('A pipe containing a pipe returns correct values', () => {
        it("should run and pass",function (done) {

            var switchableInputInputSpec = [{name:"MyValue"}];
            var filterLib = new transform.TransformLibrary();
            filterLib.clearAll();

            // Build Filters

            filterLib.registerFilter(new transform.FunctionFilter('SwitchableInput',(input,i)=>{
                console.log('Filter running ' + 'SwitchableInput');
                return [1,2,3,4];
            },switchableInputInputSpec));

            var parentInputSpec = [{name:"SwitchableInputParentVALUE"}];
            filterLib.registerFilter(new transform.FunctionFilter('SwitchableInputParent',(input,i)=>{
                console.log('Filter running ' + 'SwitchableInputParent');
                return [1,2,3,4];
            },parentInputSpec));

            var parentParentInputSpec = [{name:"i"}];
            filterLib.registerFilter(new transform.FunctionFilter('SwitchableInputInternalParent',(input,i)=>{
                console.log('Filter running ' + 'SwitchableInputInternalParent');
                return [1,2,3,4];
            },parentParentInputSpec));

            var switchableInputNode = filterLib.getFilterWrapped('SwitchableInput');
            var switchableInputParentNode = filterLib.getFilterWrapped('SwitchableInputParent');
            var switchableInputInternalParent = filterLib.getFilterWrapped('SwitchableInputInternalParent');

            // Register Pipes
            var pipe = new transform.Pipe('FirstPipe');
            pipe.add(switchableInputInternalParent );
            pipe.add(switchableInputNode);
            pipe.rootNode.addInput(switchableInputInternalParent );

            var pipeNode = new transform.TransformNode('asdf',pipe);
            pipeNode.addInput(switchableInputParentNode);

            var ds = new transform.Stream(pipeNode );

            var spec = ds.buildInputSpec();

            //expect(spec.SwitchableInput_MyValue).toBe(0);
            //expect(spec.SwitchableInput_SwitchableInputParent_i).toBe(0);
            //console.dir(JSON.parse(JSON.stringify(spec)));
            var executePromise = ds.execute();

            executePromise.then(()=>{

                done();
            });


        });
    });

    describe('Testing Stream Cloning', () => {
        it("should run and pass",function (done) {

            var switchableInputInputSpec = [{name:"MyValue"}];
            var filterLib = new transform.TransformLibrary();
            filterLib.clearAll();

            // Build Filters

            filterLib.registerFilter(new transform.FunctionFilter('SwitchableInput',(input,i)=>{
                console.log('Filter running ' + 'SwitchableInput');
                return [1,2,3,4];
            },switchableInputInputSpec));

            var parentInputSpec = [{name:"SwitchableInputParentVALUE"},{name:"SwitchableInputParentSECONDVALUE"}];
            filterLib.registerFilter(new transform.FunctionFilter('SwitchableInputParent',(input,i,j)=>{
                console.log('Filter running ' + 'SwitchableInputParent');
                console.log(i);
                return [1,2,3,4];
            },parentInputSpec));

            var parentParentInputSpec = [{name:"i"}];
            filterLib.registerFilter(new transform.FunctionFilter('SwitchableInputInternalParent',(input,i)=>{
                console.log('Filter running ' + 'SwitchableInputInternalParent');
                return [1,2,3,4];
            },parentParentInputSpec));

            var switchableInputNode = filterLib.getFilterWrapped('SwitchableInput');
            var switchableInputParentNode = filterLib.getFilterWrapped('SwitchableInputParent');
            var switchableInputInternalParent = filterLib.getFilterWrapped('SwitchableInputInternalParent');

            // Register Pipes
            var pipe = new transform.Pipe('FirstPipe');
            pipe.add(switchableInputInternalParent );


            pipe.add(switchableInputNode);
            pipe.rootNode.addInput(switchableInputInternalParent );


            var pipeNode = new transform.TransformNode('asdf',pipe);
            pipeNode.addInput(switchableInputParentNode);

            var ds = new transform.Stream(pipeNode );

            ds.build();

            var inputs = ds.getMapInputs();
            inputs.SwitchableInputParent.forInput('SwitchableInputParentVALUE').value = 'OhEmGee';

            console.dir(JSON.parse(JSON.stringify(inputs)));

            console.log(ds.pipe.rootNode.ancestors[0].name);

            //expect(spec.SwitchableInput_MyValue).toBe(0);
            //expect(spec.SwitchableInput_SwitchableInputParent_i).toBe(0);
            //console.dir(JSON.parse(JSON.stringify(spec)));
            var executePromise = ds.execute();

            executePromise.then(()=>{

                done();
            });


        });
    });

    ignore.describe('Testing input aggregation', () => {
        it("should run and pass", () => {
            var pipeInputSpec = JSON.parse('{"name":"SwitchableInputPipe","inputs":[[[{"name":"MyValue"}]]],"ancestors":[{"name":"SwitchableInputParentPipe","inputs":[[[{"name":"i"}]]],"ancestors":[]}]}');
            var pipe = new transform.Pipe('SwitchableInputPipe', null);

            var spec = pipe.flattenPipeSpec(pipeInputSpec);
            console.dir(JSON.parse(JSON.stringify(spec)));
        });
    });


    ignore.describe('Testing input aggregation', () => {
        it("should run and pass", () => {

            var switchableInputInputSpec = [{name:"MyValue"}];
            var inputSpec = [{name:"i"}];
            var filterLib = new transform.TransformLibrary();
            filterLib.registerFilter(new transform.FunctionFilter('SwitchableInput',(input,i)=>{
                return [1,2,3,4];
            },switchableInputInputSpec));

            filterLib.registerFilter(new transform.FunctionFilter('SwitchableInputParent',(input,i)=>{
                return [1,2,3,4];
            },inputSpec));

            filterLib.registerFilter(new transform.FunctionFilter('SwitchableInputParentParent',(input,i)=>{
                return [1,2,3,4];
            },inputSpec));

            var pr = filterLib.getFilterWrapped('SwitchableInput');
            var pipe = new transform.Pipe('MySwitchableInputPipe', pr);

            var secondParent = filterLib.getFilterWrapped('SwitchableInputParent');
            secondParent.addInput(filterLib.getFilterWrapped('SwitchableInputParentParent'));

            pr.addInput(secondParent);
            pr.addInput(filterLib.getFilterWrapped('SwitchableInputParent'));

            var ds = new transform.Stream(pipe);

            var spec = ds.buildInputSpec();

            console.dir(JSON.parse(JSON.stringify(spec)));
        });
    });


    ignore.describe('Testing input aggregation', () => {
        it("should run and pass", () => {

            var switchableInputInputSpec = [{name:"MyValue"}];
            var inputSpec = [{name:"i"}];
            var filterLib = new transform.TransformLibrary();

            filterLib.registerFilter(new transform.FunctionFilter('SwitchableInput',(input,i)=>{
                return [1,2,3,4];
            },switchableInputInputSpec));

            filterLib.registerFilter(new transform.FunctionFilter('SwitchableInputParent',(input,i)=>{
                return [1,2,3,4];
            },inputSpec));

            //filterLib.registerFilter(new transform.FunctionFilter('SwitchableInputParentParent',(input,i)=>{
            //    return [1,2,3,4];
            //},inputSpec));

            var pr = filterLib.getFilterWrapped('SwitchableInput');
            pr.addInput(filterLib.getFilterWrapped('SwitchableInputParent'));

            var pipe = new transform.Pipe('MySwitchableInputPipe', pr);


            //var secondParent = filterLib.getFilterWrapped('SwitchableInputParent');
            //secondParent.addInput(filterLib.getFilterWrapped('SwitchableInputParentParent'));

            //pr.addInput(secondParent);
            //pr.addInput(filterLib.getFilterWrapped('SwitchableInputParent'));

            var ds = new transform.Stream(pipe);

            var spec = ds.buildInputSpec();

            console.dir(JSON.parse(JSON.stringify(spec)));
        });
    });

    ignore.describe('Testing input overrides', () => {
        it("should run and pass", () => {

            var inputSpec = [{name:"i"}];
            var filterLib = new transform.TransformLibrary();

            filterLib.registerFilter(new transform.FunctionFilter('SwitchableInput',(input,i)=>{
                return [1,2,3,4];
            },inputSpec));

            var ds = new transform.Stream(pipeline);

            ds.execute().then((o)=> {
                console.log(Util.equals([1, 2, 3, 4], o));
            });

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