var inversions = 0;

function mergeSort(A)
{
    inversions = 0;
    return sort_rec(A);
}

function sort_rec(A)
{
    if (A.length < 2)
    {
        return A;
    }
    
    var mid = ~~(A.length/2);
    
    var left = sort_rec(A.slice(0,mid));
    var right = sort_rec(A.slice(mid, A.length));
    
    var out = mergeArray(left, right);
    left = null;
    right = null;
    
    return out;

}

function mergeArray(L, R)
{
    var out = new Array();
    var i=0;
    var j=0;
    var n = L.length + R.length;
    
    for (var k=0; k < n; k++)
    {
        if (((i<L.length) && (L[i] <= R[j])) || (j >= R.length))
        {
            out.push(L[i]);
            i++;
        }
        else if (j < R.length) 
        {
            out.push(R[j]);
            inversions += L.length - i;
            j++;
        }
        else
        {
            console.log('ERROR: ' + k + ' ' + i + ' ' + j)
        }
    }
    
    return out;
}