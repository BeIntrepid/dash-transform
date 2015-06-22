import * as transform from '../src/index';

describe('a first test suite', () => {
    describe('Simple Pipe', () => {
        it("should run and pass", () => {
            var filterLib = new transform.TransformLibrary();
            new Util.registerFilters(filterLib);

            var pr = filterLib.getFilterWrapped('GetDataArray');
            var pipeline = new transform.Pipe('Simple Pipe',pr);

            pipeline .execute('Input').then((o)=>{
                console.log(Util.equals([1,2,3,4],o));
            });

        });
    });

    describe('chained filters', () => {
        it("should run and pass", () => {

            var filterLib = new transform.TransformLibrary();
            Util.registerFilters(filterLib);

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
            Util.registerFilters(filterLib);

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
            Util.registerFilters(filterLib);

            var pr = filterLib.getFilterWrapped('GetDataArray');
            var pipeline = new transform.Pipe('Simple Pipe',pr);

            var pipeWithPipeInput = new transform.Pipe('DependentPipe',pipeline);


            pipeWithPipeInput.execute('Input').then((o)=>{
                console.log(Util.equals([1,2,3,4],o));
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