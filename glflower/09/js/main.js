let latInput = document.getElementById('input-lat');
let longInput = document.getElementById('input-long');

let s = new Scene("stage");

function setSeed()
{
    let lat = parseFloat(latInput.value);
    let long = parseFloat(longInput.value);

    s.setFlowerSeedFromLocation(lat, long);
}



/*
let r = new StableRandom();

let count = [];
let n;
for (let i=0; i < 10000; i++)
{
    // console.log(r.random());
    n = r.randInt(0,10);
    console.log(n);
    if (count[n] != undefined)
    {
        count[n]++;
    }
    else
    {
        count[n] = 1;
    }
    // count[n] = count[n] ? count[n]++ : 1;
}
console.log(count);
*/